import {ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import {isTab} from '../utils/isTab';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface BigButtonProps {
    onPress: () => void;
    title?: string;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    customIcon?: React.ReactNode;
    customLoaderColor?: string;
}

function BigButton({onPress, title, loading, customStyle, customTextStyle, customIcon, customLoaderColor}: BigButtonProps) {
    return (
        <AnimatedTouchableOpacity
            // entering={FadeInDown.duration(300).springify()}
            // exiting={FadeOut.duration(300)}
            style={[styles.loginButton, customStyle]}
            disabled={loading}
            onPress={onPress}>
            {loading ? (
                <ActivityIndicator color={customLoaderColor || colors.white} />
            ) : (
                <View>
                    {title && (
                        <Text
                            style={[
                                {
                                    color: colors.white,
                                    fontSize: isTab ? wp(3) : wp(5),
                                    fontWeight: '700',
                                },
                                customTextStyle,
                            ]}>
                            {title}
                        </Text>
                    )}
                    {customIcon && customIcon}
                </View>
            )}
        </AnimatedTouchableOpacity>
    );
}

export default memo(BigButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: isTab ? hp(3) : hp(7),
        paddingVertical: isTab ? hp(1) : hp(1.5),
    },
});
