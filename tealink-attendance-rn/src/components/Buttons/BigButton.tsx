import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';
import { wp, hp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import { isTab } from '../../utils/isTab';

interface BigButtonProps {
    onPress: () => void;
    title?: string;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
    customIcon?: React.ReactNode;
    customLoaderColor?: string; 
}

function BigButton({ onPress, title, loading, customStyle, customTextStyle, customIcon, customLoaderColor }: BigButtonProps) {
    return (
        <TouchableOpacity style={[styles.loginButton, customStyle]} disabled={loading} onPress={onPress}>
            {loading ? (
                <ActivityIndicator color={customLoaderColor || colors.white} />
            ) : (
                <View>
                    {title && <Text style={[styles.buttonText, customTextStyle]}>{title}</Text>}
                    {customIcon && customIcon}
                </View>
            )}
        </TouchableOpacity>
    );
}

export default memo(BigButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: isTab ? hp(3) : hp(7),
        paddingVertical: isTab ? hp(1) : hp(1.5),
    },
    buttonText: {
        color: colors.white,
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: '700',
    },
});
