import {ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from '../../common/colors';
import Animated, {FadeIn, FadeOut, FadeInDown} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface BigButtonProps {
    onPress: () => void;
    title?: string;
    loading?: boolean;
    linearGradientColorArray?: [string, string];
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    animationTypeIn?: string;
    animationTypeOut?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    customMarginTop?: StyleProp<ViewStyle>;
}

function BigButton({
    onPress,
    title,
    loading,
    linearGradientColorArray,
    customStyle,
    customTextStyle,
    animationTypeIn,
    animationTypeOut,
    disabled,
    children,
    customMarginTop,
}: BigButtonProps) {
    return (
        <AnimatedTouchableOpacity
            entering={FadeIn.duration(300)}
            exiting={FadeOut}
            disabled={loading || disabled}
            onPress={onPress}
            style={[{marginTop: hp(7)}, customMarginTop]}>
            <LinearGradient
                colors={linearGradientColorArray || [Colors.LIGHT_BLUE, Colors.PRIMARY]}
                style={[styles.loginButton, customStyle, {opacity: disabled ? 0.5 : 1}]}>
                {loading ? (
                    <ActivityIndicator color={Colors.WHITE} />
                ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: wp(2), justifyContent: 'center'}}>
                        {children}
                        {title && (
                            <Text
                                style={[
                                    {
                                        color: Colors.WHITE,
                                        fontSize: wp(5),
                                        fontWeight: '700',
                                    },
                                    customTextStyle,
                                ]}>
                                {title}
                            </Text>
                        )}
                    </View>
                )}
            </LinearGradient>
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(10),
        width: wp(80),
        height: hp(7),
        alignSelf: 'center',
    },
});

export default memo(BigButton);
