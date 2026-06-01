import React from 'react';
import { Pressable, SafeAreaView, View, StyleSheet, Button, StyleProp, ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../common/colors';

interface Props {
    value: SharedValue<boolean>;
    onPress: () => void;
    customStyle?: StyleProp<ViewStyle>;
    duration?: number;
    trackColors?: { on: string; off: string };
}

const AnimatedSwitch = ({ value, onPress, customStyle, duration = 300, trackColors = { on: colors.green, off: colors.grey } }: Props) => {
    const height = useSharedValue(0);
    const width = useSharedValue(0);

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(Number(value?.value), [0, 1], [trackColors.off, trackColors.on]);
        const colorValue = withTiming(color, { duration });

        return {
            backgroundColor: colorValue,
            borderRadius: height.value / 2,
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const moveValue = interpolate(Number(value?.value), [0, 1], [0, width.value - height.value]);
        const translateValue = withTiming(moveValue, { duration });

        return {
            transform: [{ translateX: translateValue }],
            borderRadius: height.value / 2,
        };
    });

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                onLayout={e => {
                    height.value = e.nativeEvent.layout.height;
                    width.value = e.nativeEvent.layout.width;
                }}
                style={[styles.buttonStyle, customStyle, trackAnimatedStyle]}
            >
                <Animated.View style={[styles.thumb, thumbAnimatedStyle]}></Animated.View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    thumb: {
        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'white',
    },
    buttonStyle: {
        width: 50,
        height: 25,
        padding: 5,
    },
});

export default AnimatedSwitch;
