import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BackgroundGradient from '../BackgroundGradient';
import {isTab} from '../../utils/isTab';

export default function PageLoading({size}: {size?: number}) {
    return (
        <BackgroundGradient>
            <Animated.View
                entering={FadeInDown}
                exiting={FadeOut}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {/* <LottieView
                height={size || 100}
                width={size || 100}
                speed={2}
                source={require('../../assets/LottieFiles/pageLoading.json')}
                autoPlay
                loop
            /> */}
                <FastImage
                    style={{height: size || isTab ? wp(12) : wp(20), width: size || isTab ? wp(12) : wp(20)}}
                    source={require('../../assets/gif/pageloader.gif')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </Animated.View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({});
