import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';

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
                <>
                    {title && (
                        <Text
                            style={[
                                {
                                    color: colors.white,
                                    fontSize: wp(5),
                                    fontWeight: '700',
                                },
                                customTextStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    )}
                    {customIcon && customIcon}
                </>
            )}
        </TouchableOpacity>
    );
}

export default memo(BigButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: hp(7),
        paddingVertical: hp(1.5),
        flexDirection: 'row',
        gap: wp(3),
    },
});
