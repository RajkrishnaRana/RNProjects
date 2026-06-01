import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {isTab} from '../../utils/isTab';
import StarRating from '../StarRating';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isIos} from '../../utils/platform';
import {getName} from '../../utils';
import useClinicDoctorCard from '../../hooks/Clinic/useClinicDoctorCard';
import Animated, {FadeInDown, LinearTransition} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
    data: any;
    id: string;
}

export default function ClinicDoctorCard({data, id}: Props) {
    const {totalRating, doctorRatingDetails, isLoading, nextAvailability, navLoading, navigateToBooking} = useClinicDoctorCard(data, id);

    return (
        <AnimatedTouchableOpacity style={styles.container} onPress={navigateToBooking} layout={LinearTransition}>
            <View style={styles.specialDoctorCardContainer}>
                <View style={styles.imgContainer}>
                    <Image
                        source={data?.doctorProfileImgPath ? {uri: data?.doctorProfileImgPath} : require('../../assets/icons/user.png')}
                        style={{
                            height: isTab ? wp(8) : wp(16),
                            width: isTab ? wp(8) : wp(16),
                            borderRadius: hp(9),
                        }}
                    />
                </View>

                {/* Video consultation button */}
                {data?.addresses?.[0]?.acceptVirtualConsultation && (
                    <View style={styles.videoConsultationContainer}>
                        <MaterialCommunityIcons name="video" color={colors.darkBlue} size={isTab ? wp(2) : wp(3)} />
                    </View>
                )}

                <View style={{gap: isTab ? wp(0.5) : wp(1)}}>
                    <Text style={styles.text}>Dr. {getName(data?.firstName, data?.middleName, data?.lastName)}</Text>
                    <View style={styles.detailContainer}>
                        <Text style={styles.subText}>
                            {data?.specialities?.join(', ').length > 35
                                ? data?.specialities?.join(', ').substring(0, 35) + '...'
                                : data?.specialities?.join(', ') || 'No Speciality'}
                        </Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.ratingNumber}>
                                {doctorRatingDetails?.length ? (Number(totalRating) / doctorRatingDetails.length).toFixed(1) : '0.0'}
                            </Text>
                            <StarRating rating={Number(totalRating) / doctorRatingDetails.length || 0} />
                            <Text style={{fontSize: isTab ? wp(2) : wp(3.2), color: colors.black}}>
                                ({doctorRatingDetails?.length ? doctorRatingDetails?.length + ' Feedback' : 'No Feedback'})
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{height: isTab ? hp(0) : hp(1)}} />

            {isLoading ? (
                <ActivityIndicator color={colors.primary} size={isTab ? wp(3) : wp(6)} />
            ) : (
                <Animated.View entering={FadeInDown}>
                    <View style={styles.addressContainer}>
                        <Text style={styles.nextAvailability}>
                            Availablity : {nextAvailability ? <Text style={styles.nextAvailabilityValue}>{nextAvailability}</Text> : 'Not Available'}
                        </Text>

                        <Animated.View style={[styles.bookNowButtonContainer, {marginTop: isTab ? hp(0.5) : hp(1)}]} layout={LinearTransition}>
                            {navLoading ? (
                                <ActivityIndicator color={colors.white} size={isTab ? wp(2) : wp(4)} style={{width: isTab ? wp(8) : wp(14)}} />
                            ) : (
                                <Text style={styles.button}>Book Now</Text>
                            )}
                        </Animated.View>
                    </View>
                </Animated.View>
            )}
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: isTab ? wp(2) : wp(5),
        padding: isTab ? wp(1.5) : wp(3),
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
        top: isTab ? hp(3.5) : hp(6),
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
        maxWidth: wp(68),
    },
    detailContainer: {width: wp(70), gap: isTab ? wp(0.5) : wp(1), flexDirection: isTab ? 'row' : 'column'},
    nextAvailability: {
        fontSize: isTab ? wp(2) : wp(3.2),
        color: colors.darkGrey,
        marginBottom: isTab ? 0 : hp(0.5),
        marginTop: isTab ? hp(0.5) : hp(1),
    },
    nextAvailabilityValue: {color: colors.black, fontWeight: 'bold'},
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookNowButtonContainer: {
        backgroundColor: colors.primary,
        paddingVertical: isTab ? wp(0.5) : wp(1),
        borderTopStartRadius: isIos() ? wp(1) : wp(5),
        borderBottomStartRadius: isIos() ? wp(1) : wp(5),
        paddingLeft: isTab ? wp(6) : wp(8),
        paddingRight: wp(3),
        marginRight: wp(-3),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isTab ? 0 : hp(0.5),
        gap: isTab ? wp(1.5) : wp(2),
        marginLeft: isTab ? wp(3) : 0,
    },
    ratingNumber: {
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
    button: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: isTab ? wp(2) : wp(3.5),
    },
});
