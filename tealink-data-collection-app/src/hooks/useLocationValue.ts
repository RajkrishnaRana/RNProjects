import { useState } from 'react';
import { locationServices } from '../services/locationServices';
import { Linking, ToastAndroid } from 'react-native';

export const useLocationValue = () => {
    const [loading, setLoading] = useState(false);

    const { captureLocation } = locationServices;

    const handleLocationPress = async (setValue: (value: string) => void) => {
        setLoading(true);
        const { location } = await captureLocation();
        ToastAndroid.show('Location captured', ToastAndroid.SHORT);
        setValue(location);
        setLoading(false);
    };

    const handleViewMap = (value: Location) => {
        const latitude = value.latitude,
            longitude = value.longitude;

        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return { loading, handleLocationPress, handleViewMap };
};
