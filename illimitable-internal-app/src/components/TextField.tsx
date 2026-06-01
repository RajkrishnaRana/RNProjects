import {StyleSheet, Text, TextInput, View, StyleProp, ViewStyle, TextStyle, Image, Touchable, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import LinearGradient from 'react-native-linear-gradient';
import {UseFormSetValue} from 'react-hook-form';

interface TextFieldProps {
    customContainerStyle?: StyleProp<ViewStyle>;
    customTextInputContainerStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customStyle?: StyleProp<ViewStyle>;
    editable?: boolean;
    label?: string;
    placeholder: string;
    value: string | undefined;
    isNumeric?: boolean;
    isNecessary?: boolean;
    errorValue?: string;
    name: 'email' | 'totp';
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    setValue: UseFormSetValue<{email: string; totp: string}>;
}

export default function TextField({
    customContainerStyle,
    customTextInputContainerStyle,
    customLabelStyle,
    customStyle,
    editable = true,
    label,
    placeholder,
    value,
    errorValue,
    isNumeric = false,
    isNecessary = false,
    onChangeText,
    onBlur,
    name,
    setValue,
}: TextFieldProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [active, setActive] = useState(false);

    const onFocus = () => {
        setActive(true);
    };

    const blurFucntion = () => {
        onBlur && onBlur(), setActive(false);
    };

    return (
        <View style={customContainerStyle}>
            <Text style={[customLabelStyle || styles.label, {color: active ? Colors.PRIMARY : Colors.GREY}]}>
                {label}
                {isNecessary && <Text style={{color: 'red'}}> *</Text>}
            </Text>
            <View
                style={[
                    styles.textInputContainer,
                    customTextInputContainerStyle,
                    {
                        borderColor: errorValue ? 'red' : Colors.PRIMARY,
                        opacity: editable ? 1 : 0.5,
                        borderWidth: active ? 2 : 1,
                    },
                ]}>
                <TextInput
                    style={[customStyle || styles.textInput]}
                    value={value}
                    editable={editable}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.GREY}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={blurFucntion}
                    secureTextEntry={isVisible}
                    keyboardType={isNumeric ? 'numeric' : 'default'}
                />

                {value && (
                    <TouchableOpacity onPress={() => setValue(name, '')}>
                        <LinearGradient colors={[Colors.LIGHT_BLUE, Colors.PRIMARY]} style={styles.crossImgContainer}>
                            <Image source={require('../assets/icons/close.png')} style={styles.crossImg} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && <Text style={{color: 'red', fontSize: wp(3), marginTop: 5}}>* {errorValue}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(4),
        marginBottom: 2,
        fontWeight: 'bold',
        marginLeft: wp(2),
    },
    textInputContainer: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingBottom: 0,
        borderRadius: wp(10),
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        color: Colors.BLACK,
        fontSize: wp(4),
        paddingVertical: hp(2.5),
        marginLeft: wp(2),
        marginRight: wp(2),
    },
    crossImgContainer: {
        height: wp(7),
        width: wp(7),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(2),
    },
    crossImg: {
        height: wp(2.5),
        width: wp(2.5),
        tintColor: Colors.WHITE,
    },
});
