import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../common/colors';

export default function LoginHeroSection() {
    return (
        <LinearGradient
            colors={[colors.white, colors.backgroundColor]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.imageBackgroundContainer}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        height: hp(25),
        width: wp(100),
    },
    logo: {
        width: 140,
        height: 65,
        alignSelf: 'center',
        marginTop: hp(7),
    },
});
