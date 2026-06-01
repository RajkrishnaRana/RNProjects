import { Alert, Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const getLocationPermission = async () => {
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE // Use LOCATION_ALWAYS for always-on access
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    let status = await check(permission);
    if (status !== RESULTS.GRANTED) {
        status = await request(permission);
    }

    if (status === RESULTS.GRANTED) {
        return true;
    }

    return new Promise(resolve => {
        Alert.alert(
            'Location required',
            'Please enable location permission in Settings to punch in/out.',
            [
                { text: 'Cancel', onPress: () => resolve(false) },
                { text: 'Open Settings', onPress: () => (openSettings(), resolve(false)) }, // we’ll re-check below
            ],
            { cancelable: false },
        );
    });
};
