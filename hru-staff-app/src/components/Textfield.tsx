import {
    StyleSheet,
    Text,
    TextInput,
    View,
    StyleProp,
    ViewStyle,
    Image,
    TouchableOpacity,
    TextStyle,
} from 'react-native';
import React, {useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

interface TextFieldProps {
    customContainerStyle?: StyleProp<ViewStyle>;
    customTextInputContainerStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customStyle?: StyleProp<ViewStyle>;
    editable?: boolean;
    label?: string;
    placeholder: string;
    value: string | undefined;
    isPassword?: boolean;
    isNumeric?: boolean;
    isNecessary?: boolean;
    errorValue?: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
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
    isPassword = false,
    isNumeric = false,
    isNecessary = false,
    onChangeText,
    onBlur,
}: TextFieldProps) {
    const [isVisible, setIsVisible] = useState(isPassword ? true : false);

    return (
        <View style={customContainerStyle}>
            {label && (
                <Text style={customLabelStyle || styles.label}>
                    {label}
                    {isNecessary && <Text style={{color: 'red'}}> *</Text>}
                </Text>
            )}
            <View
                style={[
                    styles.textInputContainer,
                    customTextInputContainerStyle,
                    {
                        borderColor: errorValue ? 'red' : colors.grey,
                        opacity: editable ? 1 : 0.5,
                    },
                ]}>
                <TextInput
                    style={[customStyle || styles.textInput]}
                    value={value}
                    editable={editable}
                    placeholder={placeholder}
                    placeholderTextColor={colors.grey}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    secureTextEntry={isVisible}
                    keyboardType={isNumeric ? 'numeric' : 'default'}
                />

                {isPassword && (
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        {isVisible ? (
                            <Image
                                source={require('../assets/icons/hidden.png')}
                                style={[styles.passIcon]}
                            />
                        ) : (
                            <Image
                                source={require('../assets/icons/eye.png')}
                                style={styles.passIcon}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {errorValue && (
                <Text style={{color: 'red', fontSize: wp(3), marginTop: 5}}>
                    * {errorValue}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(4),
        marginBottom: 5,
        color: colors.black,
        fontWeight: 'bold',
    },
    textInputContainer: {
        height: hp(6.5),
        backgroundColor: colors.blueWhite,
        borderWidth: wp(0.2),
        borderRadius: 20,
        paddingHorizontal: 10,
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
        tintColor: colors.black,
    },
    placeholderStyle: {
        fontSize: wp(3.5),
        color: colors.grey,
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
