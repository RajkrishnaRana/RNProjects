import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';

interface Props {
    test: LabTest;
}

export default function LabTestNameCard({test}: Props) {
    const navigation = useNavigation();

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.push('LabDetails', {test})}>
                <Text style={styles.testName}>{test.testName}</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.transparentPrimary
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(5),
        // boxShadow: '0 0px 8px rgba(29, 186, 181, 0.5)',
        borderWidth: wp(0.2),
        borderColor: colors.grey,
    },
    testName: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
});
