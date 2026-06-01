import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';
import { wp, hp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import isTab from '../../utils/isTab';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { android_ripple_value } from '../../constants/screenOptions';

interface MidButtonProps {
    onPress: () => void;
    title?: string;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    customIcon?: React.ReactNode;
    customLoaderColor?: string;
    testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MidButton({ onPress, title, loading, customStyle, customTextStyle, customIcon, customLoaderColor, testID }: MidButtonProps) {
    return (
        <AnimatedPressable
            testID={testID}
            style={[styles.loginButton, customStyle]}
            disabled={loading}
            onPress={onPress}
            android_ripple={android_ripple_value}
            layout={LinearTransition}
        >
            {loading ? (
                <ActivityIndicator color={customLoaderColor || colors.white} size={wp(4)} />
            ) : (
                <View style={styles.textIconContainer}>
                    {title && <Text style={[styles.buttonText, customTextStyle]}>{title}</Text>}
                    {customIcon && customIcon}
                </View>
            )}
        </AnimatedPressable>
    );
}

export default memo(MidButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: isTab ? hp(1) : hp(3),
        paddingVertical: isTab ? hp(0.7) : hp(1.3),
    },
    textIconContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    buttonText: {
        color: colors.white,
        fontSize: isTab ? wp(2) : wp(4),
        fontWeight: '700',
    },
});
