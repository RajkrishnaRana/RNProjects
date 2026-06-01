import { useEffect, useRef, useState } from 'react';
import Geolocation, {
    GeolocationOptions, // <- new
    GeolocationError, // <- new          // <- new  (community package exports it)
} from '@react-native-community/geolocation';
import NetInfo, { configure } from '@react-native-community/netinfo';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { postData } from '../services/apiServices';
import { useAppSelector } from './typedReduxHooks';
import { storageServices } from '../services/storageServices';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { trigger } from 'react-native-haptic-feedback';
import { GeoPosition } from 'react-native-geolocation-service';

interface CreatedObj {
    tag: string | undefined;
    sectionId: string | undefined;
    time: Date;
    location: Location[];
}

export const useGeoFencing = () => {
    // GLOBAL STATES --------------------------->
    const { baseURL, userData } = useAppSelector(state => state.auth);

    /* ---------------  state / selectors  --------------------------- */
    const [fencingMode, setFencingMode] = useState<{ _id: number; value: string }>();
    const [pos, setPos] = useState<GeoPosition | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startButtonLoading, setStartButtonLoading] = useState(false);
    const [fileName, setFileName] = useState<{ value: string; _id: string } | null>(null);
    const [isConnected, setIsConnected] = useState(true);
    const [showGeoDropDown, setShowGeoDropDown] = useState(true);

    /* ---------------  refs  ---------------------------------------- */
    const watchIdRef = useRef<number | null>(null); // <- keep id in ref
    const gpsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // SERVICES --------------------------------------------------->
    const { saveToOfflineStorage, offlineStorageToUpload } = storageServices;

    // FUNCTIONS ------------------------------------------------------------------------------------
    /* ---------------  internet listener  --------------------------- */
    useEffect(() => {
        const unsub = NetInfo.addEventListener(
            debounce(s => {
                setIsConnected(!!s.isConnected);
                if (s.isConnected) offlineStorageToUpload(baseURL, userData.token);
            }, 1000),
        );
        return () => unsub();
    }, [baseURL, userData.token]);

    /* ---------------  cleanup on unmount  -------------------------- */
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, []);

    /* ---------------  start / stop  -------------------------------- */
    const startRecording = async () => {
        if (!fencingMode) {
            ToastAndroid.show('Please select a mode for GeoFencing', ToastAndroid.LONG);
            return;
        }
        setStartButtonLoading(true);

        try {
            const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            let status = await check(permission);
            if (status !== RESULTS.GRANTED) status = await request(permission);
            if (status !== RESULTS.GRANTED) {
                setStartButtonLoading(false);
                /* …your permission alert / toast… */
                ToastAndroid.show('Location permission not granted', ToastAndroid.LONG);
                return;
            }

            /* GPS timeout – if we do not get a fix within 15 s we give up */
            gpsTimeoutRef.current = setTimeout(() => {
                if (watchIdRef.current !== null) {
                    Geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                }
                setRecording(false);
                setStartButtonLoading(false);
                ToastAndroid.show('GPS initialization timed out', ToastAndroid.LONG);
            }, 15_000);

            /* options that work with the community package */
            const options: GeolocationOptions = {
                enableHighAccuracy: true,
                timeout: 20_000,
                maximumAge: 2_000,
                distanceFilter: 0,
                interval: fencingMode._id * 1000,
                fastestInterval: 2_000,
            };

            const id = Geolocation.watchPosition(
                (position: GeoPosition) => {
                    /* first fix – cancel timeout & update UI */
                    if (gpsTimeoutRef.current) {
                        clearTimeout(gpsTimeoutRef.current);
                        gpsTimeoutRef.current = null;
                    }
                    if (!recording) {
                        setStartButtonLoading(false);
                        setRecording(true);
                        setShowGeoDropDown(false);
                        ToastAndroid.show('Location tracking started', ToastAndroid.SHORT);
                    }

                    setPos(position);
                    setLocations(prev => [...prev, { latitude: position.coords.latitude, longitude: position.coords.longitude }]);
                },
                (error: GeolocationError) => {
                    if (gpsTimeoutRef.current) {
                        clearTimeout(gpsTimeoutRef.current);
                        gpsTimeoutRef.current = null;
                    }
                    setRecording(false);
                    setStartButtonLoading(false);
                    /* …your error toasts… */
                    ToastAndroid.show(error.message, ToastAndroid.LONG);
                },
                options,
            );

            watchIdRef.current = id;
        } catch (e) {
            console.error(e);
            setRecording(false);
            setStartButtonLoading(false);
            ToastAndroid.show('Failed to start recording', ToastAndroid.LONG);
        }
    };

    const stopRecording = () => {
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

    // CANCEL BUTTON--------------------------------------------------------------------------------------
    const restartProcess = () => {
        stopRecording();
        setShowGeoDropDown(true);
        setPos(null);
        setLocations([]);
        setFileName(null);
    };

    // ANIMATIONS --------------------------------------------------------------------------------------
    const height = useSharedValue(0); // 0 = hidden, 1 = visible
    const translateY = useSharedValue(0); // for slide

    useEffect(() => {
        height.value = showGeoDropDown ? 1 : 0;
        translateY.value = showGeoDropDown ? 0 : -60; // slide distance
    }, [showGeoDropDown]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withSpring(height.value * 60), // 120 = collapsed height of dropdown
        transform: [{ translateY: withSpring(translateY.value) }],
        opacity: withTiming(showGeoDropDown ? 1 : 0, { duration: 200 }),
    }));

    return {
        pos,
        locations,
        recording,
        loading,
        startButtonLoading,
        fileName,
        startRecording,
        stopRecording,
        handleUpload,
        restartProcess,
        fencingMode,
        setFencingMode,
        setLocations,
        setRecording,
        handleNameChange,

        // Animatated props
        animatedStyle,
        showGeoDropDown,
    };
};
