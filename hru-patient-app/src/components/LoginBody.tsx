import { KeyboardAvoidingView, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { isIos } from '../utils/platform';
import { is } from 'zod/v4/locales';

interface LoginBodyProps {
    children: React.ReactNode;
    customStyle?: StyleProp<ViewStyle>;
}

export default function LoginBody({ children, customStyle }: LoginBodyProps) {
    return (
        <LinearGradient colors={[colors.white, colors.white, colors.backgroundColor]} style={[styles.bodyContainer, customStyle]}>
            <KeyboardAvoidingView behavior={isIos() ? 'padding' : 'height'} style={styles.keyboardAvoid}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        // backgroundColor: colors.white,
        // marginTop: hp(5),
        // borderWidth: 1,
        borderColor: colors.primary,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        paddingHorizontal: isIos() ? 0 : wp(12),
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    keyboardAvoid: { flex: 1, paddingHorizontal: isIos() ? wp(5) : wp(0) },
    container: { flexGrow: 1 },
});
