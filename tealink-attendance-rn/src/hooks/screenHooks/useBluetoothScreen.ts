import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, BluetoothEventSubscription } from 'react-native-bluetooth-classic';
import { Permission, PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';
import WorkerMaster from '../../model/workerMaster';
import { useAppSelector } from '../typedReduxHooks';
import { useDispatch } from 'react-redux';
import databaseServices from '../../services/databaseServices';
import { useNavigation } from '../useNavigation';
import { getCurrentRoute } from '../../services/navigationServices';
import Toast from 'react-native-toast-message';
import { setPluckingImg } from '../../store/slices/captureImgSlice';
import { nfcEventEmitter, NfcTag } from '../../utils/nfcEventEmitter';
import { Weighment } from './useRecordPluckingInDetails';
import { trigger } from 'react-native-haptic-feedback';
import DeviceInfo from 'react-native-device-info';
import { companyRoundOffOrg, createTransactionId } from '../../utils/textHelper';
import { Images } from './useMarkTime';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/native';
import SectionMaster from '../../model/sectionMaster';
import ShiftMaster from '../../model/shiftMaster';
import BatchMaster from '../../model/batchMaster';
import { StateChangeEvent } from 'react-native-bluetooth-classic/lib/BluetoothEvent';
import soundServices from '../../services/soundServices';
import { useDebounce } from '../useDebounce';
import KamjariMaster from '../../model/kamjariMaster';
import { saveLog } from '../../services/mmkvServices';
import { getTimezoneOffset } from '../../utils/dateHelper';

export type ConnectingStatus = {
    deviceId: string | undefined;
    status: boolean;
};

type SameLocationData = Record<string, { tId: string; weight: number }>;

const useBluetoothScreen = (weighment: Weighment, section: SectionMaster, shift: ShiftMaster, batch: BatchMaster, kamjari: KamjariMaster) => {
    const navigation = useNavigation();
    const { firstPluckingImg, pluckingImg } = useAppSelector(state => state.captureImg);
    const { moistureDeduction, standardDeduction, tareWeight, flashEnabled, pluckingOneShot } = useAppSelector(state => state.setting);
    // const { online } = useAppSelector(state => state.network);
    const { deviceId, userData, authenticationTime, imageMandatory, batchSameAsDevice } = useAppSelector(state => state.auth);
    const { batchSameAsDeviceId } = useAppSelector(state => state.worker);

    const dispatch = useDispatch();
    const {
        getWorkerByWorkerCode,
        insertToPluckedQuantityMaster,
        getWorkerByWorkerId,
        insertToOfflineMaster,
        insertToOfflineMasterForLocation,
        insertToAttendanceMaster,
    } = databaseServices;
    const { playSuccessSound } = soundServices;

    const [visible, setVisible] = useState(false);
    const [workerCode, setWorkerCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
    const [worker, setWorker] = useState<WorkerMaster>();
    const [paired, setPaired] = useState<BluetoothDevice[]>([]);
    const [connected, setConnected] = useState<BluetoothDevice | null>(null);
    const [currentWeight, setCurrentWeight] = useState(0.0);
    const [isConnecting, setIsConnecting] = useState<ConnectingStatus>({ deviceId: undefined, status: false });
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [identifyUser, setIdentifyUser] = useState(0);
    const [sameLocationData, setSameLocationData] = useState<SameLocationData>({});
    const [isFlashing, setIsFlashing] = useState<boolean>(false);
    const [pluckingCount, setPluckingCount] = useState<number>(0);

    const subscriptionRef = useRef<BluetoothEventSubscription | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isForceDisconnected = useRef<boolean>(false);
    const reconnectCount = useRef(1);

    /* --------------------------------------------------
     * 1. Permissions & Device Discovery
     * -------------------------------------------------- */
    const initializeBluetooth = useCallback(async () => {
        try {
            if (Platform.OS === 'android') {
                // Define required permissions based on Android version
                let permissionsToRequest: Permission[];

                if (Platform.Version >= 31) {
                    // Android 12 (API 31) and above: use BLUETOOTH_SCAN & BLUETOOTH_CONNECT
                    permissionsToRequest = [
                        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, // Still needed for BLE scanning on some devices/background scanning
                    ];
                } else {
                    // Android 11 and below: use ACCESS_FINE_LOCATION (grants both scan + connect + location)
                    permissionsToRequest = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
                }

                const statuses = await requestMultiple(permissionsToRequest);
                const allGranted = Object.values(statuses).every(status => status === RESULTS.GRANTED);
                if (!allGranted) {
                    console.warn('Some permissions not granted:', statuses);
                }
            }

            const enabled = await RNBluetoothClassic.isBluetoothEnabled();
            if (!enabled) {
                await RNBluetoothClassic.requestBluetoothEnabled();
            }

            await loadPairedDevices();
        } catch (error) {
            console.error('Bluetooth initialization failed:', error);
            setConnectionStatus('Bluetooth Error');
        }
    }, []);

    const loadPairedDevices = async () => {
        try {
            const bonded = await RNBluetoothClassic.getBondedDevices();
            setPaired(bonded);
            console.log('Found paired devices:', bonded.length);
        } catch (error) {
            console.error('Failed to load paired devices:', error);
        }
    };

    /* --------------------------------------------------
     * 2. Optimized Connection with Auto-Reconnect
     * -------------------------------------------------- */
    const connect = async (device: BluetoothDevice) => {
        if (isConnecting.status || connected) return;

        setIsConnecting({ deviceId: device.address, status: true });
        setConnectionStatus('Connecting...');
        console.log('🔌 Attempting to connect...');

        try {
            console.log(`Connecting to ${device.name} (${device.address})`);

            // Optimized connection parameters for weight scales
            await device.connect({
                connectorType: 'rfcomm',
                uuid: '00001101-0000-1000-8000-00805f9b34fb',
                DELIMITER: '', // Key: Empty delimiter for immediate data
                DEVICE_CHARSET: 'utf-8',
                connectionTimeout: 8000,
            });

            setConnected(device);
            setConnectionStatus('Connected');
            setupDataStream(device);

            console.log('✅ Connected successfully');
        } catch (error: any) {
            console.error('❌ Connection failed:', error);
            setConnectionStatus(`Connection Failed: ${error.message}`);

            // Auto-retry connection after 3 seconds
            if (isForceDisconnected.current) {
                return;
            }
            reconnectTimeoutRef.current = setTimeout(() => {
                if (!connected && reconnectCount.current > 0) {
                    console.log('🔄 Retrying connection...');
                    reconnectCount.current--;
                    connect(device);
                }
            }, 3000);

            reconnectCount.current === 0 &&
                Toast.show({
                    type: 'error',
                    text1: 'Failed to connect',
                    text2: 'Unable to Connect to the bluetooth device',
                });
        } finally {
            setIsConnecting({ deviceId: undefined, status: false });
        }
    };

    /* --------------------------------------------------
     * 3. Optimized Data Stream Handler
     * -------------------------------------------------- */
    // ─── Weight Parser: mirrors all native parsing logic ───────────────────────
    const REPLACEMENT_CHAR = '\uFFFD'; // Unicode char 65533
    type ParseResult = {
        weight: number | null;
        caseMatched: string;
    };
    const parseWeightFromDump = (weightDump: string): ParseResult => {
        if (weightDump.indexOf(' kg') > 0) {
            const tokens = weightDump.split(' kg');
            if (tokens.length >= 2) {
                let selectedToken = tokens[tokens.length - 2].trim();
                if (selectedToken.indexOf('.') < 0) {
                    selectedToken = tokens[tokens.length - 1].trim();
                }
                if (selectedToken.indexOf('.') < 0) {
                    return { weight: null, caseMatched: 'kg — no decimal found' };
                }
                return { weight: parseFloat(selectedToken), caseMatched: 'kg' };
            }
            return { weight: null, caseMatched: 'kg — token count < 2' };
        } else if (weightDump.indexOf('\n') > 0) {
            let tokens: string[];
            if (weightDump.indexOf('Kg') >= 0) {
                tokens = weightDump.split(/Kg\r?\n/);
            } else {
                tokens = weightDump.split(/\r?\n/);
            }
            if (tokens.length > 1) {
                const validToken = tokens.find(t => t.trim().length > 0);
                if (validToken) {
                    const parsed = parseFloat(validToken.trim());
                    if (!isNaN(parsed)) return { weight: parsed, caseMatched: 'newline' };
                }
                return { weight: null, caseMatched: 'newline — parse failed' };
            }
            return { weight: null, caseMatched: 'newline — token count <= 1' };
        } else if (weightDump.indexOf('@') > 0) {
            const tokens = weightDump.split('@');
            if (tokens.length >= 3) {
                const value = tokens[tokens.length - 2].replaceAll(REPLACEMENT_CHAR, ' ').trim();
                const parsed = parseFloat(value);
                if (!isNaN(parsed)) return { weight: parsed, caseMatched: '@' };
                return { weight: null, caseMatched: '@ — parse failed' };
            }
            return { weight: null, caseMatched: '@ — token count < 3' };
        } else if (weightDump.indexOf(REPLACEMENT_CHAR) > 0) {
            const tokens = weightDump.split(REPLACEMENT_CHAR);
            if (tokens.length >= 3) {
                const filtered = tokens[tokens.length - 2]
                    .split('')
                    .filter(ch => {
                        const code = ch.charCodeAt(0);
                        return code >= 46 && code <= 57;
                    })
                    .join('');
                const parsed = parseFloat(filtered);
                if (!isNaN(parsed)) return { weight: parsed, caseMatched: 'uFFFD' };
                return { weight: null, caseMatched: 'uFFFD — parse failed' };
            }
            return { weight: null, caseMatched: 'uFFFD — token count < 3' };
        } else {
            return { weight: 0.0, caseMatched: 'fallback' };
        }
    };
    const setupDataStream = (device: BluetoothDevice) => {
        console.log('🎯 Setting up data stream...');

        // Clean up existing subscription
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
        }

        subscriptionRef.current = device.onDataReceived(rawData => {
            try {
                // ── Normalize raw input to string ──────────────────────────────
                let weightDump: string;
                if (typeof rawData === 'string') {
                    weightDump = rawData;
                } else if (rawData?.data) {
                    weightDump = rawData.data;
                } else {
                    weightDump = String(rawData);
                }

                const charCodes = weightDump
                    .split('')
                    .map(c => c.charCodeAt(0))
                    .join(',');

                const { weight, caseMatched } = parseWeightFromDump(weightDump);

                // Save to MMKV
                saveLog({
                    raw: weightDump,
                    charCodes,
                    length: weightDump.length,
                    parsedWeight: weight,
                    caseMatched,
                });

                if (weight !== null) {
                    setCurrentWeight(weight);
                }
            } catch (error) {
                console.error('Data processing error:', error);
            }
        });

        // Set up connection monitoring
        const monitorConnection = setInterval(async () => {
            try {
                const isStillConnected = await device.isConnected();
                if (!isStillConnected && !isForceDisconnected.current) {
                    console.log('⚠️ Connection lost, attempting reconnect...');
                    setConnectionStatus('Connection Lost - Reconnecting...');
                    clearInterval(monitorConnection);
                    await connect(device);
                }
            } catch (error) {
                console.error('Connection monitoring error:', error);
            }
        }, 5000); // Check every 5 seconds

        console.log('✅ Data stream setup complete');
    };

    /* --------------------------------------------------
     * 4. Enhanced Disconnect with Cleanup
     * -------------------------------------------------- */
    const disconnect = useCallback(async () => {
        try {
            setConnectionStatus('Disconnecting...');

            isForceDisconnected.current = true;

            // Clear timeouts
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            // Clean up subscription
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }

            // Disconnect device
            if (connected) {
                await connected.disconnect();
            }

            setConnected(null);
            setConnectionStatus('Disconnected');
            setCurrentWeight(0.0);

            console.log('🔌 Disconnected successfully');
        } catch (error) {
            console.error('Disconnect error:', error);
            setConnectionStatus('Disconnect Error');
        }
    }, [connected]);

    useEffect(() => {
        const timer = setTimeout(() => {
            initializeBluetooth();
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [initializeBluetooth]);

    // FACE DETECTION FUNCTIONS
    const debouncePress = useDebounce(() => {
        navigation.push('FaceDetection', { blinkingEnabled: true, smileDetectionEnabled: false, routeName: getCurrentRoute()?.name });
    }, 300);

    const handlePress = () => {
        setWorker(undefined);
        debouncePress();
    };
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

            await ReactNativeBlobUtil.fs.cp(firstPluckingImg!.photoPath, firstImgPath);
            await ReactNativeBlobUtil.fs.cp(pluckingImg!.photoPath, imagePath);

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

            dispatch(setPluckingImg({ firstImg: null, image: null }));
            return { firstImgPath, imagePath };
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to store images in the TealinkAttendance album',
            });
            console.error(error);
        }
    }, [firstPluckingImg, pluckingImg, dispatch]);

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
            const weightInKg = identifyUser ? identifyUser : currentWeight;
            let calculatedWeight = weightInKg - Number(tareWeight) - (Number(standardDeduction) / 100) * (weightInKg - Number(tareWeight));
            calculatedWeight = Math.round(calculatedWeight * 100) / 100;

            if (calculatedWeight <= 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Weight',
                    text2: 'Please put a valid weight',
                });
                return;
            }

            try {
                setLoading(true);
                const now = new Date();
                const recordDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const recordTime = Date.now();

                const data = {
                    appVersionName: DeviceInfo.getVersion(),
                    workerId: w ? w.workerId : worker?.workerId,
                    hasImage: pluckingImg ? true : false,
                    pluckingQuantity: calculatedWeight,
                    weighment: weighment?.id,
                    manualEntry: w ? false : true,
                    identificationMode: w ? 'NFC' : 'manual',
                    tareWeight: tareWeight,
                    kamjariId: kamjari?.kamjariId,
                    v: '2',
                    authenticationTime: authenticationTime,
                    qtyCalculated: companyRoundOffOrg(userData?.roundOff, calculatedWeight),
                    deviceId: deviceId,
                    companyId: userData?.companyId,
                    originalPluckingQuantity: weightInKg,
                    standardDeviation: standardDeduction,
                    moisturePercentage: moistureDeduction,
                    recordedTimezoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
                    transactionId: createTransactionId(),
                    managerId: userData?.userId,
                    bookId: w ? w.workerBookId : worker?.workerBookId,
                    sectionId: section?.sectionId,
                    shift: shift?.shiftId,
                    batch: batch?.batchId,
                    div: w?.workerDivision ?? worker?.workerDivision,
                    recordDate: recordDate,
                    recordTime: recordTime,
                };

                if (batch?.batchId) {
                    data.batch = batch?.batchId;
                } else if (batchSameAsDevice) {
                    data.batch = batchSameAsDeviceId;
                }

                let imagePaths: Images;
                console.log({ firstPluckingImg, pluckingImg });
                if (firstPluckingImg && pluckingImg) {
                    const res = await handleSaveImages();
                    imagePaths = { firstShot: res!.firstImgPath, shot: res!.imagePath };
                }
                console.log({ data, imagePaths });

                if (imageMandatory && !imagePaths) {
                    Toast.show({
                        type: 'error',
                        text1: 'Image Required',
                        text2: 'Please capture image',
                    });
                    return;
                }

                await insertToPluckedQuantityMaster(data);
                await insertToAttendanceMaster(data);
                setIdentifyUser(0); // Resetting the value for live detecting

                if (flashEnabled) {
                    setIsFlashing(true);
                }
                setSameLocationData(prev => ({ ...prev, [data.workerId]: { tId: data.transactionId, weight: data.pluckingQuantity } }));

                // Resetting the values for live detecting after success
                setWorkerCode('');
                playSuccessSound();
                setPluckingCount(prev => prev + 1);
                await insertToOfflineMaster(data, imagePaths, 'PLUCKED_QUANTITY');
            } catch (error: any) {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'An error occurred while saving data.',
                });
            } finally {
                setLoading(false);
            }
        },
        [
            worker,
            userData,
            currentWeight,
            weighment?.id,
            insertToPluckedQuantityMaster,
            tareWeight,
            authenticationTime,
            deviceId,
            standardDeduction,
            moistureDeduction,
            identifyUser,
            handleSaveImages,
            firstPluckingImg,
            pluckingImg,
            insertToOfflineMaster,
            setSameLocationData,
            batch,
            section,
            shift,
            kamjari,
            flashEnabled,
            imageMandatory,
            batchSameAsDevice,
            batchSameAsDeviceId,
            playSuccessSound,
            insertToAttendanceMaster,
        ],
    );

    const sendLocationData = useCallback(async () => {
        if (Object.keys(sameLocationData).length === 0) {
            return;
        }

        try {
            let latitude = '';
            let longitude = '';
            const locationPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
            const locationStatus = await request(locationPermission);

            if (locationStatus !== RESULTS.GRANTED) {
                Toast.show({
                    type: 'error',
                    text1: 'Permission Denied',
                    text2: 'Location permission is required to record coordinates.',
                });
                return;
            }

            const isLocationEnabled = await DeviceInfo.isLocationEnabled();
            if (!isLocationEnabled) {
                Alert.alert('Location Disabled', 'Please enable location services to record attendance.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]);
                return;
            }

            const position: any = await new Promise((resolve, reject) => {
                console.log('Inside Promise - setting up getCurrentPosition...');

                const timeoutId = setTimeout(() => {
                    reject(new Error('Location request timed out'));
                }, 15000); // 15 second timeout

                Geolocation.getCurrentPosition(
                    pos => {
                        clearTimeout(timeoutId);
                        resolve(pos);
                    },
                    err => {
                        clearTimeout(timeoutId);
                        reject(err);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0,
                    },
                );
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            const transactions: string[] = [],
                workers: string[] = [];
            let weightSummation: number = 0;
            Object.entries(sameLocationData).forEach(([key, value]) => {
                workers.push(key);
                transactions.push(value.tId);
                weightSummation += value.weight;
            });

            const dataForLocation = {
                companyId: userData?.companyId,
                latitude: latitude,
                longitude: longitude,
                managerId: userData?.userId,
                recordTime: Date.now(),
                weighment: weighment?.id,
                transactions: transactions,
                workers: workers,
                calculatedWeightSummation: weightSummation.toString(),
                appVersionName: DeviceInfo.getVersion(),
                recordedTimeZoneOffset: getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone),
            };

            console.log({ dataForLocation });

            await insertToOfflineMasterForLocation('POST', JSON.stringify(dataForLocation), 'PLUCKED_QUANTITY_LOCATION');
        } catch (error: any) {
            console.error(error);
            if (error.code === 2) {
                // POSITION_UNAVAILABLE
                Toast.show({
                    type: 'error',
                    text1: 'Location unavailable',
                    text2: 'Please check your GPS signal or try outdoors.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'An error occurred while saving data.',
                });
            }
        }
    }, [userData?.companyId, weighment?.id, sameLocationData, insertToOfflineMasterForLocation, userData?.userId]);

    const handleSpecialTag = useCallback(
        async (tag: NfcTag) => {
            if (connected) {
                if (pluckingOneShot || identifyUser > 0) {
                    const workerId = tag?.ndefMessage?.[0]?.payload?.map((b: number) => b.toString(16).padStart(2, '0')).join('');
                    const w = await getWorkerByWorkerId(workerId);
                    w && setWorker(w);
                    if (!w) {
                        Toast.show({
                            type: 'error',
                            text1: 'No worker found with this NFC Card',
                        });
                        return;
                    }
                    manualWorkerSelect(w);
                } else if (!pluckingOneShot && identifyUser === 0) {
                    Alert.alert(
                        'Plucking Record One shot is disabled',
                        'Please enable plucking record one shot from settings to directly record the plucking',
                    );
                }
            }
        },
        [manualWorkerSelect, getWorkerByWorkerId, pluckingOneShot, identifyUser, connected],
    );

    const pressIdentifyUser = () => {
        if (currentWeight <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Weight',
                text2: 'Please put a valid weight',
            });
            return;
        }

        setIdentifyUser(currentWeight);
        setWorker(undefined);
        trigger('impactLight');
        console.log(currentWeight);
    };

    const goLive = () => {
        setIdentifyUser(0);
        setWorker(undefined);
        trigger('impactLight');
    };

    useEffect(() => {
        return nfcEventEmitter.onTag(handleSpecialTag); // ✅ clean, typed, no error
    }, [handleSpecialTag]);

    /* --------------------------------------------------
     * 6. Cleanup on Unmount
     * -------------------------------------------------- */
    useEffect(() => {
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        // 1. Set initial state
        const checkInitialState = async () => {
            try {
                const enabled = await RNBluetoothClassic.isBluetoothEnabled();
                if (isMounted) {
                    setIsBluetoothEnabled(enabled);
                }
            } catch (error) {
                console.warn('Failed to check initial Bluetooth state:', error);
                if (isMounted) {
                    setIsBluetoothEnabled(false);
                }
            }
        };

        checkInitialState();

        // 2. Subscribe to state change events
        const subscription = RNBluetoothClassic.onStateChanged((event: StateChangeEvent) => {
            if (isMounted) {
                console.log('Bluetooth state changed:', event.state);
                setIsBluetoothEnabled(event.enabled); // event.state will be 'PoweredOn' or 'PoweredOff'
            }
        });

        // 3. Cleanup on unmount
        return () => {
            isMounted = false;
            subscription.remove(); // Critical: prevent memory leaks
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                sendLocationData();
                navigation.goBack();
                disconnect();
                dispatch(setPluckingImg({ firstImg: null, image: null }));
                return true; // Prevent default back navigation
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove(); // Cleanup
        }, [sendLocationData, navigation, disconnect, dispatch]),
    );

    return {
        isBluetoothEnabled,
        isConnecting,
        connected,
        paired,
        connectionStatus,
        currentWeight,
        connect,
        disconnect,
        loadPairedDevices,
        loading,
        worker,
        setWorker,
        firstPluckingImg,
        pluckingImg,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        workerCode,
        setWorkerCode,
        findWorker,
        manualWorkerSelect,
        identifyUser,
        pressIdentifyUser,
        goLive,
        sendLocationData,
        isFlashing,
        setIsFlashing,
        pluckingCount,
    };
};

export default useBluetoothScreen;
