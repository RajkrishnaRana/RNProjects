import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function NoInternetScreen() {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/LottieFiles/networkError.json')}
                autoPlay
                loop
                style={{height: hp(40), width: wp(80)}}
            />

            <Image
                source={require('../assets/images/logo.png')}
                style={{
                    height: hp(5),
                    width: wp(20),
                    position: 'absolute',
                    bottom: wp(5),
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
