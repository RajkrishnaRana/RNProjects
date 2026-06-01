import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const GujuIcon = () => {
    return (
        <Animated.View style={styles.container} entering={BounceIn} exiting={BounceOut}>
            <Image source={require('../assets/icons/hacker.png')} style={styles.img} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'white',
        height: wp(10),
        width: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp(4),
        right: wp(3),
    },
    img: {
        height: wp(6),
        width: wp(6),
    },
});
