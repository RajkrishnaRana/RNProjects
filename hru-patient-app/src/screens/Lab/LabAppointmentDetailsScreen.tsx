import {
    Alert,
    ColorValue,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import IconModal from '../../components/Modal/IconModal';
import BigButton from '../../components/BigButton';
import { downloadFile } from '../../utils/fileHelper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import RaiseDisputeModal from '../../components/Modal/RaiseDisputeModal';
import { queryClient } from '../../../App';
import ProviderRatingModal from '../../components/Modal/ProviderRatingModal';
import Details from '../../components/Details';
import { useBookAppointmentStore } from '../../store/bookAppointmentStore';
import Animated, { FlipInEasyX, ZoomIn, ZoomOut } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundGradient from '../../components/BackgroundGradient';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LabProfile from '../../components/Lab/LabProfile';

type AppointmentDetailScreenRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface DetailsProps {
    title: string;
    value: string;
    isRemote?: boolean;
}

function BreakLine() {
    return (
        <View
            style={{
                height: hp(0.1),
                backgroundColor: colors.white,
                marginVertical: hp(1),
            }}
        />
    );
}

export default function LabAppointmentDetailScreen() {
    const navigation = useNavigation();
    const { id } = useRoute<AppointmentDetailScreenRouteProp>().params;

    // GLOBAL STATES ----------------------------------->
    const { logout, token } = useAuthStore();
    const setDoctorDetails = useBookAppointmentStore(s => s.setDoctorDetails);

    // LOCAL STATES ----------------------------------->
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/patientlabappointmentdetails`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['LabAppointMentDetailsData' + id],
        queryFn: async () => {
            const response = await postData(url);
            if (response?.status === false) {
                throw new Error(response?.msg || 'Unknown error occurred');
            }
            return response;
        },
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            console.log('Lab Appointment Details api data ---->', data);
            return data?.doc;
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

    const handleLabProfilePress = () => {
        navigation.push('LabDetails', { id: data?.labDetails?._id });
        // navigation.getParent('DrawerNavigator').openDrawer();
    };

    const appointmentDetailsDownload = async () => {
        const url = `${BASE_URL}/patient/${data?._id}/lab-transaction-details.pdf`;
        // const url = `https://10b1946ccb0a.ngrok-free.app/patient/${data?._id}/lab-transaction-details.pdf`;
        const fileName = 'labAppointmentDetails.pdf';

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
            const url = `${BASE_URL}/hru/Patientappapi/cancellabappointmentbypatient`;
            const res = await postData(url, payload);

            console.log(res);

            if (!res.status) {
                throw new Error(res.msg);
            }

            // console.log('Data deleted successfully---------');
            Toast.show('Appointment cancelled successfully', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['labAppointmentData'],
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

    const isCancelled = (text: string) => {
        const isCancelled = new RegExp(`\\bCancelled\\b`, 'i');
        return !isCancelled.test(text);
    };

    const getDiscount = () => {
        if (data?.bookedBy == 'DOCTOR') {
            return data?.invoice?.services ? data?.invoice?.services[0]?.serviceDiscount : 0;
        }

        if (data?.bookedBy == 'PATIENT') {
            return data?.transactions?.[0]?.total - data?.transactions?.[0]?.amount;
        }

        return 0;
    };

    const getAmountPaid = () => {
        if (data?.bookedBy == 'DOCTOR') {
            return data?.invoice?.totalAmt ? data?.invoice?.totalAmt : 0;
        }

        if (data?.bookedBy == 'PATIENT' && data?.rzrpStatus != 'received') {
            return 0;
        }

        if (data?.bookedBy == 'PATIENT' && data?.rzrpStatus == 'received' && data?.transactions && data?.transactions[0]?.total) {
            return data?.transactions[0].amount;
        }

        return 0;
    };

    const getDueAmount = () => {
        if (data?.bookedBy == 'DOCTOR' && data?.invoice?.totalAmt == 0) {
            return 0;
        }

        if (data?.bookedBy == 'DOCTOR' && data?.invoice?.services && data?.invoice?.totalAmt > 0) {
            return data?.invoice.services[0].serviceCharges - data?.invoice.totalAmt;
        }

        if (data?.bookedBy == 'PATIENT' && data?.rzrpStatus != 'received') {
            return 0;
        }

        if (
            data?.bookedBy == 'PATIENT' &&
            data?.consultationFee &&
            !data?.isCharge &&
            data?.rzrpStatus == 'received' &&
            data?.transactions &&
            data?.transactions[0].total
        ) {
            return data?.consultationFee - data?.transactions[0].total;
        }

        if (
            data?.bookedBy == 'PATIENT' &&
            data?.consultationFee &&
            data?.isCharge &&
            data?.rzrpStatus == 'received' &&
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

    // SIDE EFFECTS -------------------------------------------->
    useEffect(() => {
        refetch();
    }, []);

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
                        <TouchableOpacity style={styles.profileContainer} onPress={handleLabProfilePress}>
                            <LabProfile data={data?.labDetails as LabInfo} />
                        </TouchableOpacity>

                        {/* Scheduled Appointment Section */}
                        <View style={styles.detailCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.headerText}>
                                    Appointment <Text style={{ color: colorDetector(data?.statusTxt) }}>({data?.statusTxt})</Text>
                                </Text>

                                <BigButton
                                    customIcon={<MaterialCommunityIcon name="file-download-outline" size={wp(6)} color={colors.primary} />}
                                    onPress={appointmentDetailsDownload}
                                    customStyle={{
                                        marginTop: 0,
                                        width: wp(12),
                                        backgroundColor: colors.white, //'rgba(29, 186, 181, 0.1)',
                                        borderRadius: wp(2),
                                    }}
                                />
                            </View>
                            <View style={{ gap: wp(1.5), marginTop: hp(1) }}>
                                <Details title="Date & Hour" value={moment(data?.startTime).format('MMMM DD, YYYY | hh:mm A')} />
                                <Details title="Booking Id" value={data?.bookingId} />
                                <Details title="Booking Confirmation No" value={data?.otp} highlight />
                                {getDiscount() !== 0 && <Details title="Discount" value={`₹${getDiscount()}`} />}
                                {getDueAmount() !== 0 && <Details title="Due Amount" value={`₹${getDueAmount()}`} />}
                                <Details title="Amount Paid" value={`₹${getAmountPaid()}`} />
                                {isExpanded && <Details title="Payment Id" value={data?.body?.razorpay_payment_id} />}

                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: wp(2),
                                        marginTop: hp(1),
                                        alignSelf: 'center',
                                    }}
                                    onPress={() => setIsExpanded(prev => !prev)}
                                >
                                    <Text style={{ color: colors.darkBlue }}>{isExpanded ? 'Collapse' : 'Expand'}</Text>
                                    <FontAwesome5Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={wp(5)} color={colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Appointment Details Section */}
                        <View style={styles.detailCard}>
                            <Text style={[styles.headerText, { marginVertical: hp(0.3) }]}>Patient Info.</Text>
                            <View style={{ gap: wp(1.5), marginTop: hp(1) }}>
                                <Details
                                    title="Full Name"
                                    value={getName(
                                        data?.patientDetails?.firstName,
                                        data?.patientDetails?.middleName,
                                        data?.patientDetails?.lastName,
                                        data?.patientDetails?.prefix,
                                    )}
                                />
                                <Details title="Gender" value="Male" />
                                <Details title="Age" value={data?.patientDetails?.dob} />
                                <Details title="HRU ID" value={data?.patientDetails?.hruId} />
                            </View>
                        </View>

                        {isCancelled(data?.statusTxt) && (
                            <Text style={{ color: 'red', textAlign: 'center', fontSize: wp(3.2) }}>
                                **Please carry your photo identification proof during this appointment visit.
                            </Text>
                        )}

                        <View style={{ alignSelf: 'center', marginVertical: hp(2) }}>
                            <QRCode value={data?.otp} backgroundColor="transparent" />
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.buttonContainer}>
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
                                            customTextStyle={{ fontSize: wp(4) }}
                                            loading={loading}
                                        />
                                    ) : (
                                        <RaiseDisputeModal data={data} id={id} />
                                    )}
                                    <ProviderRatingModal id={id} data={data} />
                                </>
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
                                    customTextStyle={{ fontSize: wp(4) }}
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
                        >
                            <MaterialCommunityIcon name="chevron-down" size={wp(8)} color={colors.white} />
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
        padding: wp(3),
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
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        elevation: 2,
        // marginBottom: hp(1.2),
    },
    headerText: {
        fontSize: wp(4.5),
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
        height: wp(12),
        width: wp(12),
        borderRadius: wp(6),
        backgroundColor: colors.primary,
    },
});
