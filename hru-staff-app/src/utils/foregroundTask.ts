import Geolocation from 'react-native-geolocation-service';
import notifee, {AndroidImportance} from '@notifee/react-native';
import Toast from 'react-native-simple-toast';
import {Platform} from 'react-native';
import {
    openSettings,
    PERMISSIONS,
    request,
    requestNotifications,
} from 'react-native-permissions';
import {postData} from '../api';
import {useAuthStore} from '../store/authStore';
import NetInfo from '@react-native-community/netinfo';
import {useLocationStore} from '../store/locationStore';
import BASE_URL from '../config';

type bestLocationType = {
    location: {latitude: number; longitude: number; accuracy: number};
} | null;

const url = `${BASE_URL}/hru/staffApp/post-locations.json`;

// Request location and notification permissions
async function requestLocationAndNotificatoinPermission() {
    let locationGranted = false,
        backgroundLocation = false,
        notificationGranted = false;

    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(status => {
        if (status === 'granted') {
            locationGranted = true;
        }
    });

    await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
        status => {
            if (status === 'granted') {
                backgroundLocation = true;
            }
        },
    );

    await requestNotifications(['alert', 'sound']).then(
        ({status, settings}) => {
            if (status === 'granted') {
                notificationGranted = true;
            }
        },
    );

    return {locationGranted, backgroundLocation, notificationGranted};
}

// Check if location services (GPS) are enabled
async function isLocationEnabled(): Promise<boolean> {
    if (Platform.OS === 'android') {
        try {
            // This is a workaround; react-native-geolocation-service doesn't directly expose this,
            // but we can attempt a single position request to infer GPS status
            return new Promise(resolve => {
                Geolocation.getCurrentPosition(
                    () => resolve(true), // GPS is enabled if we get a position
                    error => {
                        if (error.code === 2) {
                            // Position unavailable (GPS off)
                            resolve(false);
                        } else {
                            resolve(true); // Assume enabled unless explicitly unavailable
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 10000,
                    },
                );
            });
        } catch (err) {
            console.error('Error checking location services:', err);
            return false;
        }
    }
    return true; // iOS typically prompts for GPS enabling; assume true for simplicity
}

/**
 * This function capture a currentlocation with best accuracy
 * It takes min 2 location updates and then take the best one
 * You can change the min locaiton updates by changing the locationUpdates variable
 */
async function captureLocation(): Promise<bestLocationType> {
    return new Promise((resolve, reject) => {
        let watchId: any;
        let timeoutId: any;
        let bestLocation: any = null;
        let locationUpdates = 0;

        // Start a timeout to stop tracking after 30 seconds
        timeoutId = setTimeout(() => {
            // console.log('Timeout reached, stopping location updates.');
            Geolocation.clearWatch(watchId);

            if (bestLocation) {
                console.log('Returning best available location:', bestLocation);
                // setLocationArray(prev => [...prev, bestLocation.location]); // ✅ Ensure state is updated
                resolve(bestLocation);
            } else {
                // Toast.show(
                //     'Could not get an accurate location, try again',
                //     Toast.LONG,
                // );
                resolve(null); // Resolve with null instead of rejecting
            }
        }, 10000); // Timeout after 10 seconds

        // Start watching for location updates
        watchId = Geolocation.watchPosition(
            async position => {
                const {latitude, longitude, accuracy} = position.coords;
                locationUpdates++;

                console.log(
                    `Update ${locationUpdates}: Lat ${latitude}, Lng ${longitude}, Accuracy ${accuracy}m`,
                );

                // Store the best available location
                if (
                    !bestLocation ||
                    accuracy < bestLocation?.location?.accuracy
                ) {
                    bestLocation = {
                        location: {latitude, longitude, accuracy},
                    };
                }

                // If accuracy is within 5m or received 2 updates, resolve immediately
                if (accuracy <= 5 || locationUpdates >= 1) {
                    console.log(
                        'Good accuracy or sufficient updates received, stopping location updates.',
                    );

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
                // resolve(false);
            },
            {
                enableHighAccuracy: true,
                fastestInterval: 2000, //in ms
                distanceFilter: 0, //in meter
                interval: 2000,
            },
        );
    });
}

// This is the task function that will be executed in the background
// const captureLocationTask = async (
//     taskDataArguments:
//         | {
//               delay: number;
//               token: string | null;
//               locations: any;
//               setLocations: any;
//               clearLocations: any;
//           }
//         | undefined,
// ) => {
//     try {
//         const delay = taskDataArguments?.delay || 20000;
//         const token = taskDataArguments?.token || null;
//         const locations = taskDataArguments?.locations || [];
//         const setLocations = taskDataArguments?.setLocations || null;
//         const clearLocations = taskDataArguments?.clearLocations || null;
//         // const token = useAuthStore.getState().token;

//         while (BackgroundService.isRunning()) {
//             console.log('Background Service is running');

//             const gpsEnabled = await isLocationEnabled();
//             if (!gpsEnabled) {
//                 console.log('GPS is disabled, pausing location tracking...');

//                 // Wait for GPS to be re-enabled
//                 while (
//                     !(await isLocationEnabled()) &&
//                     BackgroundService.isRunning()
//                 ) {
//                     console.log('Waiting for GPS to be enabled...');
//                     await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
//                 }
//                 console.log('GPS is back on, resuming tracking...');
//                 // Toast.show('GPS is on, tracking resumed.', Toast.LONG);
//             }

//             const bestLocation: bestLocationType = await captureLocation();
//             if (bestLocation) {
//                 // const {locations, setLocations, clearLocations} =
//                 //     useLocationStore.getState();

//                 const state = await NetInfo.fetch();
//                 if (state.isConnected) {
//                     const payload = {
//                         locations: [
//                             ...locations,
//                             {
//                                 latitude: bestLocation.location.latitude,
//                                 longitude: bestLocation.location.longitude,
//                                 timestamp: new Date().getTime(),
//                             },
//                         ],
//                         token: token,
//                     };
//                     const res = await postData(url, payload);
//                     console.log(res);
//                     clearLocations(); // Clear the locations array
//                 } else {
//                     console.log('No internet connection');
//                     setLocations({
//                         latitude: bestLocation.location.latitude,
//                         longitude: bestLocation.location.longitude,
//                         timestamp: new Date().getTime(),
//                     });
//                 }
//             } else {
//                 console.log('No location captured, continuing...');
//             }
//             await new Promise(resolve => setTimeout(resolve, delay));
//         }
//     } catch (error) {
//         console.error('Error capturing location:', error);
//     }
// };

// // Starts the background task with a notification
// const startCaptureLocationTask = async () => {
//     try {
//         const token = useAuthStore.getState().token;
//         const {locations, setLocations, clearLocations} =
//             useLocationStore.getState();

//         const {locationGranted, backgroundLocation} =
//             await requestLocationAndNotificatoinPermission();

//         if (!locationGranted) {
//             Toast.show(
//                 'Location permission not granted, please enable location',
//                 Toast.LONG,
//             );
//             openSettings('application').catch(() =>
//                 console.warn('Cannot open app settings'),
//             );
//             return;
//         }

//         if (!backgroundLocation) {
//             Toast.show(
//                 'Background location permission not granted, please allow location all the time',
//                 Toast.LONG,
//             );
//             openSettings('application').catch(() =>
//                 console.warn('Cannot open app settings'),
//             );
//         }

//         await BackgroundService.start(captureLocationTask, {
//             taskName: 'Location Tracking',
//             taskTitle: 'Location Tracking',
//             taskDesc:
//                 'Capturing your Location, this tracking will stop after you logout ...',
//             taskIcon: {
//                 name: 'logo',
//                 type: 'mipmap',
//             },
//             linkingURI: 'HRU Staff app://open/Order Details',
//             parameters: {
//                 delay: 3 * 60 * 1000,
//                 token: token,
//                 locations: locations,
//                 setLocations: setLocations,
//                 clearLocations: clearLocations,
//             },
//         });
//     } catch (error) {
//         console.error('Error starting background service:', error);
//     }
// };

// // Stops the background task
// const stopCaptureLocationTask = async () => {
//     await BackgroundService.stop();
//     console.log('Background Service stopped');
// };

const captureLocationTask = async (
    taskDataArguments:
        | {
              delay: number;
              token: string | null;
              locations: any;
              setLocations: any;
              clearLocations: any;
          }
        | undefined,
) => {
    try {
        const delay = taskDataArguments?.delay || 20000;
        const token = taskDataArguments?.token || null;
        const locations = taskDataArguments?.locations || [];
        const setLocations = taskDataArguments?.setLocations || null;
        const clearLocations = taskDataArguments?.clearLocations || null;

        // Function to check if foreground service is still running
        const isForegroundServiceRunning = async () => {
            // Notifee doesn't provide a direct way to check if the foreground service is running,
            // so we rely on the app's logic to manage the service lifecycle
            return true; // Assume running unless stopped explicitly
        };

        while (await isForegroundServiceRunning()) {
            console.log('Foreground Service is running');

            const gpsEnabled = await isLocationEnabled();
            if (!gpsEnabled) {
                console.log('GPS is disabled, pausing location tracking...');

                // Wait for GPS to be re-enabled
                while (
                    !(await isLocationEnabled()) &&
                    (await isForegroundServiceRunning())
                ) {
                    console.log('Waiting for GPS to be enabled...');
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
                }
                console.log('GPS is back on, resuming tracking...');
                // Toast.show('GPS is on, tracking resumed.', Toast.LONG);
            }

            const bestLocation = await captureLocation();
            if (bestLocation) {
                const state = await NetInfo.fetch();
                if (state.isConnected) {
                    const payload = {
                        locations: [
                            ...locations,
                            {
                                latitude: bestLocation.location.latitude,
                                longitude: bestLocation.location.longitude,
                                timestamp: new Date().getTime(),
                            },
                        ],
                        token: token,
                    };
                    const res = await postData(url, payload);
                    console.log(res);
                    clearLocations(); // Clear the locations array
                } else {
                    console.log('No internet connection');
                    setLocations({
                        latitude: bestLocation.location.latitude,
                        longitude: bestLocation.location.longitude,
                        timestamp: new Date().getTime(),
                    });
                }
            } else {
                console.log('No location captured, continuing...');
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    } catch (error) {
        console.error('Error capturing location:', error);
    }
};

// Starts the foreground service with a notification
const startCaptureLocationTask = async () => {
    try {
        const token = useAuthStore.getState().token;
        const {locations, setLocations, clearLocations} =
            useLocationStore.getState();

        const {locationGranted, backgroundLocation} =
            await requestLocationAndNotificatoinPermission();

        if (!locationGranted) {
            Toast.show(
                'Location permission not granted, please enable location',
                Toast.LONG,
            );
            openSettings('application').catch(() =>
                console.warn('Cannot open app settings'),
            );
            return;
        }

        if (!backgroundLocation) {
            Toast.show(
                'Background location permission not granted, please allow location all the time',
                Toast.LONG,
            );
            openSettings('application').catch(() =>
                console.warn('Cannot open app settings'),
            );
            return;
        }

        // Create a notification channel for Android
        const channelId = await notifee.createChannel({
            id: 'location-tracking',
            name: 'Location Tracking',
            importance: AndroidImportance.HIGH,
        });

        // Display the foreground service notification
        await notifee.displayNotification({
            id: 'location-tracking-service',
            title: 'Location Tracking',
            body: 'Capturing your Location, this tracking will stop after you logout ...',
            android: {
                channelId,
                asForegroundService: true,
                smallIcon: 'logo', // Reference to mipmap/logo
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                    launchActivity: 'default',
                    // Linking URI can be handled via deep linking in React Native
                    // Ensure deep linking is configured for 'HRU Staff app://open/Order Details'
                },
            },
        });

        // Start the foreground service task
        notifee.registerForegroundService(() => {
            return new Promise(async () => {
                await captureLocationTask({
                    delay: 3 * 60 * 1000, // 3 minutes
                    token,
                    locations,
                    setLocations,
                    clearLocations,
                });
            });
        });

        console.log('Foreground Service started');
    } catch (error) {
        console.error('Error starting foreground service:', error);
    }
};

// Stops the foreground service
const stopCaptureLocationTask = async () => {
    try {
        await notifee.stopForegroundService();
        await notifee.cancelNotification('location-tracking-service');
        console.log('Foreground Service stopped');
    } catch (error) {
        console.error('Error stopping foreground service:', error);
    }
};

export {captureLocation, startCaptureLocationTask, stopCaptureLocationTask};
