import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCurrentLocationStore } from '../../store/currentLocationStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { BASE_URL } from '../../config';
import { LegendList } from '@legendapp/list';
import SpecialitiesDoctorCard from '../../components/Cards/SpecialitiesDoctorCard';
import SearchedMedicineListCard from '../../components/Cards/SearchedMedicineListCard';
import BackgroundGradient from '../../components/BackgroundGradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type LabSearchPageProps = RouteProp<RootStackParamList, 'MedSearch'>;

const ListEmptyContainer = () => <Text style={styles.listEmpty}>No Doctors Found</Text>;

const MedSearchPage = () => {
    const { id } = useRoute<LabSearchPageProps>().params;

    // GLOBAL STATES ---------------------------->
    const { token, isAuthenticated } = useAuthStore();
    const nearestLocation = useCurrentLocationStore(s => s.nearestLocation);

    // LOCAL STATES ------------------------------->

    // DATA FETCHING ------------------------------>
    const url = `${BASE_URL}/hru/Patientappapi/${id}/search-medicine`;
    const payload = {
        token: isAuthenticated ? token : null,
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        searchLocationId: nearestLocation?._id,
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['medSearchPageData' + id],
        queryFn: () => postData(url, payload),
        select: res => {
            console.log('search medicine list', res?.doc);
            return res?.doc;
        },
    });

    //LOCAL FUNCTIONS ------------------------->

    return (
        <BackgroundGradient>
            <View style={styles.results}>
                <Text style={styles.text}>Result for</Text>
                <Text style={styles.searchText}>"Paracetamol"</Text>
            </View>
            <LegendList
                data={data?.getMedicines}
                // renderItem={({ item }) => <SearchedMedicineListCard data={item} topRatedViewAllScreen />}
                renderItem={({ item }) => <SearchedMedicineListCard data={item} topRatedViewAllScreen />}
                estimatedItemSize={20}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={ListEmptyContainer}
                decelerationRate={0.7}
                recycleItems
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </BackgroundGradient>
    );
};

export default MedSearchPage;

const styles = StyleSheet.create({
    listEmpty: {
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    results: {
        flexDirection: 'row',
        gap: wp(1),
        paddingLeft: wp(5),
        color: 'rgb(132, 144, 151)',
        alignItems: 'flex-end',
        marginTop: hp(1),
    },
    text: {
        color: 'rgb(124, 135, 141)',
    },
    searchText: {
        color: 'rgb(20, 103, 148)',
        fontWeight: '600',
        fontSize: wp(4.5),
        fontStyle: 'italic',
    },
});
