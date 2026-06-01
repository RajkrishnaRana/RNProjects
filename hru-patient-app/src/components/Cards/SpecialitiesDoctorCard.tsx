import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getName } from '../../utils';
import IconText from '../IconText';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { BASE_URL } from '../../config';
import { postData } from '../../api';
import Toast from 'react-native-simple-toast';
import { isIos } from '../../utils/platform';
import StarRating from '../StarRating';
import { isTab } from '../../utils/isTab';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function SpecialitiesDoctorCard({
    data,
    specialityScreen = false,
    topRatedViewAllScreen = false,
}: {
    data: any;
    specialityScreen?: boolean;
    topRatedViewAllScreen?: boolean;
}) {
    const navigation = useNavigation();

    // LOCAL STATES ------------------------------>
    const [isLoading, setIsLoading] = useState(true);
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

    const getDoctorRating = (ratingdetails: any) => {
        const { totalRating, patientCount } = ratingdetails.reduce(
            (acc: any, { patientRatingToDoctor }: any) => {
                if (patientRatingToDoctor !== undefined) {
                    acc.totalRating += patientRatingToDoctor;
                    acc.patientCount += 1;
                }
                return acc;
            },
            { totalRating: 0, patientCount: 0 },
        );

        return patientCount > 0 ? Math.round(totalRating / patientCount) : 0;
    };

    // Watch for changes in slot data
    useEffect(() => {
        const slotTimeObj = data?.addresses?.[0]?.sloatTimeObj;
        console.log({ slotTimeObj });
        if (slotTimeObj) {
            const availability = nextAvailabilityDay(slotTimeObj);
            setNextAvailability(availability || null);
        } else {
            setNextAvailability(null);
        }
    }, [data?.addresses, isLoading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setNextAvailability(null); // Reset availability

                const clinicIds = data?.addresses?.map((address: any) => address.id);
                // console.log('clinicIds', clinicIds);

                // Called the API for getting the timings
                const url = `${BASE_URL}/patient/get-doctor-appointment-slots-v3.json`;
                console.log({ url, doctorId: data?._id, clinicIds });
                // const url = `https://76bae456e0d8.ngrok-free.app/patient/get-doctor-appointment-slots-v3.json`;
                const res = await postData(url, { doctorId: data?._id, clinicIds: clinicIds });
                if (!res.status) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                console.log('SpecialitiesDoctorResInternal', res);

                // Processing the data
                const days = [];
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                for (let loop = 0; loop < res.docs.length; loop++) {
                    const ref = res.docs[loop];
                    const addressPos = data?.addressPosMap?.[ref?.addressId];
                    if (addressPos == null) {
                        continue;
                    }
                    const clinicAddressRef = data.addresses[addressPos];
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
                    data.availableDays = days;
                }

                data?.addresses?.sort((a: any, b: any) => a.distance - b.distance);
            } catch (error) {
                console.error(error);
                setNextAvailability(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data]);

    return (
        <AnimatedTouchableOpacity
            layout={LinearTransition}
            onPress={() => navigation.push('DoctorProfile', { id: data?._id })}
            style={styles.mainContainer}
        >
            <View style={styles.specialDoctorCardContainer}>
                <View style={styles.imgContainer}>
                    <Image
                        source={data?.doctorProfileImgPath ? { uri: data?.doctorProfileImgPath } : require('../../assets/icons/user.png')}
                        style={{
                            height: isTab ? wp(8) : wp(16),
                            width: isTab ? wp(8) : wp(16),
                            borderRadius: hp(9),
                        }}
                    />
                </View>
                {data?.addresses?.[0]?.acceptVirtualConsultation && (
                    <View style={styles.videoConsultationContainer}>
                        <MaterialCommunityIcons name="video" color={colors.darkBlue} size={isTab ? wp(2) : wp(3)} />
                    </View>
                )}

                <View style={{ gap: isTab ? wp(0.5) : wp(1), marginTop: hp(1) }}>
                    <Text style={styles.text}>Dr. {specialityScreen ? getName(data?.firstName, data?.middleName, data?.lastName) : data?.name}</Text>
                    <View style={{ width: wp(70), gap: isTab ? wp(0.5) : wp(1) }}>
                        <>
                            <Text style={styles.subText}>
                                {data?.specialities?.join(', ').length > 35
                                    ? data?.specialities?.join(', ').substring(0, 35) + '...'
                                    : data?.specialities?.join(', ') || 'No Speciality'}
                            </Text>
                            {specialityScreen ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: isTab ? wp(1) : wp(2),
                                        alignItems: 'center',
                                    }}
                                >
                                    <View style={styles.starsContainer}>
                                        <AntDesignIcon name="star" size={isTab ? wp(2) : wp(4.5)} color={colors.yellow} />
                                        <Text
                                            style={{
                                                color: colors.black,
                                                fontWeight: 'bold',
                                                fontSize: isTab ? wp(2) : wp(3.5),
                                            }}
                                        >
                                            {data?.doctorRatingDetails ? getDoctorRating(data?.doctorRatingDetails) : '0'}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: isTab ? wp(2) : wp(3.2), color: colors.black }}>
                                        ({data?.totalFeedback ? data?.totalFeedback + ' Feedback' : 'No Feedback'})
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.ratingRow}>
                                    <Text style={styles.ratingNumber}>{data?.patientRatingToDoctor}.0</Text>
                                    <StarRating rating={data?.patientRatingToDoctor} />
                                    <Text style={{ fontSize: isTab ? wp(2) : wp(3.2), color: colors.black }}>
                                        ({data?.totalFeedback ? data?.totalFeedback + ' Feedback' : 'No Feedback'})
                                    </Text>
                                </View>
                            )}
                        </>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator color={colors.primary} size={isTab ? wp(3) : wp(6)} />
            ) : (
                <Animated.View entering={FadeInDown}>
                    {(specialityScreen || topRatedViewAllScreen) && nextAvailability && (
                        <Text
                            style={{
                                fontSize: isTab ? wp(2) : wp(3.5),
                                color: colors.darkGrey,
                                marginBottom: isTab ? 0 : hp(0.5),
                                marginTop: isTab ? hp(0.5) : hp(1),
                            }}
                        >
                            Next Availablity : <Text style={{ color: colors.black, fontWeight: 'bold' }}>{nextAvailability}</Text>
                        </Text>
                    )}

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: isTab ? 0 : specialityScreen ? hp(0.5) : hp(0),
                            // backgroundColor: 'red',
                        }}
                    >
                        {data?.addresses?.[0]?.locationAddress ? (
                            <IconText
                                index={3}
                                text={
                                    data?.addresses?.[0]?.locationAddress?.length > (isTab ? 70 : 25)
                                        ? data?.addresses?.[0]?.locationAddress?.substring(0, isTab ? 70 : 25) + '...'
                                        : data?.addresses?.[0]?.locationAddress
                                }
                                customLogoStyles={{
                                    tintColor: colors.grey,
                                    height: isTab ? wp(2) : wp(4),
                                    width: isTab ? wp(1.5) : wp(3),
                                }}
                                customStyles={{ gap: 0, marginBottom: hp(0.7) }}
                                customTextStyles={{ color: colors.darkGrey, fontSize: isTab ? wp(2) : wp(3.5) }}
                            />
                        ) : (
                            <View />
                        )}

                        <View style={[styles.bookNowButtonContainer, !specialityScreen && { marginTop: isTab ? hp(0.5) : hp(1) }]}>
                            <Text
                                style={{
                                    color: colors.white,
                                    fontWeight: 'bold',
                                    fontSize: isTab ? wp(2) : wp(3.5),
                                }}
                            >
                                Book Now
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            )}
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: isTab ? hp(0.5) : hp(1),
        marginBottom: hp(0.5),
        paddingVertical: wp(2),
        paddingHorizontal: wp(3),
        borderRadius: wp(4),
        borderWidth: wp(0.001),
        borderColor: colors.grey,
        backgroundColor: colors.white,
        elevation: 2,
        marginHorizontal: wp(3),
        // width: wp(80),

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,

        // Shadow for Android
        // elevation: 1,
    },
    specialDoctorCardContainer: {
        flexDirection: 'row',
        gap: isTab ? wp(2) : wp(4),
        alignItems: 'center',
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
        top: isTab ? hp(4.5) : hp(5.5),
        elevation: 2,
        borderWidth: wp(0.001),
    },
    text: {
        color: colors.black,
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
    },
    subText: {
        color: colors.darkGrey,
        fontSize: isTab ? wp(1.8) : wp(3),
        width: wp(68),
    },
    starsContainer: {
        // backgroundColor: colors.primary,
        borderRadius: wp(2),
        paddingVertical: isTab ? wp(0.5) : wp(1),
        // paddingHorizontal: wp(2),
        flexDirection: 'row',
        gap: isTab ? wp(0.5) : wp(2),
        alignItems: 'center',
    },
    bookNowButtonContainer: {
        backgroundColor: colors.primary,
        paddingVertical: isTab ? wp(0.5) : wp(1),
        borderTopStartRadius: isIos() ? wp(1) : wp(5),
        borderBottomStartRadius: isIos() ? wp(1) : wp(5),
        marginBottom: isTab ? 0 : hp(0.5),
        paddingLeft: isTab ? wp(6) : wp(8),
        paddingRight: wp(3),
        marginRight: wp(-3),
        // marginTop: hp(0.5),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isTab ? hp(0.3) : hp(0.5),
        gap: isTab ? wp(1.5) : wp(2),
    },
    ratingNumber: {
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
});
