import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Colors} from '../common/colors';
import BigButton from '../components/buttons/BigButton';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const NoInternetScreen = ({setIsNoInternet}: {setIsNoInternet: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const {bottom} = useSafeAreaInsets();
    const handleRetry = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected && state.isInternetReachable !== false) {
                Toast.show({
                    type: 'success',
                    text1: 'Hurray! 🎉🎉 You are back online',
                    visibilityTime: 2000,
                });
                setIsNoInternet(false);
            } else {
                // still offline – keep the screen visible (optionally show a toast)
                Toast.show({
                    type: 'info',
                    text1: 'Still offline, please check your connection',
                    visibilityTime: 2000,
                });
            }
        });
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    alignItems: 'center',
                    // justifyContent: 'flex-end',
                    height: hp(70),
                }}>
                <LottieView
                    source={require('../assets/Lottie/hang.json')}
                    style={{
                        height: hp(40),
                        width: wp(100),
                        marginBottom: hp(10) + bottom,
                    }}
                    autoPlay
                    loop
                />

                <Image
                    source={require('../assets/icons/no-internet.png')} // Replace with your no internet image source
                    resizeMode="contain"
                    style={styles.img}
                />
                <Text style={styles.header}>Internet Connection !</Text>
                <Text style={styles.body}>Hurry!, Please turn on your internet connection and give your attendance.</Text>
            </View>

            <BigButton
                onPress={handleRetry}
                title="Retry"
                // customStyle={styles.buttonStyle}
            />
        </View>
    );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 20,
    },
    img: {
        width: wp(20),
        height: wp(20),
        alignSelf: 'center',
        marginBottom: '2%',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        marginBottom: 5,
    },
    body: {
        fontSize: 15,
        color: Colors.GREY,
        textAlign: 'center',
        marginBottom: 5,
    },
    buttonStyle: {
        width: wp(30),
        alignSelf: 'center',
        // marginTop: hp(5),
    },
});
