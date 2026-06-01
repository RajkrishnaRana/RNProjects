import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {dataProps} from '../screens/SearchScreen';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {getName} from '../utils';
import {useNavigation} from '../hooks/useNavigation';

export default function SearchResult({item}: {item: AppointmentData}) {
    const navigation = useNavigation();

    const onPress = () => {
        navigation.push('Order Details', {item});
    };

    const patientName = getName(
        item.patientDetails?.firstName || '',
        item.patientDetails?.middleName || '',
        item.patientDetails?.lastName || '',
    );

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <FontAwesome5Icon
                name="search"
                size={wp(5)}
                color={colors.primary}
                style={{width: wp(8)}}
            />
            <Text style={{fontSize: wp(3.5), color: colors.black}}>
                {`${patientName} (${item?.appointmentDetails?.bookingId})`}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        borderBottomWidth: hp(0.1),
        borderColor: colors.primary,
    },
});
