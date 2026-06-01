import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import BigButton from '../../components/BigButton';
import { FlashList } from '@shopify/flash-list';
import CheckBox from '../../components/CheckBox';
import { useNavigation } from '../../hooks/useNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import NoSlotsAvialable from '../../components/LottieComponent/NoSlotsAvialable';
import useClinicAppointment from '../../hooks/useClinicAppointment';
import DateCards from '../../components/Cards/DateCards';
import TimingCards from '../../components/Cards/TimingCards';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { useBookAppointmentStore } from '../../store/bookAppointmentStore';
import { useAuthStore } from '../../store/authStore';
import { postData } from '../../api';
import { BASE_URL } from '../../config';
import { queryClient } from '../../../App';
import { isTab } from '../../utils/isTab';

type ClinicAppointmentScreen = RouteProp<RootStackParamList, 'ClinicAppointment'>;

type RenderItemForDateProps = {
    item: DateList;
    index: number;
};

type RenderItemForTimeProps = {
    item: Timing;
    index: number;
};

export default function ClinicAppointmentScreen() {
    const navigation = useNavigation();
    const { data, resheduleResponse, rescheduleAmount } = useRoute<ClinicAppointmentScreen>().params;
    // console.log(data);

    // GLOBAL STATES ------------------->
    const doctorDetails = useBookAppointmentStore(s => s.doctorDetails);
    const { token, isAuthenticated, setIsBooking } = useAuthStore();
    // console.log(doctorDetails);

    // CUSOM HOOK FOR DATA MANAGEMENT ----------------------------------->
    const { appointmentDates, setAppointmentDates, selectedAppointmentTimings, setSelectedAppointmentTimings } = useClinicAppointment(
        data?.dateTimeSlots,
    );

    // LOCAL STATES FOR VIDEO AND CLINIC VISIT ------------------------->
    const [inClinicVisit, setInClinicVisit] = useState<boolean>(modeSelector('clinic'));
    const [videoConsultation, setVideoConsultation] = useState<boolean>(modeSelector('video'));
    const [isloading, setIsLoading] = useState(false);

    // LOCAL FUNCTIONS ------------------------------------->
    // Mode selector function
    function modeSelector(data: string): boolean {
        if (resheduleResponse) {
            if (resheduleResponse?.mode === 'In Clinic Consultation' && data === 'clinic') return true;
            if (resheduleResponse?.mode === 'Video Consultation' && data === 'video') return true;
            else return false;
        }

        if (data === 'clinic') return true;
        return false;
    }

    // Handling the video and clinic options checkbox
    function handleOptions(item: number) {
        if (item === 1) {
            setInClinicVisit(prev => !prev);
            setVideoConsultation(false);
        } else {
            setInClinicVisit(false);
            setVideoConsultation(prev => !prev);
        }
    }

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

    const renderItemForDate = ({ item, index }: RenderItemForDateProps) => <DateCards item={item} index={index} handleOnPress={handleOnPress} />;

    const renderItemForTimings = ({ item, index }: RenderItemForTimeProps) => {
        if (item?.hide === true) return null;

        return <TimingCards item={item} index={index} handleOnPressForTimings={handleOnPressForTimings} />;
    };

    const handleConfirmBooking = async () => {
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

        if (!inClinicVisit && !videoConsultation) {
            Toast.show('Please select a mode of consultation', Toast.LONG);
            return;
        }

        try {
            setIsLoading(true);

            // const selectedItem = appointmentDates.find(i => i.isSelected);
            // console.log(selectedItem);
            // const day = selectedItem?.value;

            let selectedSlotDetails;
            for (const i of selectedAppointmentTimings || []) {
                selectedSlotDetails = i.slots.find(j => j.isSelected);
                if (selectedSlotDetails) {
                    break; // Exit the loop if the selectedSlotDetails is found
                }
            }
            // console.log(selectedSlotDetails);

            const date = moment(selectedSlotDetails?.id);
            const formattedDate = date.format('Do, MMM YYYY'); // Produces '6th, Apr 2025'
            const dayName = date.format('dddd'); // Produces 'Sunday'

            let payload: any = {
                token: token,
                doctorId: doctorDetails?._id,
                clinicId: selectedSlotDetails?.workAddressId,
                slotUid: selectedSlotDetails?.uid,
                startTime: selectedSlotDetails?.id,
                endTime: selectedSlotDetails?.endTime,
                consutationMode: videoConsultation ? 'Video Consultation' : 'In Clinic Consultation',
                consultationFee: videoConsultation ? data?.virtualConsultationFee : data?.consultationFee,
                slotTime: selectedSlotDetails?.display,
                slotDate: formattedDate,
                slotDay: dayName,
            };

            if (resheduleResponse?.appointmentId) {
                payload.appointmentId = resheduleResponse?.appointmentId;
            }
            if (resheduleResponse?.profileId) {
                payload.profileId = resheduleResponse?.profileId;
            }

            console.log(doctorDetails);
            console.log(payload);

            const url = `${BASE_URL}/hru/Patientappapi/checkappointment`;
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            if (resheduleResponse?.appointmentId && rescheduleAmount !== undefined) {
                let payload = {
                    appointmentId: resheduleResponse?.appointmentId,
                    profileId: resheduleResponse?.profileId,
                    doctorId: doctorDetails?._id,
                    workAddressId: selectedSlotDetails?.workAddressId,
                    uid: selectedSlotDetails?.uid,
                    startTime: selectedSlotDetails?.id,
                    endTime: selectedSlotDetails?.endTime,
                    bookedBy: 'PATIENT',
                    consultationMode: videoConsultation ? 'Video Consultation' : 'In Clinic Consultation',
                    consultationFee: videoConsultation ? data?.virtualConsultationFee : data?.consultationFee,
                };

                const formData = new FormData();
                formData.append('formData', JSON.stringify(payload));
                formData.append('token', token);
                console.log(payload);

                const url = `${BASE_URL}/hru/Patientappapi/bookappointment`;
                const res = await postData(url, formData, true);

                if (!res.status) {
                    Toast.show(`${res.msg}`, Toast.SHORT);
                    throw new Error(res.msg);
                }

                console.log(res);
                Toast.show('Appointment rescheduled successfully', Toast.LONG);
                queryClient.invalidateQueries({
                    queryKey: ['appointmentData'],
                });
                navigation.navigate('APPOINTMENTS');
            } else {
                navigation.push('VerifyBooking', { key: res?.key });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        setIsBooking(true);
        navigation.push('Login', { isBookingTime: true });
    };

    return (
        <View style={styles.bodyContainer}>
            {data?.dateTimeSlots === undefined ? (
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

                    <View style={{ height: hp(2) }} />

                    {/* List for Timings */}
                    <FlashList
                        data={selectedAppointmentTimings}
                        renderItem={renderItemForTimings}
                        decelerationRate={0.7}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString() + item.id}
                        ItemSeparatorComponent={() => <View style={{ height: hp(2) }} />}
                    />

                    {/* CheckBoxes for clinic or video consultancy */}
                    <View style={styles.checkBoxContainer}>
                        {data?.consultationFee && (
                            <CheckBox
                                title={`₹${data?.consultationFee} (In Clinic Visit)`}
                                rememberMe={inClinicVisit}
                                setRememberMe={handleOptions}
                                value={1}
                                isDisable={resheduleResponse?.mode === 'Video Consultation'}
                            />
                        )}
                        {data?.acceptVirtualConsultation && (
                            <CheckBox
                                title={`₹${data?.virtualConsultationFee} (Video Consultation)`}
                                rememberMe={videoConsultation}
                                setRememberMe={handleOptions}
                                value={0}
                                isDisable={resheduleResponse?.mode === 'In Clinic Consultation'}
                            />
                        )}
                    </View>

                    {/* Confirm Booking Button */}
                    <BigButton
                        customStyle={{ marginBottom: isTab ? hp(1) : hp(2), marginTop: hp(2) }}
                        title={isAuthenticated ? 'Confirm Booking' : 'Login / Signup to continue'}
                        onPress={isAuthenticated ? handleConfirmBooking : handleLogin}
                        loading={isloading}
                        customTextStyle={{ fontSize: isTab ? wp(3) : wp(4) }}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        paddingTop: hp(1),
        paddingHorizontal: wp(3),
        backgroundColor: colors.white,
    },
    checkBoxContainer: {
        flexDirection: isTab ? 'row' : 'column',
        gap: wp(3),
        paddingHorizontal: wp(3),
        marginTop: hp(1),
    },
});
