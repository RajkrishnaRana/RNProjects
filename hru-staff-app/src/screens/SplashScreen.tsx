import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    useAnimatedValue,
    View,
} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import {colors} from '../common/colors';
import {n, size} from '../constants/animatedConstants';
import Square from '../components/Animated/Square';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function SplashScreen() {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(4 * Math.PI, {duration: 4000, easing: Easing.linear}),
            -1,
        );
    }, []);

    return (
        <View style={styles.container}>
            {new Array(12).fill(0).map((_, index) => {
                return <Square key={index} index={index} progress={progress} />;
            })}
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
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25, // Makes it a circle
        backgroundColor: 'blue', // Change color as needed
        position: 'absolute',
    },
});
