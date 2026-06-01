import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import MostSearchedLabTestCard from '../Cards/MostSearchedLabTestCard';
import {useNavigation} from '../../hooks/useNavigation';
import UploadPrescriptionSection from './UploadPrescriptionSection';

export default function DashboardLabPage({data, payload}: {data: any; payload: LabPayload}) {
    const navigation = useNavigation();

    // LOCAL FUNCTIONS -------------------------->
    const handleSearchBarPress = () => {
        navigation.push('Search', {
            data: data?.searchTestLabs,
            payload: payload,
            type: 'lab',
        });
    };

    return (
        <>
            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearchBarPress}>
                <Text style={styles.placeholderText}>Search ...</Text>
                <OcticonsIcons name="search" size={wp(5)} color={colors.darkGrey} />
            </TouchableOpacity>

            {/* Lab Data */}
            {data?.mostSearchedLabTest && (
                <FlashList
                    data={data?.mostSearchedLabTest}
                    renderItem={({item}: {item: MostSearchedLabTest}) => <MostSearchedLabTestCard item={item} payload={payload} />}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: wp(2)}}
                />
            )}

            {/* Upload Prescription Section */}
            <UploadPrescriptionSection data={data} />
        </>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: wp(3),
        borderWidth: wp(0.1),
        borderColor: colors.grey,
        marginVertical: hp(2),
        paddingVertical: hp(1.2),
        paddingHorizontal: wp(3),
        marginHorizontal: wp(4),
    },
    placeholderText: {
        fontSize: wp(3.5),
        color: colors.darkGrey,
    },
});
