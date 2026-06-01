import { Image, StyleSheet } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import { BASE_URL } from '../config';
import { postData } from '../api';
import Toast from 'react-native-simple-toast';

export default function SplashScreen2({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) {
    const { setNearestLocation, setLocationList } = useCurrentLocationStore();

    useEffect(() => {
        const getLocationList = async () => {
            try {
                const url = `${BASE_URL}/hru/Patientappapi/locationList`;

                const res = await postData(url, {});
                console.log('getLocationList', res);

                if (res.status === false) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                setLocationList(res?.docs);

                const findJaipurLocation = res?.docs?.find((i: any) => i.city === 'Jaipur');
                console.log({ findJaipurLocation });
                setNearestLocation(findJaipurLocation || res?.docs[0]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getLocationList();
    }, [setLoading, setLocationList, setNearestLocation]);

    const selectSplashImage = () => {
        return require('../assets/splashscreens/12-inch_tablet/splash.png');
    };

    return (
        <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
            <Image source={selectSplashImage()} style={styles.img} resizeMode="cover" />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    img: {
        height: '100%',
        width: '100%',
    },
});
