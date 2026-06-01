import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import DashboardSearchBar from './DashboardSearchBar';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../api';
import { tokenExpiredMsg } from '../utils';
import { FlashList } from '@shopify/flash-list';
import SpecialitiesCard from './Cards/SpecialitiesCard';
import { isTab } from '../utils/isTab';

export default function DoctorSpecialistSection({ isLoading }: { isLoading: boolean }) {
    // const isFocused = useIsFocused();

    //GLOBAL STATE -------------------------------->
    const { token, logout, isAuthenticated } = useAuthStore();
    const nearestLocation = useCurrentLocationStore(s => s.nearestLocation);

    // GET PAGE DATA -------------------------------->
    const url = isAuthenticated ? `${BASE_URL}/hru/Patientappapi/appointmentbook` : `${BASE_URL}/hru/Patientappapi/appointmentbookwol`;
    // const url = `${BASE_URL}/hru/Patientappapi/mostsearchedspeciality`;

    const payload = {
        token: isAuthenticated ? token : null,
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        searchLocationId: nearestLocation?._id,
    };

    // console.log(payload);

    // console.log(payload);
    const { isPending, error, data, refetch } = useQuery({
        queryKey: [isAuthenticated ? 'mostSearchedSpeciality' : 'mostSearchedSpecialitywol'],
        queryFn: () => postData(url, payload),
        select: data => {
            // if (data?.tokenExpired) {
            //     // tokenExpiredMsg(logout);
            //     throw new Error('Token has expired. Please log in again.');
            // }
            console.log('Need a doctor', data);
            return data?.doc;
        },
    });

    useEffect(() => {
        refetch();
    }, [nearestLocation]);

    return (
        <>
            <View style={styles.container}>
                        <Text style={styles.header}>Need a Doctor ?</Text>
                        {isPending ? (
                            <ActivityIndicator size={wp(6)} color={colors.primary} style={{ marginTop: hp(2) }} />
                        ) : error ? (
                            <Text style={styles.errorMessage}>{error.message}</Text>
                        ) : (
                            <>
                                <DashboardSearchBar placeholder={"Search by name, speciality ..."} data={data?.searchSpecialistDoctors} payload={payload} />

                                {isLoading ? (
                                    <ActivityIndicator color={colors.black} size={isTab ? wp(2) : wp(3)} />
                                ) : (
                                    <>
                                        {data?.mostSearchedSpecialities && (
                                            <FlashList
                                                data={data?.mostSearchedSpecialities}
                                                renderItem={({ item }: { item: MostSearchedSpeciality }) => (
                                                    <SpecialitiesCard item={item} payload={payload} />
                                                )}
                                                numColumns={isTab ? 6 : 3}
                                                showsHorizontalScrollIndicator={false}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: isTab ? hp(2.5) : hp(2),
    },
    header: {
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: 'bold',
        color: colors.lightBlack,
    },
    errorMessage: {
        fontSize: isTab ? wp(2) : wp(4),
        fontWeight: '600',
        color: colors.red,
    },
});
