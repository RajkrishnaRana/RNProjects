import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function LoginHeroSection() {
    return (
        <ImageBackground
            source={require('../assets/images/loginBackground.jpg')}
            style={styles.imageBackgroundContainer}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        height: hp(25),
        width: wp(100),
    },
    logo: {
        width: wp(40),
        height: hp(9),
        alignSelf: 'center',
        marginTop: hp(7),
    },
});
