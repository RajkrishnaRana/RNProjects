import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {dataProps} from '../screens/SearchScreen';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '../hooks/useNavigation';
import {SpecialiesPayload} from './Cards/SpecialitiesCard';
import {isTab} from '../utils/isTab';
import { useCurrentTabDashboard } from '../store/dashboardCurrentTab';

export default function SearchResult({item, payload, type}: {item: dataProps; payload: SpecialiesPayload; type?: 'lab'}) {
    const navigation = useNavigation();
    const { selectedTab } = useCurrentTabDashboard();

    const handlePress = () => {
        item.type === 'SPECIALITY'
            ? navigation.navigate('SpecialitiesBasedDoctors', {
                  id: item._id,
                  payload: payload,
              })
            : item.type === 'TEST'
            ? navigation.navigate('LabSearch', {id: item._id})
            : item.type === 'CLINIC'
            ? navigation.navigate('ClinicProfile', {id: item._id})
            : item.type === 'MEDICINE'
            ? navigation.navigate('MedSearch', {id: item._id})
            : navigation.navigate('DoctorProfile', {id: item._id});

        console.log(item);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <FontAwesome5Icon name={selectedTab === 'pharmacy' ? "capsules" : "stethoscope"} size={isTab ? wp(2.5) : wp(5)} color={colors.darkBlue} style={{width: wp(8)}} />
            <Text style={{color: colors.black, fontSize: isTab ? wp(2) : wp(3.5)}}>{item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        paddingVertical: isTab ? hp(1) : hp(2),
        borderBottomWidth: hp(0.1),
        borderColor: colors.grey,
    },
});
