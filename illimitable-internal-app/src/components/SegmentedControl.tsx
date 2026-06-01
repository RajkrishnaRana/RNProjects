import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {isTab} from '../utils/isTab';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props {
    options: {name: string; index: number}[];
    selectOptions: number;
    onOptionPress?: (index: number) => void;
    customStyles?: any;
    label?: string;
}

const SegmentedControl = ({
    options,
    selectOptions,
    onOptionPress,
    customStyles,
    label,
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
                <AnimatedGradient
                    colors={[Colors.LIGHT_BLUE, Colors.PRIMARY]}
                    style={[styles.animatedBlock, {width: itemWidth}, rStyle]}
                />

                {options.map(option => {
                    // Text Animation
                    const animatedTextStyle = useAnimatedStyle(() => {
                        return {
                            color: withTiming(
                                selectOptions === option.index
                                    ? Colors.WHITE
                                    : Colors.LIGHT_BLUE,
                            ),
                        };
                    }, [selectOptions, option.index]);

                    return (
                        <Pressable
                            key={option.index}
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
        height: hp(6.5),
        boxShadow: Colors.shadowColor,
        alignSelf: 'center',
        borderRadius: wp(10),
    },
    animatedBlock: {
        position: 'absolute',
        borderRadius: wp(10),
        height: '80%',
        top: '10%',
        backgroundColor: Colors.PRIMARY,
    },
    optionContaienr: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontFamily: 'Kreon',
        fontSize: isTab() ? wp(3) : wp(4.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
