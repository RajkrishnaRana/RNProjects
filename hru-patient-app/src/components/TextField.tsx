import { StyleSheet, Text, View, StyleProp, ViewStyle, Image, TouchableOpacity, TextStyle, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { useNavigation } from '../hooks/useNavigation';
import { isTab } from '../utils/isTab';

interface TextFieldProps {
    customContainerStyle?: StyleProp<ViewStyle>;
    customTextInputContainerStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customStyle?: StyleProp<TextStyle>;
    editable?: boolean;
    label?: string;
    isLabelActive?: boolean;
    placeholder: string;
    value: string | undefined;
    isPassword?: boolean;
    isNumeric?: boolean;
    isEmail?: boolean;
    isNecessary?: boolean;
    errorValue?: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    isGooglePlacesEnabled?: boolean;
    navigationProps?: any;
    multiline?: boolean;
    numberOfLine?: number;
}

function TextField({
    customContainerStyle,
    customTextInputContainerStyle,
    customLabelStyle,
    customStyle,
    editable = true,
    label,
    isLabelActive = false,
    placeholder,
    value,
    errorValue,
    isPassword = false,
    isNumeric = false,
    isEmail = false,
    isNecessary = false,
    onChangeText,
    onBlur,
    isGooglePlacesEnabled = false,
    navigationProps,
    multiline = false,
    numberOfLine = 1,
}: TextFieldProps) {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(isPassword);

    // Synchronize isVisible with isPassword changes
    useEffect(() => {
        setIsVisible(isPassword);
    }, [isPassword]);

    // console.log('isVisible', isVisible);
    // Styling props ------------------------>
    const borderColor = errorValue ? 'red' : colors.grey;
    const opacity = editable ? 1 : 0.5;

    return (
        <View style={customContainerStyle}>
            {isLabelActive && (
                <Text style={customLabelStyle || styles.label}>
                    {label}
                    {isNecessary && <Text style={styles.mandatory}> *</Text>}
                </Text>
            )}

            <View style={[styles.textInputContainer, customTextInputContainerStyle, { borderColor, opacity }]}>
                {!isGooglePlacesEnabled ? (
                    <TextInput
                        style={[customStyle || styles.textInput]}
                        value={value}
                        editable={editable}
                        placeholder={`${placeholder} ${isNecessary ? '*' : ''}`}
                        placeholderTextColor={colors.darkGrey}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        secureTextEntry={isVisible}
                        keyboardType={isNumeric ? 'numeric' : isEmail ? 'default' : 'email-address'}
                        multiline={multiline}
                        numberOfLines={numberOfLine}
                    />
                ) : (
                    <TouchableOpacity onPress={() => navigation.push('GooglePlaces', navigationProps)} style={styles.googlePlaceContainer}>
                        {value ? <Text style={styles.googlePlaceValue}>{value}</Text> : <Text style={styles.placeholderStyle}>{placeholder}</Text>}
                    </TouchableOpacity>
                )}

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsVisible(!isVisible);
                        }}
                    >
                        {isVisible ? (
                            <Image source={require('../assets/icons/hidden.png')} style={styles.passIcon} />
                        ) : (
                            <Image source={require('../assets/icons/eye.png')} style={[styles.passIcon, { tintColor: colors.black }]} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && <Text style={styles.error}>* {errorValue}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    mandatory: { color: 'red' },
    label: {
        fontSize: isTab ? wp(2) : wp(3),
        marginBottom: 5,
        color: colors.lightBlack,
        // fontWeight: '500',
    },
    textInputContainer: {
        height: isTab ? hp(4) : hp(5),
        backgroundColor: colors.white,
        borderWidth: wp(0.2),
        borderRadius: 10,
        paddingHorizontal: 10,
        // elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        color: colors.black,
        fontSize: isTab ? wp(2.3) : wp(3.7),
    },
    passIcon: {
        width: isTab ? wp(3) : wp(6),
        height: isTab ? wp(3) : wp(6),
        tintColor: colors.grey,
    },
    placeholderStyle: {
        fontSize: isTab ? wp(2.3) : wp(3.5),
        color: colors.lightBlack,
    },
    googlePlaceValue: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.black,
    },
    googlePlaceContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },
    error: { color: 'red', fontSize: isTab ? wp(2) : wp(3), marginTop: 5 },
});

export default React.memo(TextField);
