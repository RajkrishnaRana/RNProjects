import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Appointment, { AppointmentItemProps } from '../../components/Appointment';
import FilterBox from '../../components/FilterBox';
import AppointmentFilterModal from '../../components/Modal/AppointmentFilterModal';
import { FlashList } from '@shopify/flash-list';
import { colors } from '../../common/colors';
import { queryClient } from '../../../App';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BackgroundGradient from '../../components/BackgroundGradient';

type CompletedOrUpcoming = 'completedAppointments' | 'upcomingAppointments';

const EmptyComponent = () => <View style={styles.emptyContainer}>
    <Image source={require('../../assets/images/noPatient.png')} style={styles.emptyImage} />
    <Text
        style={styles.emptyText}>
        No Orders found for the date range
    </Text>
</View>

const ItemSeparatorComponent = () => (
    <View style={{ height: hp(1.7) }} /> // Adjust the height for the desired gap
)

export default function PharmacyOrdersScreen() {
    // GLOBAL STATES ------------------------------>
    // const { token, logout } = useAuthStore();

    // LOCAL STATES ----------------------------->
    const [completeOrUpcoming, setCompleteOrUpcoming] = useState<CompletedOrUpcoming>('completedAppointments');
    const [startDate, setStartDate] = useState<DateType>(dayjs().startOf('month') as DateType);
    const [endDate, setEndDate] = useState<DateType>(dayjs().endOf('month'));
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    // const url = `${BASE_URL}/hru/Patientappapi/patientpharmacyappointmentlist`;
    // const { isPending, error, data } = useQuery({
    //     queryKey: ['pharmacyOrdersData'],
    //     queryFn: () =>
    //         postData(url, {
    //             token: token,
    //             start: startDate!.valueOf(),
    //             end: endDate!.valueOf(),
    //         }),
    //     staleTime: 1000 * 60 * 5,
    //     select: data => {
    //         if (data?.tokenExpired) tokenExpiredMsg(logout);
    //         console.log('payload data', {
    //             token: token,
    //             start: startDate!.valueOf(),
    //             end: endDate!.valueOf(),
    //         });

    //         console.log('Lab Appointment Data', data);
    //         // console.log('payload', {
    //         //     token: token,
    //         //     start: startDate!.valueOf(),
    //         //     end: endDate!.valueOf(),
    //         // });
    //         return data;
    //     },
    // });

    // LOCAL FUNCTIONS ------------------------------>
    const renderItem = ({ item }: { item: AppointmentItemProps }) => {
        console.log('Appointment Item', item);
        return <Appointment item={item} type="lab" />;
    };

    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['labAppointmentData'],
        });
        setRefresh(false);
    };

    return (
        <View style={styles.container}>
            {/* {isPending ? (
                <PageLoading />
            ) : ( */}
            <BackgroundGradient customStyle={styles.bodyContainer}>
                <View style={styles.filterBoxContainer}>
                    <View style={styles.filterBoxRow}>
                        <FilterBox
                            name="Completed"
                            selected={completeOrUpcoming === 'completedAppointments'}
                            onPress={() => setCompleteOrUpcoming('completedAppointments')}
                        />
                        <FilterBox
                            name="Upcoming"
                            selected={completeOrUpcoming === 'upcomingAppointments'}
                            onPress={() => setCompleteOrUpcoming('upcomingAppointments')}
                        />
                    </View>

                    <AppointmentFilterModal
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        type="lab"
                    />
                </View>

                <FlashList
                    data={[]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={0.7}
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                    ListEmptyComponent={EmptyComponent}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </BackgroundGradient>
            {/* )} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    bodyContainer: {
        flex: 1,
        paddingTop: hp(1),
    },
    filterBoxRow: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
    },
    filterBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(2),
        alignItems: 'center',
    },
    appointMentListContainer: {
        flexGrow: 1,
    },
    emptyContainer: {
        height: hp(80),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.darkGrey,
        textAlign: 'center',
    },
    emptyImage: {
        width: 170,
        height: 100,
    }
});
