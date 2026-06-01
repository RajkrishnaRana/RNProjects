import {Alert, Button, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomTabHeader from '../components/CustomTabHeader';
import Geolocation from 'react-native-geolocation-service';
import {useAuthStore} from '../store/authStore';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {postData} from '../utils/apiHelper';
import Toast from 'react-native-toast-message';

type props = {
    latitude: number;
    longitude: number;
};

export default function TokenTestScreen() {
    // const token = useAuthStore(s => s.token);
    const {deviceId, tokens, setTokens} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    // const [isNoInternert, setIsNoInternert] = useState(false);

    const fetchData = async (token: string) => {
        try {
            setIsLoading(true);
            const url = 'https://illimitable.in/app/mobile/validate-token.json';
            const res = await postData(url, {token: token});

            // Toast2.show(`Token : ${token}`, Toast2.SHORT);

            if (res.tokenExpired === true) {
                Toast.show({
                    type: 'error',
                    text1: 'Token is Expired',
                    visibilityTime: 6000,
                });
            }

            if (res.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Token is valid',
                    visibilityTime: 6000,
                });
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Network request failed') {
                // setIsNoInternert(true);
            } else {
                console.error('Token validation error:', error);
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    visibilityTime: 4000,
                });

                // Toast.show(`${error}`, Toast.LONG);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <CustomTabHeader title="Token Test" />

            {/* <Button title="Captured Location" onPress={captureLocation} /> */}
            <ScrollView style={{flexGrow: 1, padding: wp(5)}}>
                {tokens.map((item, index) => (
                    <View style={{marginBottom: wp(5)}} key={index}>
                        <Text style={{marginBottom: wp(2)}}>{item}</Text>
                        <Button
                            title="Test"
                            onPress={() => {
                                fetchData(item);
                            }}
                        />
                    </View>
                ))}

                {/* <Text>{tokens[0]}</Text> */}
                {/* <Button title="Clear" onPress={() => setTokens('')} /> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({});
