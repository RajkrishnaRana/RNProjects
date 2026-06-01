import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { isTab } from '../utils/isTab';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { wp } from '../utils/dimesion';

interface CheckBoxProps {
    rememberMe: boolean;
    setRememberMe: any;
    title: string;
    value?: number;
    isDisable?: boolean;
}

export default function CheckBox({ rememberMe, setRememberMe, title, value, isDisable }: CheckBoxProps) {
    return (
        <TouchableOpacity disabled={isDisable} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRememberMe(value)}>
            {rememberMe ? (
                <FontAwesome name="check-circle" size={isTab ? wp(3) : wp(5.2)} color={colors.green} />
            ) : (
                <FontAwesome name="circle-thin" size={isTab ? wp(3) : wp(5.2)} color={colors.black} />
            )}
            <Text
                style={[
                    {
                        color: rememberMe ? colors.darkGreen : isDisable ? colors.grey : colors.black,
                        marginLeft: 5,
                        fontSize: isTab ? wp(2) : wp(3.5),
                        fontWeight: rememberMe ? 'bold' : 'normal',
                    },
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    rememberMeIcon: {
        width: isTab ? wp(3) : wp(5),
        height: isTab ? wp(3) : wp(5),
    },
});
