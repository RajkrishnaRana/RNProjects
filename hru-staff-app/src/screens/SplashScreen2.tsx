import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SplashScreen2() {
    const imageOffset = useSharedValue(wp(0));
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        // Delay slide animation after FadeInDown
        setTimeout(() => {
            imageOffset.value = withTiming(-80, {duration: 700});
            textOpacity.value = withDelay(200, withTiming(1, {duration: 700}));
        }, 700);
    }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: imageOffset.value}],
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));
    return (
        <View style={styles.container}>
            <AnimatedImage
                style={[styles.img, {position: 'absolute'}, imageAnimatedStyle]}
                source={require('../assets/images/h.png')}
            />

            <AnimatedImage
                style={[
                    styles.img,
                    {position: 'absolute', marginLeft: wp(26)},
                    textAnimatedStyle,
                ]}
                source={require('../assets/images/ru.png')}
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
    img: {
        width: 300,
        height: 150,
        resizeMode: 'contain',
    },
    textLogo: {
        position: 'absolute',
        // marginLeft: wp(26),
        opacity: 0, // Start hidden
    },
});
