import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {useNavigation} from '../hooks/useNavigation';

interface Props {
    appointment: AppointmentData[];
}

export default function SearchBar({appointment}: Props) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.push('Search', {appointment})}>
            <Text style={styles.text}>Search by Order No / Customer Name</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(5),
        backgroundColor: colors.white,
        borderRadius: wp(10),
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
        boxShadow: colors.primaryShadowColor2,
        borderColor: colors.primary,
        position: 'absolute',
        width: wp(90),
        zIndex: 2,
        top: hp(1),
    },
    text: {
        fontSize: wp(3.5),
        color: colors.grey,
    },
});
