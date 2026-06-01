import { useCallback, useEffect, useRef, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import { Alert, AppState, BackHandler, Linking, ToastAndroid } from 'react-native';
import { postData } from '../services/apiServices';
import { useAppSelector } from './typedReduxHooks';
import { storageServices } from '../services/storageServices';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { trigger } from 'react-native-haptic-feedback';
import { getLocationPermission } from '../services/permissionServices';
import { useAppForeground } from './useAppForeground';
import { mmkv } from '../store/mmkvStorage';
import { useFocusEffect } from '@react-navigation/native';
import { NavProp } from '../types/routeTypes';
import DeviceInfo from 'react-native-device-info';

interface CreatedObj {
    tag: string | undefined;
    sectionId: string | undefined;
    time: Date;
    location: Location[];
}

export const useGeoFencing = (navigation: NavProp) => {
    // GLOBAL STATES --------------------------->
    const { baseURL, userData } = useAppSelector(state => state.auth);

    // STATES ----------------------------------------------------------------------------------------
    const [fencingMode, setFencingMode] = useState<{ _id: number; value: string }>();
    const [pos, setPos] = useState<{ latitude: number; longitude: number } | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startButtonLoading, setStartButtonLoading] = useState(false);
    const [fileName, setFileName] = useState<{ value: string; _id: string } | null>(null);
    const [stopPressed, setStopPressed] = useState(false);
    const [isConnected, setIsConnected] = useState(true); // State to track internet connectivity
    const [showGeoDropDown, setShowGeoDropDown] = useState(true);

    // REFS ------------------------>
    const watchIdRef = useRef<number | null>(null);

    // SERVICES --------------------------------------------------->
    const { saveToOfflineStorage, offlineStorageToUpload } = storageServices;

    // FUNCTIONS ------------------------------------------------------------------------------------

    // handle the internet state changes
    const handleNetInfoChange = debounce(state => {
        console.log('NetInfo event triggered'); // Debugging

        if (!state.isConnected) {
            setIsConnected(false);
            console.log('net nei');
        } else {
            setIsConnected(true);
            console.log('net ache');
            offlineStorageToUpload(baseURL, userData.token);
        }
    }, 1000); // Adjust debounce delay as needed

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(handleNetInfoChange);
        return () => {
            console.log('Unsubscribing from NetInfo');
            unsubscribe();
        };
    }, [handleNetInfoChange]);

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    // CANCEL BUTTON--------------------------------------------------------------------------------------
    const restartProcess = useCallback(() => {
        if (watchId) {
            Geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setStartButtonLoading(false);
        setShowGeoDropDown(true);
        setPos(null);
        setLocations([]);
        setStopPressed(false);
        setFileName(null);
        setRecording(false);
        mmkv.delete('backgroundLocations');
    }, [watchId]);

    // START--------------------------------------------------------------------------------------
    const startRecording = useCallback(async () => {
        if (!fencingMode) {
            ToastAndroid.show('Please select a mode for GeoFencing', ToastAndroid.LONG);
            return;
        }

        setShowGeoDropDown(false);
        setStartButtonLoading(true);

        /* clear any leaked watch */
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        try {
            /* ---------- 1.  runtime permission ---------- */
            const hasPermission = await getLocationPermission();
            if (!hasPermission) {
                ToastAndroid.show('Location Permission not granted', ToastAndroid.LONG);
                setStartButtonLoading(false);
                return;
            }

            /* ---------- 2.  is GPS already on? ---------- */
            let providers = await DeviceInfo.getAvailableLocationProviders();
            const gpsAlreadyOn = providers.gps || providers.fused;

            if (!gpsAlreadyOn) {
                /* open the location settings */
                Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
                /* we will continue in app-state listener … */
            } else {
                /* GPS is already on – start watching immediately */
                startWatch();
            }
        } catch (e) {
            console.error(e);
            setStartButtonLoading(false);
        }

        /* ---------- 3.  wait for user to come back ---------- */
        const subscription = AppState.addEventListener('change', async nextState => {
            if (nextState !== 'active') return;

            /* user is back – check again */
            const providers = await DeviceInfo.getAvailableLocationProviders();
            const nowOn = providers.gps || providers.fused;

            if (!nowOn) {
                ToastAndroid.show('GPS is still turned off', ToastAndroid.LONG);
                setStartButtonLoading(false);
            } else {
                startWatch(); // GPS is on – start watching
            }
            subscription.remove(); // clean up
        });

        /* ---------- helper ---------- */
        function startWatch() {
            // if (watchId !== null) Geolocation.clearWatch(watchId);

            let first = true;
            const id = Geolocation.watchPosition(
                pos => {
                    if (first) {
                        first = false;
                        setStartButtonLoading(false);
                    }
                    const { latitude, longitude } = pos.coords;
                    setPos({ latitude, longitude });
                    setLocations(prev => [...prev, { latitude, longitude }]);
                },
                err => {
                    console.error(err);
                    ToastAndroid.show(err.message || 'Location error', ToastAndroid.LONG);
                    restartProcess();
                },
                {
                    enableHighAccuracy: true,
                    fastestInterval: 2000,
                    distanceFilter: 0,
                    interval: fencingMode?._id! * 1000,
                },
            );

            watchIdRef.current = id;
            // setWatchId(id);
            setRecording(true);
        }
    }, [fencingMode, restartProcess]);

    // STOP-----------------------------------------------------------------------------------
    const stopRecording = () => {
        // if (watchId !== null) {
        //     Geolocation.clearWatch(watchId);
        //     setWatchId(null);
        // }
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setRecording(false);
    };

    // NAME SET FUNCTION USING TEXTINPUT ------------------------------------------------------------------------------
    const handleNameChange = (value: { value: string; _id: string } | null) => {
        let newName = value;
        setFileName(newName);
    };

    //UPLOAD TO DATABASE -----------------------------------------------------------------------------
    async function handleUpload() {
        if (!fileName) {
            ToastAndroid.show('Please select a section', ToastAndroid.SHORT);
            return;
        }

        const newObj2: CreatedObj = {
            tag: fileName?.value,
            sectionId: fileName?._id,
            time: new Date(),
            location: locations,
        };
        console.log('newObj2', newObj2);

        if (!isConnected) {
            //WHEN OFFLINE ---------------------------------------------------
            saveToOfflineStorage(newObj2);
            mmkv.delete('backgroundLocations');
            restartProcess();
        } else {
            //WHEN ONLINE ---------------------------------------------------
            handleApiPost(newObj2);
        }
    }

    // API POST when internet is available -------------------------------------------------------
    async function handleApiPost(newObj2: CreatedObj) {
        setLoading(true);
        try {
            const url = `${baseURL}/log-geofencing.json`;
            const response = await postData(url, { token: userData?.token, ...newObj2 });
            if (!response.status) {
                console.error(response);
                throw new Error('Network response was not ok');
            }

            console.log('res', response);
            trigger('impactLight');
            mmkv.delete('backgroundLocations');
            ToastAndroid.show('Data uploaded successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error(error);

            // Handle offline data save
            saveToOfflineStorage(newObj2);
            ToastAndroid.show('Please check your internet connection', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
            restartProcess();
        }
    }

    // ANIMATIONS --------------------------------------------------------------------------------------
    const height = useSharedValue(0); // 0 = hidden, 1 = visible
    const translateY = useSharedValue(0); // for slide

    useEffect(() => {
        height.value = showGeoDropDown ? 1 : 0;
        translateY.value = showGeoDropDown ? 0 : -60; // slide distance
    }, [showGeoDropDown, height, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withSpring(height.value * 60), // 120 = collapsed height of dropdown
        transform: [{ translateY: withSpring(translateY.value) }],
        opacity: withTiming(showGeoDropDown ? 1 : 0, { duration: 200 }),
    }));

    // HANDLE IF BACKGROUND DATA EXISTS ------------------------->
    useEffect(() => {
        const existingData = mmkv.getString('backgroundLocations');
        console.log('existingData', existingData);

        if (existingData) {
            const existing = JSON.parse(existingData);
            setFencingMode(existing.fencingMode);

            // SET THE LOCATION STATES
            const locations = existing.locations;
            const length = locations.length;

            setLocations(locations);
            setPos({ latitude: existing.locations[length - 1].latitude, longitude: existing.locations[length - 1].longitude });
            setShowGeoDropDown(false);
        }
    }, []);

    // HANDLE BACKGROUND AND FOREGROUND ------------------------->
    const keyOf = (l: Location) => `${l.latitude},${l.longitude}`;

    useAppForeground(isForeground => {
        if (isForeground) return;

        stopRecording();
        if (!locations.length) return;

        const raw = mmkv.getString('backgroundLocations');
        const existing: Location[] = raw ? JSON.parse(raw).locations : [];

        const existingKeys = new Set(existing.map(keyOf));

        /* keep only points we have NOT seen before */
        const newPoints = locations.filter(l => !existingKeys.has(keyOf(l)));

        if (newPoints.length) {
            mmkv.set('backgroundLocations', JSON.stringify({ fencingMode, locations: [...existing, ...newPoints] }));
        }
    });

    // BACKHANDLER ------------------------------------>
    const onBackPress = useCallback(() => {
        const hasData = locations.length > 0;
        if (!hasData) return false; // let the back action happen

        Alert.alert(
            'Discard session?',
            'All location data will be lost.',
            [
                { text: 'NO', style: 'cancel' },
                {
                    text: 'YES',
                    style: 'destructive',
                    onPress: () => {
                        mmkv.delete('backgroundLocations'); // wipe
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: true },
        );
        return true; // prevent default back action
    }, [locations, navigation]);

    useFocusEffect(
        useCallback(() => {
            const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => sub.remove(); // ✅ modern clean-up
        }, [onBackPress]),
    );

    return {
        pos,
        locations,
        recording,
        loading,
        startButtonLoading,
        fileName,
        stopPressed,
        startRecording,
        stopRecording,
        handleUpload,
        restartProcess,
        fencingMode,
        setFencingMode,
        setLocations,
        setRecording,
        setStopPressed,
        handleNameChange,

        // Animatated props
        animatedStyle,
        showGeoDropDown,

        // BackbuttonHandling
        onBackPress,
    };
};
