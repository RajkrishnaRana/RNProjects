import {Alert, Button, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTabHeader from '../components/CustomTabHeader';
import Geolocation from 'react-native-geolocation-service';
import {storage, useAuthStore} from '../store/authStore';
import Toast from 'react-native-toast-message';

type props = {
    latitude: number;
    longitude: number;
};

export default function TestingScreen() {
    const token = useAuthStore(s => s.token);
    const {deviceId} = useAuthStore();

    const [locationArray, setLocationArray] = useState<props[]>([]);

    async function requestLocationPermission() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Location Permission',
                message: 'This app requires access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    }

    async function captureLocation() {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Toast.show({
                type: 'error',
                text1: 'Location permission denied',
                visibilityTime: 4000,
            });
            return;
        }

        return new Promise((resolve, reject) => {
            let watchId: any;
            let timeoutId: any;
            let bestLocation: any = null;
            let locationUpdates = 0;

            // Start a timeout to stop tracking after 30 seconds
            timeoutId = setTimeout(() => {
                console.log('Timeout reached, stopping location updates.');
                Geolocation.clearWatch(watchId);

                if (bestLocation) {
                    console.log('Returning best available location:', bestLocation);
                    setLocationArray(prev => [...prev, bestLocation.location]); // ✅ Ensure state is updated
                    resolve(bestLocation);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Could not get an accurate location',
                        visibilityTime: 4000,
                    });
                    reject(new Error('Timeout: No location received'));
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
                            env: 'Development',
                            deviceId: deviceId,
                            // deviceId: 'f4f81fbde6fd0559',
                            location: {latitude, longitude, accuracy},
                        };
                    }

                    // If accuracy is within 5m or received 3 updates, resolve immediately
                    if (accuracy <= 5 || locationUpdates >= 1) {
                        console.log('Good accuracy or sufficient updates received, stopping location updates.');
                        clearTimeout(timeoutId);
                        Geolocation.clearWatch(watchId);
                        setLocationArray(prev => [...prev, bestLocation.location]);
                        resolve(bestLocation);
                    }
                },
                error => {
                    console.error('Location error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Error getting location',
                        visibilityTime: 4000,
                    });
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
        });
    }

    const openGoogleMaps = (latitude: number | undefined, longitude: number | undefined) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    const saveData = () => {
        storage.set('attendance', JSON.stringify(locationArray));
        Toast.show({
            type: 'success',
            text1: 'Data saved successfully',
            visibilityTime: 4000,
        });
    };

    useEffect(() => {
        const storedData = storage.getString('attendance');
        if (storedData) {
            setLocationArray(JSON.parse(storedData));
            console.log(JSON.parse(storedData));
            Toast.show({
                type: 'success',
                text1: 'Data loaded successfully',
                visibilityTime: 4000,
            });
        }
    }, []);

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <CustomTabHeader title="Testing Screen" />

            <Button title="Captured Location" onPress={captureLocation} />
            <ScrollView style={{flexGrow: 1}}>
                {locationArray.map((item, index) => (
                    <View style={{flexDirection: 'row'}} key={index}>
                        <Text>
                            {item.latitude} & {item.longitude}
                        </Text>
                        <Button title="Open Map" onPress={() => openGoogleMaps(Number(item.latitude), Number(item.longitude))} />
                    </View>
                ))}
                <Button title="Clear" onPress={() => setLocationArray([])} />
                <Button title="Save" onPress={saveData} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({});
