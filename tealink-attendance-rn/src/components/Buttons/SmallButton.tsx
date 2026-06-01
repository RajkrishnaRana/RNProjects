import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';
import { wp, hp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import isTab from '../../utils/isTab';
import { android_ripple_value } from '../../constants/screenOptions';

interface SmallButtonProps {
    onPress: () => void;
    title?: string;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    customIcon?: React.ReactNode;
    customLoaderColor?: string;
}

function SmallButton({ onPress, title, loading, customStyle, customTextStyle, customIcon, customLoaderColor }: SmallButtonProps) {
    return (
        <Pressable
            style={[styles.loginButton, customStyle]}
            disabled={loading}
            onPress={onPress}
            android_ripple={android_ripple_value}
        >
            {loading ? (
                <ActivityIndicator color={customLoaderColor || colors.darkGreen} size={wp(4)} />
            ) : (
                <View style={styles.textIconContainer}>
                    {title && <Text style={[styles.buttonText, customTextStyle]}>{title}</Text>}
                    {customIcon && customIcon}
                </View>
            )}
        </Pressable>
    );
}

export default memo(SmallButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: isTab ? hp(0.5) : hp(2),
        paddingVertical: isTab ? hp(0.7) : hp(1),
        paddingHorizontal: wp(5),
        boxShadow: '0px 3px 5px rgba(3, 101, 23, 0.2)',
    },
    textIconContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    buttonText: {
        color: colors.darkGreen,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: '700',
    },
});
