import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SegmentedControl from './SegmentedControl';
import OrderNowSection from './OrderNowSection';
import WelcomeOffer from './WelcomeOffer';
import ShopByHealthConcerns from './ShopByHealthConcerns';
import PopularCategories from './PopularCategories';
import {useQuery} from '@tanstack/react-query';
import {BASE_URL} from '../config';
import {postData} from '../api';
import {useAuthStore} from '../store/authStore';
import {useCurrentLocationStore} from '../store/currentLocationStore';
import DashboardLabPage from './Lab/DashboardLabPage';

const options = [
    {
        name: 'Medicines & Tablets',
        index: 0,
    },
    {
        name: 'Diagonstic Labs',
        index: 1,
    },
];

export default function LabsAndMedicines() {
    // GLOBAL STATES ----------------------------------->
    const {token, isAuthenticated} = useAuthStore();
    const {nearestLocation, setLocationList} = useCurrentLocationStore();

    // LOCAL STATES ----------------------------------->
    const [selectOption, setSelectOption] = useState(1);

    // DATA FETCHING -------------------------------------->
    const url = isAuthenticated ? `${BASE_URL}/hru/Patientappapi/labhomepage` : `${BASE_URL}/hru/Patientappapi/labhomepagewol`;
    const payload: LabPayload = {
        ...(isAuthenticated && {token: token}),
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        searchLocationId: nearestLocation?._id,
    };
    const {
        isLoading,
        error,
        data: labData,
    } = useQuery({
        queryKey: ['labHomeData'],
        queryFn: () => postData(url, payload),
        select: data => {
            console.log(data);
            return data?.doc;
        },
    });

    return (
        <View style={{marginTop: hp(2), flex: 1}}>
            <Text style={styles.header}>Diagonstic Tests : </Text>

            <View style={styles.body}>
                {/* <SegmentedControl options={options} selectOptions={selectOption} onOptionPress={setSelectOption} height={hp(7)} /> */}

                {/* Search Bar Section */}
                {selectOption == 0 ? (
                    <>
                        <OrderNowSection />
                        <WelcomeOffer />
                        <ShopByHealthConcerns />
                        <PopularCategories />
                    </>
                ) : (
                    <>
                        {isLoading ? (
                            <ActivityIndicator size={wp(6)} color={colors.primary} style={{marginTop: hp(2)}} />
                        ) : error ? (
                            <Text style={styles.errorMessage}>{error.message}</Text>
                        ) : (
                            <DashboardLabPage data={labData} payload={payload} />
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: wp(5),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    body: {
        backgroundColor: colors.white,
        borderRadius: wp(5),
        marginTop: hp(2),
        paddingVertical: hp(2),
    },
    errorMessage: {
        fontSize: wp(4),
        fontWeight: '600',
        color: colors.red,
    },
});
