import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import BackButton from '../BackButton';
import { isIos } from '../../utils/platform';
import { isNewBackTitleImplementation } from 'react-native-screens';
import { isTab } from '../../utils/isTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StackAppBarProps {
    title: string;
    rightIcon?: React.ReactNode;
    backbuttonDisable?: boolean;
    isLab?: boolean;
}

export default function StackAppBar({ title, rightIcon, backbuttonDisable, isLab = false }: StackAppBarProps) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
            {backbuttonDisable ? <View /> : <BackButton customPosition={{}} />}
            <Text style={styles.headerText}>{title}</Text>
            {rightIcon ? rightIcon : <View style={{ width: wp(5) }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(4),
        paddingBottom: hp(1),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        // borderBottomWidth: wp(0.05),
        // borderBottomColor: colors.grey,
        paddingTop: isIos() ? (isTab ? 10 : 0) : (StatusBar.currentHeight ?? 0) + hp(0.7),
    },
    headerText: {
        fontSize: isTab ? wp(3) : wp(5),
        color: colors.primary,
        fontWeight: 'bold',
    },
});
