import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BackgroundGradient from '../components/BackgroundGradient';
import { colors } from '../common/colors';
import Animated, { FadeInUp, FadeOut, FadeOutLeft } from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SplashScreen() {
    return (
        <Animated.View exiting={FadeOutLeft} style={{ flex: 1 }}>
            <StatusBar animated={true} backgroundColor="transparent" translucent={true} hidden={false} barStyle="dark-content" />

            <BackgroundGradient>
                <View style={styles.container}>
                    <AnimatedImage entering={FadeInUp.duration(500)} source={require('../assets/images/appLogo.png')} style={styles.img} />
                    <ActivityIndicator size={35} color={colors.green} />
                </View>
            </BackgroundGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    img: {
        height: 200,
        width: 200,
    },
});
