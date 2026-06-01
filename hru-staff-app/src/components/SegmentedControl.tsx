import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface Props {
    options: {name: string; index: number}[];
    selectOptions: number;
    onOptionPress?: (index: number) => void;
    customStyles?: any;
    label?: string;
    disable?: boolean;
}

const SegmentedControl = ({
    options,
    selectOptions,
    onOptionPress,
    customStyles,
    label,
    disable,
}: Props) => {
    const segmentedControlWidth = wp(100) - wp(8);
    const internalPadding = 10;
    const itemWidth =
        (segmentedControlWidth - internalPadding) / options.length;

    // Dark Green View Animation
    const rStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(itemWidth * selectOptions + internalPadding / 2),
        };
    }, [selectOptions, options, itemWidth]);

    return (
        <View style={customStyles}>
            {label && <Text style={styles.label}>{label} :</Text>}
            <View
                style={[
                    styles.container,
                    {
                        width: segmentedControlWidth,
                        paddingHorizontal: internalPadding / 2,
                    },
                ]}>
                <Animated.View
                    style={[styles.animatedBlock, rStyle, {width: itemWidth}]}
                />

                {options.map(option => {
                    // Text Animation
                    const animatedTextStyle = useAnimatedStyle(() => {
                        return {
                            color: withTiming(
                                selectOptions === option.index
                                    ? colors.white
                                    : colors.primary,
                            ),
                        };
                    }, [selectOptions, option.index]);

                    return (
                        <Pressable
                            key={option.index}
                            disabled={disable}
                            onPress={() => {
                                onOptionPress?.(option.index);
                            }}
                            style={[
                                styles.optionContaienr,
                                {width: itemWidth},
                            ]}>
                            <Animated.Text
                                style={[styles.optionText, animatedTextStyle]}>
                                {option.name}
                            </Animated.Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

export default memo(SegmentedControl);

const styles = StyleSheet.create({
    label: {
        fontFamily: 'Kreon',
        fontSize: wp(4.5),
        marginBottom: hp(0.5),
        marginLeft: wp(1),
    },
    container: {
        flexDirection: 'row',
        height: hp(5),
        boxShadow: colors.shadowColor,
        alignSelf: 'center',
        borderRadius: wp(5),
        backgroundColor: colors.white,
    },
    animatedBlock: {
        position: 'absolute',
        borderRadius: wp(5),
        height: '80%',
        top: '10%',
        backgroundColor: colors.primary,
    },
    optionContaienr: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontFamily: 'Kreon',
        fontSize: wp(3.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
