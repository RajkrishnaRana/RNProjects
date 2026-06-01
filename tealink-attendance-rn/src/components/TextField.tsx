import { StyleSheet, Text, TextInput, View, StyleProp, ViewStyle, TouchableOpacity, TextStyle, KeyboardTypeOptions } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../common/colors';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { hp, wp } from '../utils/dimesion';

interface TextFieldProps {
    customLabelStyle?: StyleProp<TextStyle>;
    customContainerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<ViewStyle>;
    customTextInputContainerStyle?: StyleProp<ViewStyle>;
    label?: string;
    placeholder?: string;
    value: string;
    keyboardTypes?: KeyboardTypeOptions;
    isPassword?: boolean;
    onChangeText: (text: string) => void;
    errorValue?: string;
    onBlur?: () => void;
    isNecessary?: boolean;
    numberOfLines?: number;
    maxLen?: number;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disable?: boolean;
    rightIconPress?: () => void;
}

export default function TextField({
    customLabelStyle,
    customStyle = styles.textInput,
    customTextInputContainerStyle,
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
    leftIcon,
    rightIcon,
    disable,
    rightIconPress,
}: TextFieldProps) {
    const [isVisible, setIsVisible] = useState(isPassword);
    const errorColor = { color: 'red' };
    const borderColor = { borderColor: errorValue ? 'red' : 'transparent' };
    const disabledOpacity = { opacity: disable ? 0.5 : 1 };

    return (
        <View style={[styles.container, customContainerStyle]}>
            {label && (
                <Text style={[styles.label, customLabelStyle]}>
                    {label} {isNecessary && <Text style={errorColor}>*</Text>}
                </Text>
            )}
            <View
                style={[
                    styles.textInputContainer,
                    numberOfLines > 1 && { height: hp(10) },
                    borderColor,
                    customTextInputContainerStyle,
                    disabledOpacity,
                ]}
            >
                {leftIcon && <View style={{ marginRight: wp(2) }}>{leftIcon}</View>}

                <TextInput
                    style={customStyle}
                    value={value}
                    placeholder={`${placeholder}`}
                    placeholderTextColor={colors.grey}
                    onChangeText={onChangeText}
                    secureTextEntry={isVisible}
                    multiline={numberOfLines > 1}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardTypes}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    maxLength={maxLen}
                    editable={!disable}
                />

                {isPassword && value?.length > 0 && (
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        {isVisible ? (
                            <Ionicons name="eye" size={wp(5)} color={colors.black} />
                        ) : (
                            <Ionicons name="eye-off-sharp" size={wp(5)} color={colors.black} />
                        )}
                    </TouchableOpacity>
                )}

                {rightIcon && (
                    <TouchableOpacity style={{ paddingLeft: wp(2) }} onPress={rightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && <Text style={styles.error}>* {errorValue}</Text>}
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
    error: { color: 'red', fontSize: wp(3), marginTop: 5 },
});
