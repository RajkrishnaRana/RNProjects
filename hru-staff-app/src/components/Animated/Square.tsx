import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {n, size} from '../../constants/animatedConstants';
import {colors} from '../../common/colors';

interface SquareProps {
    index: number;
    progress: Animated.SharedValue<number>;
}

export default function Square({index, progress}: SquareProps) {
    const offsetAngle = (2 * Math.PI) / n;
    const findAngle = offsetAngle * (n - 1 - index);

    const rotate = useDerivedValue(() => {
        if (progress.value <= 2 * Math.PI) {
            return Math.min(findAngle, progress.value);
        }

        if (progress.value - 2 * Math.PI < findAngle) {
            return findAngle;
        }

        return progress.value;
    }, []);

    const translateY = useDerivedValue(() => {
        if (rotate.value === findAngle) {
            return withSpring(-n * size);
        }

        if (progress.value > 2 * Math.PI) {
            return withTiming((index - n) * size);
        }

        return withTiming(-index * size);
    });

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {rotate: `${rotate.value}rad`},
                {translateY: translateY.value},
            ],
        };
    });

    return (
        <Animated.View
            key={index}
            style={[
                {
                    height: size,
                    aspectRatio: 1,
                    backgroundColor: colors.primary,
                    position: 'absolute',
                },
                rStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({});
