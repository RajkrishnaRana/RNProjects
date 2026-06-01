import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../common/colors';
import {isNewBackTitleImplementation} from 'react-native-screens';
import {isTab} from '../utils/isTab';

interface TagProps {
    backgroundColor: string;
    title: string;
    customStyle?: ViewStyle;
}

export default function Tag({backgroundColor, title, customStyle}: TagProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.Tag, customStyle, {backgroundColor: backgroundColor}]} />
            <Text style={{fontSize: isTab ? wp(1.8) : wp(3), color: backgroundColor}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    Tag: {
        width: wp(2),
        height: wp(2),
        borderRadius: wp(1),
    },
});
