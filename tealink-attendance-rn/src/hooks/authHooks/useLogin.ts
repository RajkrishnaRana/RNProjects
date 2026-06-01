import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { postData } from '../../services/apiServices';
import { trigger } from 'react-native-haptic-feedback';
import { cleanSlashFromUrl, isValidUrl } from '../../utils/urlHelper';
import { useAppDispatch, useAppSelector } from '../typedReduxHooks';
import { setBaseURL, setLastSyncTime, setUserInformation } from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import databaseServices from '../../services/databaseServices';
import { unzip } from 'react-native-zip-archive';
import RNFetchBlob from 'react-native-blob-util';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import { loginSession } from '../../store/slices/sessionSlice';
import moment from 'moment-timezone';
import { getTimezoneOffset } from '../../utils/dateHelper';
import DeviceInfo from 'react-native-device-info';
import { saveLogInOut } from '../../services/mmkvServices';

// ZOD VALIDATION SCHEMA  ------------>
const baseUrlSchema = z.object({
    baseURL: z.string({ error: 'Base URL is required' }).min(1, 'Base URL cannot be empty').refine(isValidUrl, { error: 'Please enter a valid URL' }),
});
export type BaseURLDataType = z.infer<typeof baseUrlSchema>;

const loginSchema = z.object({
    username: z.string({ error: 'Username is required' }).min(1, 'Username cannot be empty'),
    password: z.string({ error: 'Password is required' }).min(1, 'Password cannot be empty'),
    deviceName: z.string({ error: 'Device ID is required' }).min(1, 'Device ID cannot be empty'),
});
export type LoginDataType = z.infer<typeof loginSchema>;

export const useLogin = () => {
    const dispatch = useAppDispatch();

    // SERVICES ------------------>
    const { initializeDbFromLoginData } = databaseServices;

    // GLOBAL HOOKS --------------->
    const { baseURL, deviceName, userName, password, deviceId, lastSyncTime, lastVerifiedTimezoneOffset } = useAppSelector(state => state.auth);
    const { online } = useAppSelector(state => state.network);

    // FORM HOOKS ---------------->
    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BaseURLDataType>({
        resolver: zodResolver(baseUrlSchema),
        defaultValues: {
            baseURL: baseURL || '',
        },
    });

    const {
        control: loginControl,
        handleSubmit: handleLogin,
        watch: loginFormWatch,
        formState: { errors: loginErrors },
    } = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            deviceName: deviceName || '',
            username: userName || '',
        },
    });

    // Watch some form value
    const formBaseURL = watch('baseURL');
    const formDeviceName = loginFormWatch('deviceName');

    // LOCAL HOOKS ------------------>
    const [disableDownload, setDisableDownload] = useState(false);
    const [configSaved, setConfigSaved] = useState(false);
    const [loading, setLoading] = useState({
        login: false,
        config: false,
        downloadWorkerImg: false,
        finalizingData: false,
    });
    const [isQRCodeScan, setIsQRCodeScan] = useState(false);

    // FORM SUBMIT FUNCTION  ------------>
    // Function to save base url
    const onSaveConfig = async (data: BaseURLDataType) => {
        const url = `${cleanSlashFromUrl(data.baseURL)}/app/server-info.json`;
        const payload = {
            timezoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
        };
        // console.log('baseConfigurl', url, payload);

        try {
            setLoading(prev => ({ ...prev, config: true }));
            const res = await postData(url, payload);

            // console.log('config res', res);

            if (res.status) {
                Toast.show({ type: 'error', text1: String(res.msg || 'Login failed') });
                return;
            }

            if (!res.supportedVersion.includes(DeviceInfo.getVersion())) {
                trigger('impactLight');
                Toast.show({
                    type: 'error',
                    text1: 'App version not supported',
                    text2: 'You have to update the app to login',
                });
                return;
            }

            Toast.show({ type: 'success', text1: `Config saved successfully` });
            trigger('impactLight');
            dispatch(setBaseURL(cleanSlashFromUrl(data.baseURL)));
            setConfigSaved(true);
        } catch (error: any) {
            if (!online) {
                Toast.show({ type: 'error', text1: 'Missing Internet' });
            } else if (error?.message?.includes('Network request failed') || error?.message?.includes('HTTP 404')) {
                Toast.show({ type: 'error', text1: 'Invalid URL' });
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Some unknown error occured' });
            }
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, config: false }));
        }
    };

    // Function to login
    const onLogin = async (data: LoginDataType) => {
        try {
            setLoading(prev => ({ ...prev, login: true }));

            if (online) {
                const url = `${baseURL}/app/authenticate-manager.json`;
                const payload = {
                    userId: data.username,
                    password: data.password,
                    deviceName: data.deviceName,
                    deviceId: formDeviceName === deviceName ? deviceId : '',
                    timezoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
                };

                console.log({ payload });

                const res = await postData(url, payload);
                console.log('login res', res);
                if (res.status) {
                    trigger('impactLight');
                    Toast.show({
                        type: 'error',
                        text1: 'Login Failed',
                        text2: String(res.msg || 'Some unknown error occured'),
                        visibilityTime: 5000,
                    });
                    return;
                }

                // Initialize a array for the worker profile Image to download the array
                const workerIdMap: Record<string, string> = {};
                if (!disableDownload) {
                    const workerIds = res?.data?.workers?.map((worker: Worker) => worker.profileImage && worker._id).filter(Boolean);

                    try {
                        // Create temporary zip file path
                        const tempZipPath = `${RNFetchBlob.fs.dirs.CacheDir}/temp_images_${Date.now()}.zip`;

                        // Download the ZIP file directly using RNFetchBlob
                        setLoading(prev => ({ ...prev, downloadWorkerImg: true }));
                        const response = await RNFetchBlob.config({
                            path: tempZipPath,
                        }).fetch(
                            'POST',
                            `${baseURL}/app/download-worker-image.zip`,
                            {
                                'Content-Type': 'application/json',
                            },
                            JSON.stringify({ workerIds }),
                        );

                        if (response.respInfo.status !== 200) {
                            throw new Error(`HTTP ${response.respInfo.status}: Download failed`);
                        }

                        // Extract the zip file
                        const extractPath = `${RNFetchBlob.fs.dirs.DocumentDir}/extracted_images_${Date.now()}/`;

                        // Ensure directory exists
                        const dirExists = await RNFetchBlob.fs.exists(extractPath);
                        if (!dirExists) {
                            await RNFetchBlob.fs.mkdir(extractPath);
                        }

                        await unzip(tempZipPath, extractPath);

                        // Clean up the zip file
                        await RNFetchBlob.fs.unlink(tempZipPath);

                        // Read extracted image files
                        const imageFileNames = await RNFetchBlob.fs.ls(extractPath);
                        const imagePaths = imageFileNames.map(fileName => `${extractPath}${fileName}`);
                        imagePaths.forEach(imagePath => {
                            const workerId = imagePath.split('/')[imagePath.split('/').length - 1].split('.')[0];
                            workerIdMap[workerId] = `file://${imagePath}`;
                        });

                        console.log('Extracted image paths-------:', workerIdMap);
                    } catch (error) {
                        console.error('Error processing zip file:', error);
                    } finally {
                        setLoading(prev => ({ ...prev, downloadWorkerImg: false }));
                    }
                }

                // Initialize DB with the server data
                setLoading(prev => ({ ...prev, finalizingData: true }));
                await initializeDbFromLoginData(res?.data, workerIdMap);
                const userData = {
                    ...res?.data?.userProfile,
                    allowUpdateWorker: res?.data?.allowUpdateWorker,
                    allowAssignWorker: res?.data?.allowAssignWorker,
                    privileges: res?.data?.privileges,
                    subscriptionEnd: res?.data?.subscriptionEnd,
                    appInfo: res?.data?.appInfo,
                    roundOff: res?.data?.roundOff,
                    includeImageInAllTransaction: res?.data?.includeImageInAllTransaction,
                    companyName: res?.data?.gardenConfig?.companyName,
                    device: res?.data?.device,
                };
                setLoading(prev => ({ ...prev, finalizingData: false }));

                // Save user profile data
                dispatch(loginSession());
                dispatch(
                    setUserInformation({
                        userName: data.username,
                        password: data.password,
                        deviceName: data.deviceName,
                        lastVerifiedTimezoneOffset: payload.timezoneOffset,
                        lastVerifiedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        userData: userData,
                        gardenConfig: res?.data?.gardenConfig,
                        deviceId: res?.data?.device?.id,
                        authenticationTime: res?.now,
                    }),
                );
                lastSyncTime === '' && dispatch(setLastSyncTime(moment().format('D MMM h:mm a')));
            } else {
                if (data.username !== userName) {
                    trigger('impactLight');
                    Toast.show({
                        type: 'error',
                        text1: 'Internet Required',
                        text2: 'You have to turn on Internet to login in differenct account',
                    });
                    return;
                }

                if (data.username === userName && data.password !== password) {
                    trigger('impactLight');
                    Toast.show({
                        type: 'error',
                        text1: 'Invalid Password (No Internet)',
                        text2: `Invalid password for ${data.username}`,
                    });
                    return;
                }

                if (lastVerifiedTimezoneOffset !== getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone)) {
                    trigger('impactLight');
                    Toast.show({
                        type: 'error',
                        text1: 'Timezone Mismatch (No Internet)',
                        text2: 'Your last successful login was in different timezone',
                    });
                    return;
                }

                dispatch(loginSession());
                trigger('impactLight');
                Toast.show({
                    type: 'success',
                    text1: 'Logged in offline mode',
                });
            }

            saveLogInOut({ type: 'Log In' });
        } catch (error: any) {
            trigger('impactLight');
            if (!online || error?.message?.includes('Network request failed')) {
                Toast.show({ type: 'error', text1: 'Missing Internet' });
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Some unknown error occured' });
            }
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, login: false }));
        }
    };

    const onQRCodeScanned = (codes: any[]) => {
        if (codes.length > 0) {
            console.log(codes[0].value);
            setValue('baseURL', codes[0].value);
            onSaveConfig({ baseURL: cleanSlashFromUrl(codes[0].value) });
        }
    };

    // SIDE EFFECTS ----------------------------->
    // Check if the base config is saved or not. if saved, then set the configSaved to true
    useEffect(() => {
        setConfigSaved(formBaseURL === baseURL);
    }, [formBaseURL, baseURL, setConfigSaved]);

    // Handle Back Button Alert
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Exit App',
                    'Are you sure, you want to exit?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: () => BackHandler.exitApp(),
                        },
                    ],
                    { cancelable: false },
                );
                return true; // Prevent default back navigation
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove(); // Cleanup
        }, []),
    );

    return {
        control,
        loginControl,
        handleSaveConfig: handleSubmit(onSaveConfig),
        handleLoginPress: handleLogin(onLogin),
        errors,
        loginErrors,
        disableDownload,
        setDisableDownload,
        configSaved,
        loading,
        isQRCodeScan,
        setIsQRCodeScan,
        onQRCodeScanned,
    };
};
