import { useCallback, useEffect, useState } from 'react';
import { database } from '../../..';
import SectionMaster from '../../model/sectionMaster';
import KamjariMaster from '../../model/kamjariMaster';
import BatchMaster from '../../model/batchMaster';
import ShiftMaster from '../../model/shiftMaster';
import { useAppDispatch, useAppSelector } from '../typedReduxHooks';
import { useNavigation } from '../useNavigation';
import { getCurrentRoute } from '../../services/navigationServices';
import { BackHandler, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import { setNonPluckingImg } from '../../store/slices/captureImgSlice';
import WorkerMaster from '../../model/workerMaster';
import databaseServices from '../../services/databaseServices';
import { nfcEventEmitter } from '../../utils/nfcEventEmitter';
import DeviceInfo from 'react-native-device-info';
import { createTransactionId } from '../../utils/textHelper';
import { Images } from './useMarkTime';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useFocusEffect } from '@react-navigation/native';
import soundServices from '../../services/soundServices';
import { useDebounce } from '../useDebounce';
import { getTimezoneOffset } from '../../utils/dateHelper';
import { Q } from '@nozbe/watermelondb';

const useRecordNonPluckingDetails = () => {
    const navigation = useNavigation();
    const { deviceId, userData, imageMandatory, defaultKamjariFlow, batchSameAsDevice } = useAppSelector(state => state.auth);
    const { firstNonPluckingImg, nonPluckingImg } = useAppSelector(state => state.captureImg);
    const { batchSameAsDeviceId } = useAppSelector(state => state.worker);
    const dispatch = useAppDispatch();
    const { getWorkerByWorkerCode, insertToAttendanceMaster, getWorkerByWorkerId, insertToOfflineMaster } = databaseServices;
    const { playSuccessSound } = soundServices;

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [section, setSection] = useState<SectionMaster>();
    const [allSection, setAllSection] = useState<SectionMaster[]>([]);
    const [kamjari, setKamjari] = useState<KamjariMaster>();
    const [allKamjari, setAllKamjari] = useState<KamjariMaster[]>([]);
    const [batch, setBatch] = useState<BatchMaster>();
    const [allBatch, setAllBatch] = useState<BatchMaster[]>([]);
    const [shift, setShift] = useState<ShiftMaster>();
    const [allShift, setAllShift] = useState<ShiftMaster[]>([]);
    const [workerCode, setWorkerCode] = useState('');
    const [worker, setWorker] = useState<WorkerMaster>();
    const [workerCount, setWorkerCount] = useState<string[]>([]);

    const handlePress = useDebounce(() => {
        navigation.push('FaceDetection', { blinkingEnabled: true, smileDetectionEnabled: false, routeName: getCurrentRoute()?.name });
    }, 300);

    const handleSaveImages = useCallback(async () => {
        try {
            setLoading(true);
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

            console.log(firstNonPluckingImg?.photoPath, nonPluckingImg?.photoPath);

            // Save the temp file to the files
            const firstImgPath = ReactNativeBlobUtil.fs.dirs.DocumentDir + `/firstImg_${Date.now()}.jpg`;
            const imagePath = ReactNativeBlobUtil.fs.dirs.DocumentDir + `/image_${Date.now()}.jpg`;

            await ReactNativeBlobUtil.fs.cp(firstNonPluckingImg!.photoPath, firstImgPath);
            await ReactNativeBlobUtil.fs.cp(nonPluckingImg!.photoPath, imagePath);

            // Verify files exist
            const firstExists = await ReactNativeBlobUtil.fs.exists(firstImgPath);
            const secondExists = await ReactNativeBlobUtil.fs.exists(imagePath);

            console.log('First image exists:', firstExists, firstImgPath);
            console.log('Second image exists:', secondExists, imagePath);

            dispatch(setNonPluckingImg({ firstImg: null, image: null }));
            setLoading(false);
            return { firstImgPath, imagePath };
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to store images in the TealinkAttendance album',
            });
            console.error(error);
        }
    }, [firstNonPluckingImg, nonPluckingImg, dispatch]);

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
            if (!kamjari && !defaultKamjariFlow) {
                Toast.show({
                    type: 'error',
                    text1: 'Kamjari must be selected',
                });
                return;
            }

            if (!batch) {
                Toast.show({
                    type: 'error',
                    text1: 'Batch must be selected',
                });
                return;
            }

            const now = new Date();
            const data = {
                appVersionName: DeviceInfo.getVersion(),
                manualEntry: w ? false : true,
                deviceId: deviceId,
                workerId: w?.workerId || worker?.workerId,
                sectionId: section?.sectionId,
                kamjariId: '',
                batch: '',
                shift: shift?.shiftId,
                hasImage: firstNonPluckingImg && nonPluckingImg ? true : false,
                recordedTimezoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
                div: w?.workerDivision ?? worker?.workerDivision,
                managerId: userData?.userId,
                transactionId: createTransactionId(),
                companyId: userData?.companyId,
                bookId: w?.workerBookId ?? worker?.workerBookId,
                requestType: 'POST',
                attendanceDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
                recordTime: String(Date.now()),
            };

            // If defaultKamjariFlow is enabled, then only workerdefault kamjari is going to be assigned
            // If defaultKamjariFlow enabled, then if the user didn't select a kamjari or the worker also didn't have a default kamjari, then it will submit a blank string in the kamjariId.
            if (kamjari?.kamjariId) {
                data.kamjariId = kamjari?.kamjariId;
            } else if (defaultKamjariFlow) {
                data.kamjariId = w?.workerDefaultKamjari ?? worker?.workerDefaultKamjari;
            }

            if (batch?.batchId) {
                data.batch = batch?.batchId;
            } else if (batchSameAsDevice) {
                data.batch = batchSameAsDeviceId;
            }

            let imagePaths: Images;
            if (firstNonPluckingImg && nonPluckingImg) {
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

            console.log(data);
            await insertToAttendanceMaster(data);
            setWorkerCount(prev =>
                w
                    ? prev.includes(w.workerId)
                        ? prev
                        : [...prev, w.workerId]
                    : worker?.workerId && prev.includes(worker?.workerId)
                    ? prev
                    : [...prev, worker?.workerId],
            );

            delete (data as any).attendanceDate;

            // After Success
            playSuccessSound();
            setWorkerCode('');
            await insertToOfflineMaster(data, imagePaths, 'NON_PLUCKING_AUTH'); // This function only runs if offline or if the postData failed
        },
        [
            section,
            kamjari,
            defaultKamjariFlow,
            batch,
            shift,
            worker,
            insertToAttendanceMaster,
            firstNonPluckingImg,
            nonPluckingImg,
            userData,
            deviceId,
            insertToOfflineMaster,
            handleSaveImages,
            imageMandatory,
            batchSameAsDevice,
            batchSameAsDeviceId,
            playSuccessSound,
        ],
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sections
                const sectionsCollection = database.collections.get<SectionMaster>('section_master');
                const kamjariCollection = database.collections.get<KamjariMaster>('kamjari_master');
                const batchCollection = database.collections.get<BatchMaster>('batch_master');
                const shiftCollection = database.collections.get<ShiftMaster>('shift_master');

                const [sections, kamjaris, batches, allShifts, allPluckingKamjaris] = await Promise.all([
                    sectionsCollection.query().fetch(),
                    kamjariCollection.query().fetch(),
                    batchCollection.query().fetch(),
                    shiftCollection.query().fetch(),
                    kamjariCollection.query(Q.where('kamjari_type', 'PLUCKING')).fetch(),
                ]);

                const _pluckingKamjaris = [];
                for (let i = 0; i < allPluckingKamjaris.length; i++) {
                    _pluckingKamjaris.push(allPluckingKamjaris[i].kamjariId);
                }

                const shifts = [] as any[];
                for (let i = 0; i < allShifts.length; i++) {
                    const currentShift = allShifts[i];
                    const currentKamjariId = currentShift.kamjariId;
                    if (_pluckingKamjaris.indexOf(currentKamjariId) === -1) {
                        shifts.push(currentShift);
                    }
                }

                setAllSection(sections);
                setAllKamjari(kamjaris);

                const updatedBatches = batches.filter(b => b.batchType !== 'PLUCKING');
                setAllBatch(updatedBatches);
                // const updatedShifts = shifts.filter(s => s.shiftCode !== 'PLK' && s.shiftCode !== 'PLUCKING');
                setAllShift(shifts);
            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load data',
                });
                console.error('WatermelonDB fetch error:', err);
            }
        };

        fetchData();
    }, []);

    const handleSpecialTag = useCallback(
        async (tag: any) => {
            const workerId = tag?.ndefMessage?.[0]?.payload?.map((b: number) => b.toString(16).padStart(2, '0')).join('');
            const w = await getWorkerByWorkerId(workerId);
            if (!w) {
                Toast.show({
                    type: 'error',
                    text1: 'No worker found with this NFC Card',
                });
                return;
            }
            manualWorkerSelect(w);
        },
        [manualWorkerSelect, getWorkerByWorkerId],
    );

    useEffect(() => {
        return nfcEventEmitter.onTag(handleSpecialTag); // ✅ clean, typed, no error
    }, [handleSpecialTag, getWorkerByWorkerId]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                dispatch(setNonPluckingImg({ firstImg: null, image: null }));
                return true; // Prevent default back navigation
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove(); // Cleanup
        }, [navigation, dispatch]),
    );

    return {
        section,
        setSection,
        allSection,
        kamjari,
        setKamjari,
        allKamjari,
        batch,
        setBatch,
        allBatch,
        shift,
        setShift,
        allShift,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        loading,
        firstNonPluckingImg,
        nonPluckingImg,
        workerCode,
        setWorkerCode,
        findWorker,
        worker,
        setWorker,
        workerCount: workerCount.length,
        manualWorkerSelect,
    };
};

export default useRecordNonPluckingDetails;
