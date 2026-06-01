import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {isTab} from '../utils/isTab';

interface SignUpPromptProps {
    primaryText: string;
    linkText: string;
    onPress: () => void;
}

export default function SignUpPrompt({primaryText, linkText, onPress}: SignUpPromptProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: hp(2),
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Text style={{color: colors.black, fontSize: isTab ? wp(2) : wp(3.5)}}>{primaryText}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={{color: colors.primary, fontSize: isTab ? wp(2) : wp(3.5)}}>{linkText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({});
