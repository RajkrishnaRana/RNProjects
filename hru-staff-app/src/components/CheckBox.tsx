import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

interface CheckBoxProps {
    rememberMe: boolean;
    setRememberMe: any;
    title: string;
    value?: number;
}

export default function CheckBox({
    rememberMe,
    setRememberMe,
    title,
    value,
}: CheckBoxProps) {
    return (
        <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => setRememberMe(value)}>
            {rememberMe ? (
                <Image
                    source={require('../assets/icons/check.png')}
                    style={styles.rememberMeIcon}
                />
            ) : (
                <Image
                    source={require('../assets/icons/circle.png')}
                    style={styles.rememberMeIcon}
                />
            )}
            <Text
                style={{
                    color: rememberMe ? colors.primary : colors.black,
                    marginLeft: 5,
                    fontSize: wp(3.5),
                }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    rememberMeIcon: {
        width: wp(5),
        height: wp(5),
    },
});
