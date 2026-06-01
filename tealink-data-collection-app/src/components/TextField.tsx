import { StyleSheet, Text, TextInput, View, StyleProp, ViewStyle, Image, TouchableOpacity, TextStyle, KeyboardTypeOptions } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

interface TextFieldProps {
    customLabelStyle?: StyleProp<TextStyle>;
    customContainerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<ViewStyle>;
    label?: string;
    placeholder: string;
    value: string;
    keyboardTypes?: KeyboardTypeOptions;
    isPassword?: boolean;
    onChangeText: (text: string) => void;
    errorValue?: string;
    onBlur?: () => void;
    isNecessary?: boolean;
    numberOfLines?: number;
    maxLen?: number;
    isQRCodeScan?: boolean;
    setQRCodeScan?: () => void;
}

export default function TextField({
    customLabelStyle,
    customStyle = styles.textInput,
    label,
    placeholder,
    keyboardTypes,
    value,
    isPassword = false,
    onChangeText,
    errorValue,
    onBlur,
    isNecessary = false,
    customContainerStyle,
    numberOfLines = 1,
    maxLen,
    isQRCodeScan,
    setQRCodeScan,
}: TextFieldProps) {
    const [isVisible, setIsVisible] = useState(isPassword);

    return (
        <View style={[styles.container, customContainerStyle]}>
            {label && (
                <Text style={customLabelStyle || styles.label}>
                    {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
            )}
            <View style={[styles.textInputContainer, numberOfLines > 1 && { height: hp(10) }, { borderColor: errorValue ? 'red' : 'transparent' }]}>
                <TextInput
                    style={customStyle}
                    value={value}
                    placeholder={`${placeholder}`}
                    placeholderTextColor={colors.darkGrey}
                    onChangeText={onChangeText}
                    secureTextEntry={isVisible}
                    multiline={numberOfLines > 1}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardTypes}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    maxLength={maxLen}
                />

                {isPassword && (
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        {isVisible ? (
                            <IoniconsIcon name="eye" size={wp(5)} color={colors.black} />
                        ) : (
                            <IoniconsIcon name="eye-off-sharp" size={wp(5)} color={colors.black} />
                        )}
                    </TouchableOpacity>
                )}

                {isQRCodeScan && (
                    <TouchableOpacity onPress={setQRCodeScan}>
                        <IoniconsIcon name="qr-code-outline" size={wp(5)} color={colors.black} />
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && <Text style={{ color: 'red', fontSize: wp(3), marginTop: 5 }}>* {errorValue}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: hp(0.5),
    },
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    textInputContainer: {
        backgroundColor: colors.white,
        borderWidth: wp(0.2),
        borderRadius: 10,
        paddingHorizontal: 10,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        color: colors.black,
        fontSize: wp(3.7),
    },
    passIcon: {
        width: wp(6),
        height: wp(6),
        tintColor: colors.grey,
    },
    placeholderStyle: {
        fontSize: wp(3.5),
        color: colors.lightBlack,
    },
    googlePlaceValue: {
        fontSize: wp(3.5),
        color: colors.black,
    },
    googlePlaceContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },
});
