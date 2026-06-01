import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../typedReduxHooks';
import { useNavigation } from '../useNavigation';
import Toast from 'react-native-toast-message';
import { setFirstImg, setImage } from '../../store/slices/captureImgSlice';
import { BackHandler, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { getCurrentRoute } from '../../services/navigationServices';
import databaseServices from '../../services/databaseServices';
import WorkerMaster from '../../model/workerMaster';
import { nfcEventEmitter, NfcTag } from '../../utils/nfcEventEmitter';
import DeviceInfo from 'react-native-device-info';
import { createTransactionId } from '../../utils/textHelper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useFocusEffect } from '@react-navigation/native';
import soundServices from '../../services/soundServices';
import { useDebounce } from '../useDebounce';
import { getTimezoneOffset } from '../../utils/dateHelper';

export type PluckingImage = { url: string };
export type Images = { firstShot: string; shot: string } | undefined;

const useMarkTime = () => {
    const navigation = useNavigation();
    const { deviceId, userData, imageMandatory } = useAppSelector(state => state.auth);
    const { firstImg, image } = useAppSelector(state => state.captureImg);
    // const { online } = useAppSelector(state => state.network);
    const dispatch = useAppDispatch();
    const { getWorkerByWorkerCode, insertToAttendanceMaster, insertToOfflineMaster, getWorkerByWorkerId } = databaseServices;
    const { playSuccessSound } = soundServices;

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [blinkingEnabled, setBlinkingEnabled] = useState(true);
    const [smileDetectionEnabled, setSmileDetectionEnabled] = useState(false);
    const [workerCode, setWorkerCode] = useState('');
    const [worker, setWorker] = useState<WorkerMaster>();
    const [workerCount, setWorkerCount] = useState<string[]>([]);

    const handlePress = useDebounce(() => {
        navigation.push('FaceDetection', { blinkingEnabled, smileDetectionEnabled, routeName: getCurrentRoute()?.name });
    }, 300);
    const handleSaveImages = useCallback(async () => {
        try {
            let permission = (Platform.Version as number) >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
            const result = await request(permission);

            if (result !== RESULTS.GRANTED) {
                setLoading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Permission Denied',
                    text2: 'Please enable storage permission',
                });
                return;
            }

            // console.log(firstImg?.photoPath, image?.photoPath);

            // Save the temp file to the files
            const firstImgPath = ReactNativeBlobUtil.fs.dirs.DocumentDir + `/firstImg_${Date.now()}.jpg`;
            const imagePath = ReactNativeBlobUtil.fs.dirs.DocumentDir + `/image_${Date.now()}.jpg`;

            await ReactNativeBlobUtil.fs.cp(firstImg!.photoPath, firstImgPath);
            await ReactNativeBlobUtil.fs.cp(image!.photoPath, imagePath);

            // Verify files exist
            const firstExists = await ReactNativeBlobUtil.fs.exists(firstImgPath);
            const secondExists = await ReactNativeBlobUtil.fs.exists(imagePath);

            console.log('First image exists:', firstExists, firstImgPath);
            console.log('Second image exists:', secondExists, imagePath);

            // Toast.show({
            //     type: 'success',
            //     text1: 'Image Saved',
            //     text2: 'Successfully stored images in the TealinkAttendance album',
            // });

            dispatch(setFirstImg(null));
            dispatch(setImage(null));

            return { firstImgPath, imagePath };
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to store images in the TealinkAttendance album',
            });
            console.error(error);
            return null;
        }
    }, [firstImg, image, dispatch]);

    const findWorker = async () => {
        setLoading(true);
        const selectedWorker = await getWorkerByWorkerCode(workerCode);
        if (selectedWorker.length === 1) {
            setWorker(selectedWorker[0]);
        }
        setLoading(false);
        return selectedWorker;
    };

    const manualWorkerSelect = useCallback(
        async (w?: WorkerMaster | null) => {
            try {
                const now = new Date();
                const data = {
                    appVersionName: DeviceInfo.getVersion(),
                    manualEntry: w ? false : true,
                    deviceId: deviceId,
                    workerId: w?.workerId ?? worker?.workerId,
                    authenticationTime: Date.now(),
                    hasImage: firstImg && image ? true : false,
                    recordedTimeZoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
                    divId: w?.workerDivision ?? worker?.workerDivision,
                    managerId: userData?.userId,
                    transactionId: createTransactionId(),
                    companyId: userData?.companyId,
                    bookId: w?.workerBookId ?? worker?.workerBookId,
                    requestType: 'POST',
                    attendanceDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
                    attendanceTime: Date.now(),
                };
                console.log('markTimeData', data);

                let imagePaths: Images;
                if (firstImg && image) {
                    const res = await handleSaveImages();
                    imagePaths = { firstShot: res!.firstImgPath, shot: res!.imagePath };
                }

                if (imageMandatory && !imagePaths) {
                    Toast.show({
                        type: 'error',
                        text1: 'Image Required',
                        text2: 'Please capture image',
                    });
                    return;
                }

                console.log('inserting to attendance master', data);
                await insertToAttendanceMaster(data);
                console.log(data, imagePaths);
                setWorkerCount(prev =>
                    w
                        ? prev.includes(w.workerId)
                            ? prev
                            : [...prev, w.workerId]
                        : worker?.workerId && prev.includes(worker?.workerId)
                        ? prev
                        : [...prev, worker?.workerId],
                );

                // After success
                playSuccessSound();
                setWorkerCode(''); // Empty the worker code after successful capture
                await insertToOfflineMaster(data, imagePaths, 'WORKER_AUTH'); // This function only runs if offline or if the postData failed
            } catch (error) {
                console.error(error);
            }
        },
        [
            deviceId,
            // authenticationTime,
            firstImg,
            image,
            userData,
            worker,
            handleSaveImages,
            insertToOfflineMaster,
            insertToAttendanceMaster,
            imageMandatory,
            playSuccessSound,
        ],
    );

    const handleSpecialTag = useCallback(
        async (tag: NfcTag) => {
            const workerId = tag?.ndefMessage?.[0]?.payload?.map((b: number) => b.toString(16).padStart(2, '0')).join('');
            const w = await getWorkerByWorkerId(workerId);
            if (!w) {
                Toast.show({
                    type: 'error',
                    text1: 'No worker found with this NFC Card',
                });
                return;
            }
            await manualWorkerSelect(w);
        },
        [manualWorkerSelect, getWorkerByWorkerId],
    );

    useEffect(() => {
        return nfcEventEmitter.onTag(handleSpecialTag); // ✅ clean, typed, no error
    }, [handleSpecialTag]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                dispatch(setFirstImg(null));
                dispatch(setImage(null));
                return true; // Prevent default back navigation
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove(); // Cleanup
        }, [navigation, dispatch]),
    );

    return {
        blinkingEnabled,
        setBlinkingEnabled,
        smileDetectionEnabled,
        setSmileDetectionEnabled,
        firstImg,
        image,
        loading,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        workerCode,
        setWorkerCode,
        worker,
        setWorker,
        workerCount: workerCount.length,
        findWorker,
        manualWorkerSelect,
    };
};

export default useMarkTime;
