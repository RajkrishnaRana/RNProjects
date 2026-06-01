import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {captureLocation} from '../utils/fetchCurrentLocation';
import {useCurrentLocationStore} from '../store/currentLocationStore';
import {postData} from '../api';
import {BASE_URL} from '../config';
import Toast from 'react-native-simple-toast';
import BackgroundGradient from '../components/BackgroundGradient';

interface Props {
    setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function GetLocationScreen({setLoading}: Props) {
    const {setCurrentLocation, setNearestLocation, setLocationList} = useCurrentLocationStore();

    const [isNearestLocAvailable, setIsNearestLocAvailable] = useState(false);

    useEffect(() => {
        const getLocation = async () => {
            try {
                setLoading(true);
                const {location} = await captureLocation();
                setCurrentLocation(location);

                const payload = {
                    userLocation: {
                        coordinates: [Number(location?.longitude), Number(location?.latitude)],
                        type: 'Point',
                    },
                };

                const url = `${BASE_URL}/hru/Patientappapi/nearestLocation`;
                const res = await postData(url, payload);

                if (res.status == false) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                console.log('getlocation data', res);
                if (res?.doc) setIsNearestLocAvailable(true);
                setNearestLocation(res?.doc);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        const getLocationList = async () => {
            try {
                const url = `${BASE_URL}/hru/Patientappapi/locationList`;

                const res = await postData(url, {});
                console.log('getLocationList', res);

                if (res.status == false) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                setLocationList(res?.docs);

                if (isNearestLocAvailable) {
                    const findJaipurLocation = res?.docs?.find((i: any) => i.city === 'Jaipur');
                    console.log({findJaipurLocation});
                    setNearestLocation(findJaipurLocation || res?.docs[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getLocation();
        getLocationList();
    }, []);

    return (
        <BackgroundGradient>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <LottieView source={require('../assets/LottieFiles/getLocation.json')} style={{height: wp(60), width: wp(60)}} autoPlay loop />

                <Animated.Text
                    style={{
                        fontSize: wp(5),
                        color: colors.darkBlue,
                        fontWeight: 'bold',
                    }}>
                    Getting Your Location ...
                </Animated.Text>
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({});
