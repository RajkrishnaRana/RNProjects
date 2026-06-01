import {check, openSettings, PERMISSIONS, request, requestNotifications, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';
import Toast from 'react-native-simple-toast';

// Request location and notification permissions
async function requestLocationAndNotificationPermission() {
    let locationGranted = false,
        notificationGranted = false;

    try {
        console.warn('Permission request start------');

        const locationStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (locationStatus === 'granted') {
            locationGranted = true;
        }

        console.warn('Permission request notification start------');

        // const {status: notificationStatus} = await requestNotifications([
        //     'alert',
        //     'sound',
        // ]);
        // if (notificationStatus === 'granted') {
        //     notificationGranted = true;
        // }

        console.warn('Permission request end------');
    } catch (error) {
        console.error('Permission request error:', error);
    }

    return {locationGranted, notificationGranted};
}

async function captureLocation(): Promise<any> {
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE // Use LOCATION_ALWAYS for always-on access
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const status = await check(permission);
    console.warn('capture location start------');

    if (status !== RESULTS.GRANTED) {
        await request(permission);
        // Toast.show('Location permission denied', Toast.SHORT);
        // openSettings('application');
        // return;
    }

    console.warn('-----------------------------------------------');
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
                const {latitude, longitude, accuracy} = position.coords;
                locationUpdates++;

                console.log(`Update ${locationUpdates}: Lat ${latitude}, Lng ${longitude}, Accuracy ${accuracy}m`);

                // Store the best available location
                if (!bestLocation || accuracy < bestLocation.location.accuracy) {
                    bestLocation = {
                        location: {latitude, longitude, accuracy},
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
            }
        );
    }).then(location => {
        return location;
    });
}

export {captureLocation, requestLocationAndNotificationPermission};
