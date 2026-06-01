import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import { wp, hp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import isTab from '../../utils/isTab';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { android_ripple_value } from '../../constants/screenOptions';

interface GradientButtonProps {
    onPress: () => void;
    onLongPress?: () => void;
    title?: string;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    customIcon?: React.ReactNode;
    customLoaderColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GradientButton({
    onPress,
    onLongPress,
    title,
    loading,
    customStyle,
    customTextStyle,
    customIcon,
    customLoaderColor,
}: GradientButtonProps) {
    return (
        <AnimatedPressable
            disabled={loading}
            onPress={onPress}
            onLongPress={onLongPress}
            layout={LinearTransition}
            android_ripple={android_ripple_value}
        >
            <LinearGradient
                colors={['#00C855', '#00AA84']}
                useAngle={true}
                angle={160}
                angleCenter={{ x: 0.5, y: 0.5 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1.0 }}
                style={[styles.loginButton, customStyle]}
            >
                {loading ? (
                    <ActivityIndicator color={customLoaderColor || colors.white} size={wp(4)} />
                ) : (
                    <View style={styles.textIconContainer}>
                        {customIcon && customIcon}
                        {title && <Text style={[styles.buttonText, customTextStyle]}>{title}</Text>}
                    </View>
                )}
            </LinearGradient>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: isTab ? hp(1) : hp(3),
        paddingVertical: isTab ? hp(0.7) : 10,
    },
    textIconContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    buttonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});
