import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface LoginBodyProps {
    children: React.ReactNode;
}

export default function LoginBody({children}: LoginBodyProps) {
    return (
        <View style={styles.bodyContainer}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1, paddingBottom: hp(30)}}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always">
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        backgroundColor: colors.white,
        marginTop: hp(-5),
        borderWidth: 1,
        borderColor: colors.primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: wp(5),
    },
});
