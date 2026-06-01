import {StyleSheet, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import {useAuthStore} from '../../store/authStore';
import {BASE_URL} from '../../config';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import BackgroundGradient from '../../components/BackgroundGradient';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import useClinicAppointment from '../../hooks/useClinicAppointment';
import BigButton from '../../components/BigButton';
import NoSlotsAvialable from '../../components/LottieComponent/NoSlotsAvialable';
import {FlashList} from '@shopify/flash-list';
import TimingCards from '../../components/Cards/TimingCards';
import DateCards from '../../components/Cards/DateCards';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '../../hooks/useNavigation';
import Toast from 'react-native-simple-toast';

type LabBookingTimingScreenProps = RouteProp<RootStackParamList, 'LabBookingTimings'>;

type RenderItemForDateProps = {
    item: DateList;
    index: number;
};

type RenderItemForTimeProps = {
    item: Timing;
    index: number;
};

export default function LabBookingTimingScreen() {
    const navigation = useNavigation();
    const {key} = useRoute<LabBookingTimingScreenProps>().params;

    // GLOBAL STATES -------------------------->
    const {token} = useAuthStore();

    //DATA FETCHING ----------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientlabtestcheckoutpage?key=${key}`;
    console.log({url, token});
    const {isPending, error, data} = useQuery({
        queryKey: ['labBookingTimnig' + key],
        queryFn: async () => {
            const response = await postData(url, {token: token});
            if (!response?.status) {
                console.error(response?.msg);
                throw new Error(response?.msg || 'Unknown error occurred');
            }
            return response;
        },
        select: data => {
            console.log('Lab Booking Timings Data ------->', data);
            return data?.doc;
        },
    });

    //LOCAL FUNCTIONS --------------------------------->
    const {appointmentDates, setAppointmentDates, selectedAppointmentTimings, setSelectedAppointmentTimings} = useClinicAppointment(
        data?.responseData?.workLocationSlots[0]?.days
    );

    // Handling the date and day selections
    const handleOnPress = (index: number) => {
        let timings = appointmentDates?.[index]?.timings;

        setAppointmentDates(prev => {
            const updatedList = prev.map((listItem, listIndex) => ({
                ...listItem,
                isSelected: listIndex === index ? true : false,
            }));
            return updatedList;
        });

        setSelectedAppointmentTimings(timings);
    };

    // Handling the timings for appointment
    const handleOnPressForTimings = (index: number, timingIndex: number) => {
        console.log('Touch rendered on', index, timingIndex);
        const updatedList = selectedAppointmentTimings?.map((listItem, listIndex) => {
            return {
                ...listItem,
                slots: listItem?.slots?.map((slot, slotIndex) => {
                    return {
                        ...slot,
                        isSelected: listIndex === index && slotIndex === timingIndex ? true : false,
                    };
                }),
            };
        });

        setSelectedAppointmentTimings(updatedList);
    };

    const renderItemForDate = ({item, index}: RenderItemForDateProps) => <DateCards item={item} index={index} handleOnPress={handleOnPress} />;

    const renderItemForTimings = ({item, index}: RenderItemForTimeProps) => {
        if (item?.hide === true) return null;

        return <TimingCards item={item} index={index} handleOnPressForTimings={handleOnPressForTimings} />;
    };

    const handleBooking = () => {
        let isTimingSelected = false;

        selectedAppointmentTimings?.forEach(timing => {
            timing?.slots?.forEach(slot => {
                if (slot?.isSelected) isTimingSelected = true;
            });
        });

        if (!isTimingSelected) {
            Toast.show('Please select a timing', Toast.LONG);
            return;
        }

        console.log({appointmentDates, selectedAppointmentTimings, data});
        navigation.push('VerifyLabBooking', {appointmentDates, selectedAppointmentTimings, data});
    };

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <View style={styles.bodyContainer}>
                    {data?.responseData?.workLocationSlots[0]?.days === undefined ? (
                        <NoSlotsAvialable />
                    ) : (
                        <>
                            {/* List for Dates */}
                            <FlashList
                                data={appointmentDates}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={renderItemForDate}
                                keyExtractor={(item, index) => index.toString()}
                                decelerationRate={0.7}
                            />

                            <View style={{height: hp(2)}} />

                            {/* List for Timings */}
                            <FlashList
                                data={selectedAppointmentTimings}
                                renderItem={renderItemForTimings}
                                decelerationRate={0.7}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString() + item.id}
                                ItemSeparatorComponent={() => <View style={{height: hp(2)}} />}
                                ListEmptyComponent={() => <NoSlotsAvialable customText="We are closed today" />}
                            />

                            {/* Confirm Booking Button */}
                            <BigButton customStyle={{marginBottom: hp(2), marginTop: hp(2)}} title="Proceed to Book" onPress={handleBooking} />
                        </>
                    )}
                </View>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        paddingTop: hp(1),
        paddingHorizontal: wp(3),
    },
});
