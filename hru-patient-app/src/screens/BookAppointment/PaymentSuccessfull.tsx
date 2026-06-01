import { BackHandler, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import Breakline from '../../components/Breakline';
import BigButton from '../../components/BigButton';
import { useNavigation } from '../../hooks/useNavigation';
import { useBookAppointmentStore } from '../../store/bookAppointmentStore';
import { useBookingInformation } from '../../store/bookingInformation';
import { getName } from '../../utils';
import moment from 'moment';
import { queryClient } from '../../../App';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { isTab } from '../../utils/isTab';

type PaymentSuccessfullRouteProp = RouteProp<RootStackParamList, 'PaymentSuccessfull'>;

interface detailProps {
    imgSrc: ImageSourcePropType;
    title: string | undefined;
}

function Detail({ imgSrc, title }: detailProps) {
    return (
        <View style={styles.childContainer}>
            <Image source={imgSrc} style={{ height: isTab ? wp(3) : wp(5), width: isTab ? wp(3) : wp(5) }} tintColor={colors.primary} />
            <Text style={{ color: colors.lightBlack }}>{title}</Text>
        </View>
    );
}

export default function PaymentSuccessfull() {
    const navigation = useNavigation();
    const { type } = useRoute<PaymentSuccessfullRouteProp>().params;

    //GLOBAL STATES ------------------------------->
    const doctorDetails = useBookAppointmentStore(s => s.doctorDetails);
    const { bookingInfo, paymentInfo } = useBookingInformation();

    useEffect(() => {
        const handleBackPress = () => {
            // Navigate to the home page
            queryClient.invalidateQueries({
                queryKey: ['appointmentData'],
            });
            navigation.navigate('Home', { screen: 'DASHBOARD' }); // Replace 'Home' with your home page route name
            return true; // Prevent default back button behavior
        };

        // Add the back button listener
        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup the listener on component unmount
        return () => {
            subscription.remove();
        };
    }, [navigation]);

    console.log({ bookingInfo, paymentInfo });

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <LottieView
                    source={require('../../assets/LottieFiles/paymentSuccess.json')}
                    style={[{ height: isTab ? wp(20) : wp(40), width: isTab ? wp(20) : wp(40) }, styles.lottie]}
                    autoPlay={true}
                    loop={false}
                />
                <Text style={styles.title}>Booking Successful !</Text>

                <View style={{ marginTop: hp(3) }}>
                    <Text style={styles.subTitle}>You have successfully booked appointment with</Text>
                    <Text style={styles.details}>
                        {type === 'lab'
                            ? `${bookingInfo?.data?.responseData?.cartData?.[0]?.labDetails?.labName}`
                            : getName(doctorDetails?.firstName, doctorDetails?.middleName, doctorDetails?.lastName, doctorDetails?.doctorType)}
                    </Text>
                </View>

                <Breakline />

                <View style={styles.detailContainer}>
                    <Detail
                        imgSrc={require('../../assets/icons/patients.png')}
                        title={type === 'lab' ? bookingInfo?.name?.name : bookingInfo?.patientName}
                    />
                    <Detail imgSrc={require('../../assets/icons/rupee-symbol.png')} title={`₹${paymentInfo?.txnValue}`} />
                </View>

                <View style={styles.row}>
                    <Detail imgSrc={require('../../assets/icons/calendar.png')} title={moment(bookingInfo?.startTime).format('MMM D, YYYY')} />
                    <Detail imgSrc={require('../../assets/icons/time.png')} title={moment(bookingInfo?.startTime).format('hh:mm A')} />
                </View>
            </View>
            <View style={{ paddingHorizontal: wp(3), paddingBottom: hp(1.5) }}>
                {/* <BigButton
                    title="Appointment Details"
                    onPress={() => navigation.navigate('APPOINTMENTS')}
                    customStyle={{marginTop: 0}}
                /> */}
                <BigButton
                    title="Go to Appointments"
                    onPress={() => {
                        queryClient.invalidateQueries({
                            queryKey: ['appointmentData'],
                        });
                        navigation.navigate('Home', { screen: type === 'lab' ? 'LAB APPOINTMENTS' : 'APPOINTMENTS' });
                    }}
                    customStyle={{ marginTop: hp(2) }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    childContainer: { flexDirection: 'row', gap: wp(3), width: wp(40) },
    container: { flex: 1, backgroundColor: colors.white },
    bodyContainer: { flex: 1, paddingHorizontal: wp(3), marginTop: hp(15) },
    lottie: { alignSelf: 'center' },
    title: {
        fontSize: isTab ? wp(3) : wp(6),
        fontWeight: 'bold',
        color: colors.green,
        textAlign: 'center',
    },
    subTitle: {
        color: colors.darkGrey,
        textAlign: 'center',
        fontSize: isTab ? wp(2.5) : wp(3.5),
    },
    details: {
        color: colors.darkBlue,
        textAlign: 'center',
        fontSize: isTab ? wp(3) : wp(4.5),
        fontWeight: 'bold',
        marginTop: hp(0.5),
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: hp(1),
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
