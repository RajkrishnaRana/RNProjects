import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { imageSelector } from '../../utils';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from '../../common/colors';
import IconText from '../IconText';
import { postData } from '../../api';
import { BASE_URL } from '../../config';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isTab } from '../../utils/isTab';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = Math.min(300, width * 0.8);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DashboardDoctorCard({ item }: { item: any }) {
    const navigation = useNavigation();

    // LOCAL STATES ------------------------------>
    const [isLoading, setIsLoading] = useState(false);
    const [nextAvailability, setNextAvailability] = useState<string | null>(null);

    // console.log('topratedDoctor', item);
    // LOCAL FUNCTIONS -------------------------->
    const nextAvailabilityDay = (slotTimeObj: any) => {
        console.log({ slotTimeObj });

        // Early return if slotTimeObj is not available or doesn't have required properties
        if (!slotTimeObj || !slotTimeObj.timings || !Array.isArray(slotTimeObj.timings) || slotTimeObj.timings.length === 0) {
            return undefined;
        }

        // Additional validation for displayH and first timing
        if (!slotTimeObj.displayH || !slotTimeObj.timings[0]?.display) {
            return undefined;
        }

        // Get today and tomorrow
        const today = moment();
        const tomorrow = moment().add(1, 'day');

        // Get day names
        const todayName = today.format('dddd'); // e.g., "Monday"
        const tomorrowName = tomorrow.format('dddd'); // e.g., "Tuesday"

        let dayName = '';
        if (slotTimeObj?.displayH === todayName) {
            dayName = 'Today';
        } else if (slotTimeObj?.displayH === tomorrowName) {
            dayName = 'Tomorrow';
        } else {
            dayName = slotTimeObj?.displayH;
        }

        // const selectedTiming = slotTimeObj?.timings?.find((timing: any) => {
        //     const lowTime = timing.id.split('_')[0];
        //     const highTime = timing.id.split('_')[1];
        //     return today.valueOf() >= Number(lowTime) && today.valueOf() < Number(highTime);
        // });

        return `${dayName} at ${slotTimeObj?.timings[0]?.display}`;
    };

    // Watch for changes in slot data
    useEffect(() => {
        const slotTimeObj = item?.addresses?.[0]?.sloatTimeObj;
        if (slotTimeObj) {
            const availability = nextAvailabilityDay(slotTimeObj);
            setNextAvailability(availability || null);
        } else {
            setNextAvailability(null);
        }
    }, [isLoading, item?.addresses]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setNextAvailability(null); // Reset availability

                const clinicIds = item?.addresses?.map((address: any) => address.id);
                // console.log('clinicIds', clinicIds);

                // Called the API for getting the timings
                const url = `${BASE_URL}/patient/get-doctor-appointment-slots-v3.json`;
                const res = await postData(url, { doctorId: item?._id, clinicIds: clinicIds });
                if (!res.status) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                // Processing the data
                const days = [];
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                for (let loop = 0; loop < res.docs.length; loop++) {
                    const ref = res.docs[loop];
                    const addressPos = item.addressPosMap[ref.addressId];
                    if (addressPos == null) {
                        continue;
                    }
                    const clinicAddressRef = item.addresses[addressPos];
                    clinicAddressRef.days = [ref.day];
                    let flag = 1;
                    while (flag <= 2) {
                        const id = Number(clinicAddressRef.days[0].id) + flag * 24 * 60 * 60 * 1000;
                        const display = moment(new Date(id)).format('Do, MMM YYYY');
                        const dayNo = new Date(id).getDay();
                        const displayH = daysOfWeek[new Date(id).getDay()];
                        clinicAddressRef.days.push({ id: id, display: display, displayH: displayH, dayNo: dayNo });
                        flag++;
                    }
                    clinicAddressRef.sloatTimeObj = clinicAddressRef.days[0];
                    clinicAddressRef.slotDate = clinicAddressRef.days[0].display;
                    clinicAddressRef.slotDay = clinicAddressRef.days[0].displayH;
                    days.push(clinicAddressRef.days[0].displayH);
                }

                if (days.length > 0) {
                    item.availableDays = days;
                }

                item?.addresses.sort((a: any, b: any) => a.distance - b.distance);
            } catch (error) {
                console.error(error);
                setNextAvailability(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [item]);

    return (
        <AnimatedPressable
            android_ripple={{ radius: 200, color: colors.rippleBlack, foreground: true }}
            onPress={() => {
                navigation.push('DoctorProfile', { id: item?._id });
            }}
            style={styles.card}
            layout={LinearTransition}
        >
            <View style={styles.doctorInfoContainer}>
                <View style={styles.imgContainer}>
                    <Image source={imageSelector(item?.doctorProfileImgPath, 'DOCTOR')} style={styles.doctorImage} />
                </View>
                {item?.addresses[0]?.acceptVirtualConsultation && (
                    <View style={styles.videoConsultationContainer}>
                        <MaterialCommunityIcons name="video" color={colors.darkBlue} size={isTab ? wp(1.8) : wp(3)} />
                    </View>
                )}
                <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>Dr. {item?.name}</Text>
                    <Text style={styles.specialty}>
                        {item?.specialities?.join(', ').length > 20
                            ? item?.specialities?.join(', ').substring(0, 20) + '...'
                            : item?.specialities?.join(', ')}
                    </Text>

                    {/* Ratings and Reviews */}
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            <AntDesignIcon name="star" size={isTab ? wp(2.5) : wp(4.5)} color={colors.yellow} />
                            <Text style={styles.rating}>{item?.patientRatingToDoctor}</Text>
                        </View>
                        <Text style={{ fontSize: isTab ? wp(2) : wp(3.2), color: colors.black }}>({item?.totalFeedback + ' Feedback'})</Text>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator color={colors.primary} size={isTab ? wp(4) : wp(6)} />
            ) : (
                <Animated.View entering={FadeInDown.delay(200)}>
                    <IconText
                        index={3}
                        text={
                            item?.addresses[0]?.locationAddress?.length > (isTab ? 35 : 28)
                                ? item?.addresses[0]?.locationAddress?.substring(0, isTab ? 35 : 28) + '...'
                                : item?.addresses[0]?.locationAddress
                        }
                        customLogoStyles={{
                            tintColor: colors.grey,
                            height: isTab ? wp(2) : wp(4),
                            width: isTab ? wp(1.5) : wp(3),
                        }}
                        customTextStyles={{ color: colors.darkGrey, fontSize: isTab ? wp(2) : wp(3.5) }}
                    />

                    {nextAvailability && (
                        <Text style={styles.nextAvailabilityText}>
                            Next Availablity : <Text style={styles.nextAvl}>{nextAvailability}</Text>
                        </Text>
                    )}

                    <View style={styles.bookAppointmentbutton}>
                        <Text style={styles.bookAppointmentbuttonText}>Book Appointment</Text>
                    </View>
                </Animated.View>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: isTab ? wp(42) : cardWidth,
        backgroundColor: 'white',
        borderRadius: wp(3),
        padding: isTab ? wp(2) : wp(4),
        marginHorizontal: isTab ? wp(1) : wp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    doctorInfoContainer: {
        flexDirection: 'row',
        marginBottom: hp(1),
    },
    imgContainer: {
        backgroundColor: colors.blueWhite,
        width: isTab ? wp(9) : wp(18),
        height: isTab ? wp(9) : wp(18),
        borderRadius: wp(18),
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 2,
        alignSelf: 'center',
        marginRight: isTab ? wp(2) : wp(3),
        padding: wp(1.5),
        borderWidth: wp(0.15),
        borderColor: colors.darkBlue,
    },
    videoConsultationContainer: {
        backgroundColor: colors.blueWhite,
        width: isTab ? wp(3) : wp(5),
        height: isTab ? wp(3) : wp(5),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'center',
        left: isTab ? wp(6.5) : wp(13),
        top: isTab ? hp(4) : hp(6),
        elevation: 2,
        borderWidth: wp(0.001),
    },
    doctorImage: {
        height: isTab ? wp(8) : wp(16),
        width: isTab ? wp(8) : wp(16),
        borderRadius: wp(12),
    },
    doctorDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    doctorName: {
        fontSize: isTab ? wp(2.5) : wp(4.2),
        fontWeight: '600',
        color: '#333',
    },
    specialty: {
        fontSize: isTab ? wp(1.5) : wp(3),
        color: '#666',
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: isTab ? wp(1) : wp(2),
        alignItems: 'center',
        marginTop: isTab ? 0 : hp(0.5),
    },
    rating: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: isTab ? wp(2) : wp(3.5),
    },
    starsContainer: {
        borderRadius: wp(2),
        paddingVertical: isTab ? wp(0.5) : wp(1),
        flexDirection: 'row',
        gap: isTab ? wp(0.5) : wp(2),
        alignItems: 'center',
    },
    nextAvailabilityText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.darkGrey,
        marginVertical: hp(0.5),
    },
    nextAvl: { color: colors.black, fontWeight: 'bold' },
    bookAppointmentbutton: {
        backgroundColor: colors.primary,
        paddingVertical: isTab ? hp(0.5) : hp(1),
        borderRadius: wp(4),
        marginTop: isTab ? hp(1) : hp(1.5),
        width: isTab ? wp(30) : wp(40),
        alignItems: 'center',
        alignSelf: 'center',
    },
    bookAppointmentbuttonText: {
        color: colors.white,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
});
