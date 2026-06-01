import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import BackButton from './Buttons/Backbutton';

interface StackAppBarProps {
    title: string;
    rightIcon?: React.ReactNode;
}

export default function StackAppBar({title, rightIcon}: StackAppBarProps) {
    return (
        <View style={styles.headerContainer}>
            <BackButton customPosition={{}} />
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(4),
        paddingBottom: hp(1),
        alignItems: 'center',
        gap: wp(3),
        backgroundColor: colors.white,
        paddingTop: Platform.OS == 'ios' ? 0 : hp(5),
        boxShadow: colors.primaryShadowColor2,
        borderBottomEndRadius: wp(5),
        borderBottomStartRadius: wp(5),
    },
    headerText: {
        fontSize: wp(5),
        color: colors.primary,
        fontWeight: 'bold',
    },
});
