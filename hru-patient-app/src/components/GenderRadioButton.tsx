import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isTab} from '../utils/isTab';

interface Props {
    checked: string | undefined;
    setChecked: (value: string) => void;
}

export default function GenderRadioButton({checked, setChecked}: Props) {
    const renderRadioButton = (value: string, label: string) => (
        <TouchableOpacity style={styles.radioContainer} onPress={() => setChecked(value)}>
            <View
                style={[
                    //   styles.radioOuter,
                    Platform.OS === 'ios' ? styles.iosRadioOuter : styles.androidRadioOuter,
                    checked === value && {borderColor: colors.primary},
                ]}>
                {checked === value && <View style={Platform.OS === 'ios' ? styles.iosRadioInner : styles.androidRadioInner} />}
            </View>
            <Text style={styles.radioText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{width: wp(43)}}>
            <Text style={styles.label}>Select Gender</Text>
            <View style={{flexDirection: 'row'}}>
                {renderRadioButton('MALE', 'Male')}
                {renderRadioButton('FEMALE', 'Female')}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: isTab ? wp(2) : wp(3),
        marginBottom: hp(1),
        color: colors.lightBlack,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: wp(5),
    },
    radioText: {
        fontSize: isTab ? wp(2.5) : wp(3.7),
        color: colors.black,
        marginLeft: wp(1),
    },
    iosRadioOuter: {
        width: isTab ? wp(3) : wp(5),
        height: isTab ? wp(3) : wp(5),
        borderRadius: wp(2.5),
        borderWidth: 1,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iosRadioInner: {
        width: isTab ? wp(2) : wp(3),
        height: isTab ? wp(2) : wp(3),
        borderRadius: wp(1.5),
        backgroundColor: colors.primary,
    },
    androidRadioOuter: {
        width: isTab ? wp(3) : wp(6),
        height: isTab ? wp(3) : wp(6),
        borderRadius: wp(3),
        borderWidth: 2,
        borderColor: colors.grey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    androidRadioInner: {
        width: isTab ? wp(2) : wp(3.5),
        height: isTab ? wp(2) : wp(3.5),
        borderRadius: wp(1.75),
        backgroundColor: colors.primary,
    },
});
