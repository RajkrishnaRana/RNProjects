import {
    Alert,
    ColorValue,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import DoctorProfile from '../../components/DoctorProfile';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks/useNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { BASE_URL } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { getName, tokenExpiredMsg } from '../../utils';
import { useAuthStore } from '../../store/authStore';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import moment from 'moment';
import BigButton from '../../components/BigButton';
import { downloadFile } from '../../utils/fileHelper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import RaiseDisputeModal from '../../components/Modal/RaiseDisputeModal';
import { queryClient } from '../../../App';
import ProviderRatingModal from '../../components/Modal/ProviderRatingModal';
import Details from '../../components/Details';
import { useBookAppointmentStore } from '../../store/bookAppointmentStore';
import Animated, { FadeInDown, FadeOutDown, LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';
import BackgroundGradient from '../../components/BackgroundGradient';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { isTab } from '../../utils/isTab';

type AppointmentDetailScreenRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AppointmentDetailScreen() {
    const navigation = useNavigation();
    const { id } = useRoute<AppointmentDetailScreenRouteProp>().params;

    // GLOBAL STATES ----------------------------------->
    const { logout, token } = useAuthStore();
    const setDoctorDetails = useBookAppointmentStore(s => s.setDoctorDetails);

    // LOCAL STATES ----------------------------------->
    const [loading, setLoading] = useState(false);
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isAtEnd, setIsAtEnd] = useState(isTab ? true : false);
    const [refresh, setRefresh] = useState(false);
    const [isExpanded, setIsExpanded] = useState(isTab ? true : false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/patientappointmentdetails`;
    const { isPending, error, data } = useQuery({
        queryKey: ['appointMentDetailsData' + id],
        queryFn: async () => {
            const response = await postData(url);
            if (response?.status === false) {
                throw new Error(response?.msg || 'Unknown error occurred');
            }
            return response;
        },
        select: d => {
            if (d?.tokenExpired) tokenExpiredMsg(logout);
            console.log('Appointment Details api data ----', d);
            return d?.doc;
        },
    });

    // LOCAL FUNCTIONS ------------------------------->
    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['appointMentDetailsData' + id],
        });
        setRefresh(false);
    };

    const handleDoctorProfilePress = () => {
        navigation.push('DoctorProfile', { id: data?.doctorDetails?._id });
        // navigation.getParent('DrawerNavigator').openDrawer();
    };

    const appointmentDetailsDownload = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/${data?._id}/transaction-details.pdf`;
        const fileName = 'appointmentDetails.pdf';

        console.log({ url });

        await downloadFile(url, fileName);
    };

    const handleCancelPress = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                appointmentId: data._id,
                cancelCheckIn: true,
                cancelCheckInDate: new Date(),
                status: -1,
            };

            // Fetch the query if no cached data is found
            const url = `${BASE_URL}/hru/Patientappapi/canceldoctorappointmentbypatient`;
            const res = await postData(url, payload);

            console.log(res);

            if (!res.status) {
                throw new Error(res.msg);
            }

            // console.log('Data deleted successfully---------');
            Toast.show('Appointment cancelled successfully', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['appointmentData'],
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting data:', error);
            Toast.show(`${error}`, Toast.SHORT); // Show error message to the user
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = (data: any) => {
        Alert.alert('Are you sure ? ', 'If yes then, your refund will be processed within 7 working days. ', [
            {
                text: 'No',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    handleCancelPress(data);
                },
            },
        ]);
    };

    const viewDisputeOperation = async (data: string) => {
        const queryKey = ['disputeList'];

        const cachedData: any = queryClient.getQueryData(queryKey);

        if (cachedData) {
            const cachedArr = cachedData.docs;

            for (let i = 0; i < cachedArr.length; i++) {
                if (cachedArr[i]?.dispute?.disputeId === data) {
                    navigation.push('EditDispute', { item: cachedArr[i] });
                    return;
                }
            }
        } else {
            try {
                setLoading(true);

                // Fetch the query if no cached data is found
                const url = `${BASE_URL}/hru/Patientappapi/patientdisputelist`;
                const fetchedData = await queryClient.fetchQuery({
                    queryKey: ['disputeList'],
                    queryFn: () => postData(url, { token: token }),
                });

                if (fetchedData?.docs) {
                    const fetchedArr = fetchedData?.docs;

                    for (let i = 0; i < fetchedArr?.length; i++) {
                        if (fetchedArr[i]?.dispute?.disputeId === data) {
                            navigation.push('EditDispute', {
                                item: fetchedArr[i],
                            });
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching dispute list:', error);
                Toast.show('Failed to fetch dispute list', Toast.SHORT); // Show error message to the user
            } finally {
                setLoading(false);
            }
        }
    };

    const colorDetector = (text: string) => {
        const isCompleted = new RegExp(`\\bCompleted\\b`, 'i'); // 'i' for case-insensitive matching
        const isCancelled = new RegExp(`\\bCancelled\\b`, 'i');
        const isBooked = new RegExp(`\\bBooked\\b`, 'i');
        const isCheckedIn = new RegExp(`\\bChecked In\\b`, 'i');

        let color = colors.black;
        if (isCompleted.test(text)) color = colors.primary;
        if (isCancelled.test(text)) color = colors.red;
        if (isBooked.test(text) || isCheckedIn.test(text)) color = colors.darkBlue;

        return color as ColorValue;
    };

    const isRemote = (text: string) => {
        const iR = new RegExp(`\\bRemote\\b`, 'i');
        return iR.test(text);
    };

    const isCancelled = (text: string) => {
        const iC = new RegExp(`\\bCancelled\\b`, 'i');
        return !iC.test(text);
    };

    const rescheduleAppointment = async () => {
        try {
            setRescheduleLoading(true);
            var payload = {
                workAddressId: data?.workAddressId,
                appointmentId: data?._id,
                profileId: data?.profileId,
                mode: data?.consultationMode,
                fee: data?.consultationFee,
            };

            const url = `${BASE_URL}/hru/Patientappapi/rescheduledoctorappointment`;
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show('${res.msg}', Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('reshcedule data ----------------->', res);
            // queryClient.invalidateQueries({
            //     queryKey: ['doctorProfile' + data?.doctorId],
            // });

            // previous flow of the reshedule process -------------->
            // navigation.push('DoctorProfile', {
            //     id: data?.doctorId,
            //     key: res?.key,
            // });

            // New flow of the reshedule process --------------->
            const url2 = `${BASE_URL}/hru/Patientappapi/${data?.doctorId}/doctorprofile?key=${res?.key}`;
            const res2 = await postData(url2);

            const doc = res2?.doc;
            setDoctorDetails(doc?.doctorDetails);
            // console.log('reschedule Response', res2);
            const selectedClinicData = doc?.doctorDetails?.addresses?.find((item: any) => item?.id === doc?.responseData?.workAddressId);
            // console.log('selectedClinicData', selectedClinicData);

            navigation.push('ClinicAppointment', {
                data: selectedClinicData,
                resheduleResponse: doc?.responseData,
                rescheduleAmount: doc?.rescheduleAmount,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setRescheduleLoading(false);
        }
    };

    const getConsultaionFees = () => {
        if (data?.bookedBy === 'DOCTOR') {
            return data?.invoice?.services ? data?.invoice?.services[0]?.serviceCharges : 0;
        }

        if (data?.bookedBy === 'PATIENT' && data?.consultationFee && !data?.isCharge) {
            return data?.consultationFee;
        }

        if (data?.bookedBy === 'PATIENT' && data?.consultationFee && data?.isCharge) {
            data?.invoice?.services ? data?.invoice?.services[0]?.serviceCharges : 0;
        }

        return 0;
    };

    const getDiscount = () => {
        if (data?.bookedBy === 'DOCTOR') {
            return data?.invoice?.services ? data?.invoice?.services[0]?.serviceDiscount : 0;
        }

        if (data?.bookedBy === 'PATIENT') {
            return data?.transactions?.[0]?.total - data?.transactions?.[0]?.amount;
        }

        return 0;
    };

    const getAmountPaid = () => {
        if (data?.bookedBy === 'DOCTOR') {
            return data?.invoice?.totalAmt ? data?.invoice?.totalAmt : 0;
        }

        if (data?.bookedBy === 'PATIENT' && data?.rzrpStatus !== 'received') {
            return 0;
        }

        if (data?.bookedBy === 'PATIENT' && data?.rzrpStatus === 'received' && data?.transactions && data?.transactions[0]?.total) {
            return data?.transactions[0].amount;
        }

        return 0;
    };

    const getDueAmount = () => {
        if (data?.bookedBy === 'DOCTOR' && data?.invoice?.totalAmt === 0) {
            return 0;
        }

        if (data?.bookedBy === 'DOCTOR' && data?.invoice?.services && data?.invoice?.totalAmt > 0) {
            return data?.invoice.services[0].serviceCharges - data?.invoice.totalAmt;
        }

        if (data?.bookedBy === 'PATIENT' && data?.rzrpStatus !== 'received') {
            return 0;
        }

        if (
            data?.bookedBy === 'PATIENT' &&
            data?.consultationFee &&
            !data?.isCharge &&
            data?.rzrpStatus === 'received' &&
            data?.transactions &&
            data?.transactions[0].total
        ) {
            return data?.consultationFee - data?.transactions[0].total;
        }

        if (
            data?.bookedBy === 'PATIENT' &&
            data?.consultationFee &&
            data?.isCharge &&
            data?.rzrpStatus === 'received' &&
            data?.transactions &&
            data?.transactions[0].total
        ) {
            data?.invoice?.totalAmt ? data?.invoice?.totalAmt : 0 - data?.transactions[0]?.total;
        }

        return 0;
    };

    const handleScrollToEnd = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isEndReached = contentOffset.y >= contentSize.height - layoutMeasurement.height - 10; // Small threshold for precision
        setIsAtEnd(isEndReached);
    };

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <>
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        contentContainerStyle={styles.container}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                        scrollEventThrottle={16}
                    >
                        <TouchableOpacity style={styles.profileContainer} onPress={handleDoctorProfilePress}>
                            <DoctorProfile data={data?.doctorDetails as DoctorDetails} />
                        </TouchableOpacity>

                        {/* Scheduled Appointment Section */}
                        <Animated.View style={styles.detailCard} layout={LinearTransition}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.headerText}>
                                    Appointment{' '}
                                    <Text
                                        style={{
                                            color: colorDetector(data?.statusTxt),
                                        }}
                                    >
                                        ({data?.statusTxt})
                                    </Text>
                                </Text>

                                <BigButton
                                    customIcon={
                                        <MaterialCommunityIcon name="file-download-outline" size={isTab ? wp(4) : wp(6)} color={colors.primary} />
                                    }
                                    onPress={appointmentDetailsDownload}
                                    customStyle={{
                                        marginTop: 0,
                                        width: isTab ? wp(10) : wp(12),
                                        // paddingVertical: hp(1),
                                        backgroundColor: colors.white, //'rgba(29, 186, 181, 0.1)',
                                        borderRadius: wp(2),
                                    }}
                                />
                            </View>
                            <View style={{ gap: isTab ? wp(1) : wp(1.5), marginTop: hp(1) }}>
                                <Details title="Date & Hour" value={moment(data?.startTime).format('MMMM DD, YYYY | hh:mm A')} />
                                <Details title="Clinic Details" value={data?.doctorDetails?.workLocation} />
                                <Details title="Booking Id" value={data?.bookingId} />
                                {data?.consultationMode && (
                                    <Details title="Consultation Type" value={data?.consultationMode} isRemote={isRemote(data?.consultationMode)} />
                                )}
                                <Details title="Booking Confirmation No" value={data?.otp} highlight />
                                <Details title="Consultation Fees" value={`₹${getConsultaionFees()}`} />
                                {getDiscount() !== 0 && <Details title="Discount" value={`₹${getDiscount()}`} />}
                                {getDueAmount() !== 0 && <Details title="Due Amount" value={`₹${getDueAmount()}`} />}
                                <Details title="Amount Paid" value={`₹${getAmountPaid()}`} />
                                {isExpanded && (
                                    <Animated.View entering={FadeInDown.springify()} exiting={FadeOutDown}>
                                        <Details title="Payment Id" value={data?.body?.razorpay_payment_id} />
                                    </Animated.View>
                                )}

                                <AnimatedTouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: wp(2),
                                        marginTop: hp(1),
                                        alignSelf: 'center',
                                    }}
                                    onPress={() => setIsExpanded(prev => !prev)}
                                    layout={LinearTransition}
                                >
                                    <Text
                                        style={{
                                            color: colors.darkBlue,
                                            fontSize: isTab ? wp(2) : wp(3.5),
                                        }}
                                    >
                                        {isExpanded ? 'Collapse' : 'Expand'}
                                    </Text>
                                    <FontAwesome5Icon
                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={isTab ? wp(3) : wp(5)}
                                        color={colors.darkBlue}
                                    />
                                </AnimatedTouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Appointment Details Section */}
                        <Animated.View style={styles.detailCard} layout={LinearTransition}>
                            <Text style={[styles.headerText, { marginVertical: hp(0.3) }]}>Patient Info.</Text>
                            <View style={{ gap: isTab ? wp(1) : wp(1.5), marginTop: hp(1) }}>
                                <Details
                                    title="Full Name"
                                    value={getName(
                                        // data?.patientDetails?.prefix ?? "",
                                        data?.patientDetails?.firstName ?? "",
                                        data?.patientDetails?.middleName ?? "",
                                        // data?.patientDetails?.lastName
                                        data?.patientDetails?.lastName ?? "",
                                    )}
                                />
                                <Details title="Gender" value={data?.patientDetails?.gender ?? "_"} />
                                <Details title="Age" value={data?.patientDetails?.dob} />
                                <Details title="HRU ID" value={data?.patientDetails?.hruId} />
                            </View>
                        </Animated.View>

                        {isCancelled(data?.statusTxt) && (
                            <Animated.Text
                                style={{
                                    color: 'red',
                                    textAlign: 'center',
                                    fontSize: isTab ? wp(2) : wp(3.2),
                                }}
                                layout={LinearTransition}
                            >
                                **Please carry your photo identification proof during this appointment visit.
                            </Animated.Text>
                        )}

                        <Animated.View style={{ alignSelf: 'center', marginVertical: hp(2) }} layout={LinearTransition}>
                            <QRCode value={data?.otp} backgroundColor="transparent" />
                        </Animated.View>
                    </ScrollView>
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.buttonContainer}>
                            {/* <BigButton
                                customIcon={
                                    <MaterialCommunityIcon
                                        name="file-download-outline"
                                        size={wp(6)}
                                        color={colors.white}
                                    />
                                }
                                onPress={appointmentDetailsDownload}
                                customStyle={{
                                    width: wp(20),
                                    paddingVertical: hp(1.5),
                                }}
                            /> */}
                            {data?.statusTxt === 'Completed' && (
                                <>
                                    {data?.dispute ? (
                                        <BigButton
                                            title="View Dispute"
                                            onPress={() => viewDisputeOperation(data?.dispute?.disputeId)}
                                            customStyle={{
                                                width: wp(40),
                                                marginTop: hp(1),
                                            }}
                                            customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(4) }}
                                            loading={loading}
                                        />
                                    ) : (
                                        <RaiseDisputeModal data={data} id={id} />
                                    )}
                                    <ProviderRatingModal id={id} data={data} />
                                </>
                            )}

                            {data?.startTimeInMs > data?.todayInMs && !(data?.isCheckedIn || data?.cancelCheckIn || data?.noShow) && (
                                <BigButton
                                    title="Reschedule"
                                    onPress={rescheduleAppointment}
                                    customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(4) }}
                                    customStyle={{
                                        width: wp(40),
                                        marginTop: hp(1),
                                    }}
                                    loading={rescheduleLoading}
                                />
                            )}
                            {!data?.isCheckedIn && !data?.noShow && !data?.cancelCheckIn && (
                                <BigButton
                                    title="Cancel"
                                    customStyle={{
                                        width: wp(40),
                                        marginTop: hp(1),
                                    }}
                                    onPress={() => {
                                        cancelAppointment(data);
                                    }}
                                    customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(4) }}
                                />
                            )}
                        </View>
                    </View>

                    {!isAtEnd && (
                        <AnimatedTouchableOpacity
                            onPress={handleScrollToEnd}
                            style={styles.floatingButtonContainer}
                            entering={ZoomIn.duration(100)}
                            exiting={ZoomOut.duration(100)}
                            layout={LinearTransition}
                        >
                            <MaterialCommunityIcon name="chevron-down" size={isTab ? wp(6) : wp(8)} color={colors.white} />
                        </AnimatedTouchableOpacity>
                    )}
                </>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: hp(1),
        paddingHorizontal: wp(3),
        flexGrow: 1,
        gap: hp(1.5),
        paddingBottom: hp(2),
    },
    profileContainer: {
        // backgroundColor: colors.white,
        borderRadius: wp(3),
        paddingHorizontal: isTab ? wp(1.5) : wp(3),
        paddingVertical: isTab ? wp(2) : wp(3),
        // marginHorizontal: hp(3),
        elevation: 2,
        // marginHorizontal: wp(1),
        backgroundColor: colors.white,
        shadowColor: 'blue',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    detailCard: {
        backgroundColor: colors.white,
        paddingHorizontal: wp(3),
        paddingVertical: isTab ? hp(1) : hp(1.5),
        borderRadius: wp(3),
        elevation: 2,
        // marginBottom: hp(1.2),
    },
    headerText: {
        fontSize: isTab ? wp(3) : wp(4.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
    logo: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
        tintColor: colors.primary,
    },
    floatingButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: hp(10),
        right: wp(4),
        height: isTab ? wp(10) : wp(12),
        width: isTab ? wp(10) : wp(12),
        borderRadius: wp(6),
        backgroundColor: colors.primary,
    },
});
