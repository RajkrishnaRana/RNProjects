import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import FilterBox from '../../components/FilterBox';
import Appointment, { AppointmentItemProps } from '../../components/Appointment';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { useAuthStore } from '../../store/authStore';
import PageLoading from '../../components/LottieComponent/PageLoading';
import { FlashList } from '@shopify/flash-list';
import { tokenExpiredMsg } from '../../utils';
import { BASE_URL } from '../../config';
import AppointmentFilterModal from '../../components/Modal/AppointmentFilterModal';
import dayjs from 'dayjs';
import { queryClient } from '../../../App';
import { DateType } from 'react-native-ui-datepicker';
import TabBarParent from '../../components/TabBarParent';
import BackgroundGradient from '../../components/BackgroundGradient';
import { isTab } from '../../utils/isTab';

export type AppointmentPostDataType = {
    token: string;
    start: number;
    end: number;
};

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

export default function AppointmentsScreen() {
    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);
    const logout = useAuthStore(state => state.logout);

    // LOCAL STATES ----------------------------->
    const [completeOrUpcoming, setCompleteOrUpcoming] = useState('completedAppointments');
    const [startDate, setStartDate] = useState<DateType>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<DateType>(dayjs().endOf('month'));
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientappointmentlistdaterange`;
    const { isPending, error, data } = useQuery({
        queryKey: ['appointmentData'],
        queryFn: () =>
            postData(url, {
                token: token,
                start: startDate!.valueOf(),
                end: endDate!.valueOf(),
            }),
        staleTime: 1000 * 60 * 5,
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            console.log(data);
            console.log('payload', {
                token: token,
                start: startDate!.valueOf(),
                end: endDate!.valueOf(),
            });
            return data;
        },
    });

    // LOCAL FUNCTIONS ------------------------------>
    const renderItem = ({ item }: { item: AppointmentItemProps }) => <Appointment item={item} />;

    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['appointmentData'],
        });
        setRefresh(false);
    };

    console.log(data);

    return (
        <TabBarParent>
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                {isPending ? (
                    <PageLoading />
                ) : (
                    <BackgroundGradient>
                        <View style={styles.bodyContainer}>
                            <View style={styles.filterBoxContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FilterBox
                                        name="Completed"
                                        selected={completeOrUpcoming === 'completedAppointments'}
                                        onPress={() => setCompleteOrUpcoming('completedAppointments')}
                                    />
                                    <FilterBox
                                        name="Pending"
                                        selected={completeOrUpcoming === 'upcomingAppointments'}
                                        onPress={() => setCompleteOrUpcoming('upcomingAppointments')}
                                    />
                                </View>

                                <AppointmentFilterModal startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
                            </View>

                            <FlashList
                                data={data?.doc?.[completeOrUpcoming] || []}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                decelerationRate={0.7}
                                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                                ListEmptyComponent={EmptyComponent}
                                ItemSeparatorComponent={ItemSeparatorComponent}
                            />
                        </View>
                    </BackgroundGradient>
                )}
            </View>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        marginTop: hp(1),
        // paddingHorizontal: wp(3),
    },
    filterBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isTab ? hp(1) : hp(2),
        alignItems: 'center',
        marginHorizontal: wp(3),
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
