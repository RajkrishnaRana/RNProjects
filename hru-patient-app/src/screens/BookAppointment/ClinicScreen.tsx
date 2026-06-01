import {StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CliniqueCard from '../../components/CliniqueCard';
import {useAuthStore} from '../../store/authStore';
import {BASE_URL} from '../../config';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import {tokenExpiredMsg} from '../../utils';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import {FlashList} from '@shopify/flash-list';
import {useBookAppointmentStore} from '../../store/bookAppointmentStore';

type ClinicScreenRouteProp = RouteProp<RootStackParamList, 'Clinic'>;

export default function ClinicScreen() {
    const {id} = useRoute<ClinicScreenRouteProp>().params;

    // GLOBAL STATES ----------------------------------->
    const logout = useAuthStore(state => state.logout);
    const setDoctorDetails = useBookAppointmentStore(s => s.setDoctorDetails);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/doctorprofile`;
    // console.log(url);
    const {isPending, error, data} = useQuery({
        queryKey: ['doctorProfile' + id],
        queryFn: () => postData(url),
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            setDoctorDetails(data?.doc?.doctorDetails);
            return data?.doc?.doctorDetails?.addresses;
        },
    });

    // console.log(data);

    //LOCAL FUNCTIONS ----------------------------------------->
    const renderItem = ({item}: {item: ClinicInfo}) => (
        <CliniqueCard item={item} />
    );

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <FlashList
                    data={data as ClinicInfo[]}
                    estimatedItemSize={50}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={0.5}
                    keyExtractor={item => item?.id}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        marginTop: hp(1),
        paddingHorizontal: wp(3),
    },
    listContainer: {},
});
