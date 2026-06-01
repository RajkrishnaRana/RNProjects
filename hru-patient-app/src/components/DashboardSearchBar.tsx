import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '../hooks/useNavigation';
import {SpecialiesPayload} from './Cards/SpecialitiesCard';
import {isNewBackTitleImplementation} from 'react-native-screens';
import {isTab} from '../utils/isTab';

export default function DashboardSearchBar({data, payload, placeholder}: {data: SearchSpecialistDoctors[]; payload: SpecialiesPayload; placeholder: string}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.push('Search', {
                    data: data,
                    payload: payload,
                });
            }}>
            <Text style={styles.placeHolderText}>{placeholder} </Text>

            <OcticonsIcons name="search" size={isTab ? wp(2.5) : wp(5)} color={colors.darkGrey} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: isTab ? hp(1) : hp(1.5),
        paddingVertical: isTab ? hp(1) : hp(1.2),
        paddingHorizontal: wp(3),
        borderRadius: wp(3),
    },
    placeHolderText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.darkGrey,
    },
});
