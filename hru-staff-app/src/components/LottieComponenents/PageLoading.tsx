import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

export default function PageLoading({size}: {size?: number}) {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <LottieView
                speed={2}
                source={require('../../assets/LottieFiles/pageLoading.json')}
                autoPlay
                loop
                style={{height: 100, width: 100}}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
