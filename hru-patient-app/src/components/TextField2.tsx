import {StyleSheet, Text, TextInput, View, StyleProp, ViewStyle, Image, TouchableOpacity, TextStyle} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {isTab} from '../utils/isTab';

interface TextFieldProps {
    customLabelStyle?: StyleProp<TextStyle>;
    customStyle?: StyleProp<ViewStyle>;
    label?: string;
    placeholder: string;
    value: string;
    isPassword?: boolean;
    onChangeText: (text: string) => void;
    errorValue?: string;
    onBlur?: () => void;
    isNecessary?: boolean;
}

export default function TextField2({
    customLabelStyle,
    customStyle = styles.textInput,
    label,
    placeholder,
    value,
    isPassword = false,
    onChangeText,
    errorValue,
    onBlur,
    isNecessary = false,
}: TextFieldProps) {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <View>
            {/* <Text style={customLabelStyle || styles.label}>{label}</Text> */}
            <View style={[styles.textInputContainer, {borderColor: errorValue ? 'red' : colors.grey}]}>
                <TextInput
                    style={customStyle}
                    value={value}
                    placeholder={`${placeholder} ${isNecessary ? '*' : ''}`}
                    placeholderTextColor={colors.darkGrey}
                    onChangeText={onChangeText}
                    secureTextEntry={isVisible}
                />

                {isPassword && (
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        {isVisible ? (
                            <Image source={require('../assets/icons/hidden.png')} style={styles.passIcon} />
                        ) : (
                            <Image source={require('../assets/icons/eye.png')} style={[styles.passIcon, {tintColor: colors.black}]} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && <Text style={{color: 'red', fontSize: wp(3), marginTop: 5}}>* {errorValue}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(3),
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
        fontSize: isTab ? wp(2.5) : wp(3.7),
    },
    passIcon: {
        width: isTab ? wp(3) : wp(6),
        height: isTab ? wp(3) : wp(6),
        tintColor: colors.grey,
    },
    placeholderStyle: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
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
