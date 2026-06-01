import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useCallback, useState } from 'react';
import { colors } from '../common/colors';
import SegmentedControl from './SegmentedControl';
import { BASE_URL } from '../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../api';
import { useAuthStore } from '../store/authStore';
import dayjs from 'dayjs';
import { tokenExpiredMsg } from '../utils';
import { AppointmentItemProps } from './Appointment';
import { FlashList } from '@shopify/flash-list';
import DashboardReminderCard from './Cards/DashboardReminderCard';
import { useNavigation } from '../hooks/useNavigation';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { MedicineDataType } from './Cards/MedicineCard';
import { isTab } from '../utils/isTab';

const options = [
    {
        name: 'Appointments',
        index: 0,
    },
    {
        name: 'Medicines',
        index: 1,
    },
];

export default function YourRecords() {
    const navigation = useNavigation();

    //GLOBAL STATES ------------------------->
    const { token, logout } = useAuthStore();

    const [selectOption, setSelectOption] = useState(0);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientappointmentlistdaterange`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['todayappointmentData'],
        queryFn: () =>
            postData(url, {
                token: token,
                start: new Date().valueOf(),
                end: new Date().valueOf(),
            }),
        staleTime: 1000 * 60 * 5,
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            const upcomingAppointments = data?.doc?.upcomingAppointments;
            console.log(upcomingAppointments);

            const appointmentsFromToday = upcomingAppointments.filter(
                (i: AppointmentItemProps) => new Date(i.startTime).getTime() >= new Date().getTime(),
            );
            // console.log(data, appointmentsFromToday);
            return upcomingAppointments;
        },
    });

    const url2 = `${BASE_URL}/hru/Patientappapi/patientdatewisemedicineintakereminder`;
    const startTime = dayjs().startOf('day').valueOf();
    const payload2 = {
        token: token,
        start: startTime,
        end: startTime,
        type: 'DAY',
    };
    const {
        isPending: loading,
        error: e,
        data: medsData,
        refetch: medsRefetch,
    } = useQuery({
        queryKey: ['medicineIntake' + startTime],
        queryFn: () => postData(url2, payload2),
        select: data => {
            console.log(data?.dayData);
            return data?.dayData;
        },
    });

    console.log(medsData);

    useFocusEffect(
        useCallback(() => {
            console.log('useFocusEffect running');
            refetch();
            medsRefetch();
        }, []),
    );

    if (data?.length == 0 && medsData?.length == 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.header} />
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>{moment().format('Do MMMM')}</Text>
                </View>
            </View>

            <View style={styles.body}>
                <SegmentedControl options={options} selectOptions={selectOption} onOptionPress={setSelectOption} />

                <View style={styles.listContainer}>
                    <FlashList
                        data={selectOption ? medsData : data}
                        renderItem={({ item }: { item: AppointmentItemProps | MedicineDataType }) => {
                            if (selectOption) return <DashboardReminderCard item={item as MedicineDataType} type="meds" />;
                            else return <DashboardReminderCard item={item as AppointmentItemProps} />;
                        }}
                        nestedScrollEnabled
                        ListEmptyComponent={() => (
                            <Text
                                style={{
                                    color: colors.lightBlack,
                                    alignSelf: 'center',
                                }}
                            >
                                {selectOption ? 'No Medicines intake for today' : 'No Appoinments for today'}
                            </Text>
                        )}
                    />
                </View>

                <TouchableOpacity
                    style={{ marginTop: isTab ? hp(0.5) : hp(1), alignItems: 'center' }}
                    onPress={() => {
                        if (selectOption) navigation.navigate('MEDICINE INTAKE');
                        else navigation.navigate('APPOINTMENTS');
                    }}
                >
                    <Text style={styles.link}>View all</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: isTab ? hp(1) : hp(2),
    },
    header: {
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: 'bold',
        color: colors.lightBlack,
    },
    banner: {
        backgroundColor: colors.primary,
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        borderTopStartRadius: wp(5),
        borderTopEndRadius: wp(5),
    },
    bannerText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.white,
        fontWeight: 'bold',
    },
    body: {
        backgroundColor: colors.white,
        paddingVertical: isTab ? hp(1) : hp(2),
        paddingHorizontal: wp(3),
        borderTopStartRadius: wp(5),
        borderBottomEndRadius: wp(5),
        borderBottomStartRadius: wp(5),
        height: isTab ? hp(32) : hp(50),
    },
    listContainer: {
        flex: 1,
        marginTop: hp(2),
    },
    link: {
        fontSize: isTab ? wp(2) : wp(3.8),
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        color: colors.primary,
    },
});
