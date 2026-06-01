import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import { getLocationPermission } from './permissionServices';
import { ToastAndroid } from 'react-native';

export const locationServices = {
    captureLocation: async (): Promise<any> => {
        const hasLocationPermission = await getLocationPermission();
        if (!hasLocationPermission) {
            Toast.show('Location permission not granted', Toast.LONG);
            return Promise.reject(new Error('Location Permission denied'));
        }

        /* ---- user tapped “Open Settings” ---- */
        let recheck = await getLocationPermission(); // after they come back
        if (!recheck) {
            Toast.show('Permission still denied', Toast.LONG);
            return Promise.reject(new Error('Permission denied'));
        }

        return new Promise((resolve, reject) => {
            let watchId: any;
            let timeoutId: any;
            let bestLocation: any = null;
            let locationUpdates = 0;

            // Start a timeout to stop tracking after 10 seconds
            timeoutId = setTimeout(() => {
                // console.log('Timeout reached, stopping location updates.');
                Geolocation.clearWatch(watchId);

                if (bestLocation) {
                    // console.log(
                    //     'Returning best available location:',
                    //     bestLocation,
                    // );
                    resolve(bestLocation);
                } else {
                    Toast.show('Could not get an accurate location, try again', Toast.LONG);
                    resolve(new Error('Timeout: No location received'));
                }
            }, 10000); // Timeout after 10 seconds

            // Start watching for location updates
            watchId = Geolocation.watchPosition(
                position => {
                    const { latitude, longitude, accuracy } = position.coords;
                    locationUpdates++;

                    console.log(`Update ${locationUpdates}: Lat ${latitude}, Lng ${longitude}, Accuracy ${accuracy}m`);

                    // Store the best available location
                    if (!bestLocation || accuracy < bestLocation.location.accuracy) {
                        bestLocation = {
                            location: { latitude, longitude, accuracy },
                        };
                    }

                    // If accuracy is within 5m or received 3 updates, resolve immediately
                    if (accuracy <= 5 || locationUpdates >= 1) {
                        // console.log(
                        //     'Good accuracy or sufficient updates received, stopping location updates.',
                        // );
                        clearTimeout(timeoutId);
                        Geolocation.clearWatch(watchId);
                        resolve(bestLocation);
                    }
                },
                error => {
                    console.error('Location error:', error);
                    Toast.show('Error getting location', Toast.LONG);
                    Geolocation.clearWatch(watchId);
                    clearTimeout(timeoutId);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    fastestInterval: 2000, //in ms
                    distanceFilter: 0, //in meter
                    interval: 2000,
                },
            );
        }).then(location => {
            return location;
        });
    },

    measureDistance: (target: { latitude: number; longitude: number }, user: { latitude: number; longitude: number }) => {
        const R = 6371; // Earth radius in km
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const dLat = toRad(user.latitude - target.latitude);
        const dLng = toRad(user.longitude - target.longitude);

        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(target.latitude)) * Math.cos(toRad(user.latitude)) * Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance.toFixed(3);
    },

    watchLocation: async (
        isWatching: boolean,
        watchIdRef: React.RefObject<number | null>,
        setIsWatching: React.Dispatch<React.SetStateAction<boolean>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setStart: React.Dispatch<React.SetStateAction<Location | undefined>>,
        setEnd: React.Dispatch<React.SetStateAction<Location | undefined>>,
        setFinalEnd: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (isWatching) {
            // Stop watching
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            setIsWatching(false);
            setFinalEnd(true);
            ToastAndroid.show('Location tracking stopped', ToastAndroid.SHORT);
            return;
        }

        // Start watching
        setLoading(true);
        setIsWatching(true);
        let isFirstLocation = true;

        watchIdRef.current = Geolocation.watchPosition(
            position => {
                const location: Location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                if (isFirstLocation) {
                    setStart(location);
                    setEnd(undefined);
                    ToastAndroid.show('Start location captured', ToastAndroid.SHORT);
                    setLoading(false);
                    isFirstLocation = false;
                } else {
                    setEnd(location);
                }
            },
            error => {
                console.error('Watch location error:', error);
                ToastAndroid.show('Location error: ' + error.message, ToastAndroid.SHORT);
                setLoading(false);
                setIsWatching(false);
                if (watchIdRef.current !== null) {
                    Geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                }
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0,
                interval: 5000, // Update every 5 seconds
                fastestInterval: 5000,
                showLocationDialog: true,
                forceRequestLocation: true,
            },
        );
    },

    clearLocation: (watchIdRef: React.RefObject<number | null>) => {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    },
};
