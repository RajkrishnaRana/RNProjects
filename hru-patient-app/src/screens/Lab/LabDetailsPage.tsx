import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import BackgroundGradient from '../../components/BackgroundGradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {imageSelector} from '../../utils';
import IconText from '../../components/IconText';
import StarRating from '../../components/StarRating';
import {postData} from '../../api';
import {useQuery} from '@tanstack/react-query';
import {BASE_URL} from '../../config';
import PageLoading from '../../components/LottieComponent/PageLoading';

type LabDetailsPageProp = RouteProp<RootStackParamList, 'LabDetails'>;

interface ScheduleObjectStrict {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    from: string; // Could be more specific like `${number}:${number} ${'AM' | 'PM'}`
    to: string; // Could be more specific like `${number}:${number} ${'AM' | 'PM'}`
    timePerSlot: number; // Duration in minutes
    patientPerSlot: number; // Number of patients per time slot
    uid: string; // UUID format
    savedAppointment: boolean;
}

const LabTimings = ({day, time}: {day: string; time: ScheduleObjectStrict[]}) => {
    const timings = time?.map((item: ScheduleObjectStrict) => {
        return `${item.from} - ${item.to}`;
    });
    const timingsString = timings.join(' && ');

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.colon}> : </Text>
            <Text style={styles.timingsText}>{timingsString}</Text>
        </View>
    );
};

export default function LabDetailsPage() {
    const {id} = useRoute<LabDetailsPageProp>().params;

    // DATA FETCHING --------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/labprofile`;
    const {isLoading, error, data} = useQuery({
        queryKey: ['labProfile' + id],
        queryFn: () => postData(url),
        select: data => {
            console.log('labProfile', data);
            return data?.doc?.labDetails;
        },
    });

    return (
        <BackgroundGradient>
            {isLoading ? (
                <PageLoading />
            ) : error ? (
                <Text>Something went wrong</Text>
            ) : (
                <View style={styles.container}>
                    {/* Heading Section */}
                    <View style={styles.headingContainer}>
                        <Image source={imageSelector(data?.labProfileImgPath, 'DOCTOR')} style={styles.labCardImg} />

                        <View style={{paddingHorizontal: wp(3)}}>
                            <Text style={styles.labName}>{data?.labName}</Text>
                            <IconText index={2} text={`HRU ID : ${data?.hruId}`} customTextStyles={{fontSize: wp(3.3)}} />
                            <IconText index={4} text={`${data?.mobileNumber}`} customTextStyles={{fontSize: wp(3.3)}} />
                            <IconText index={13} text={data?.email} customTextStyles={{fontSize: wp(3.3)}} />
                            <IconText
                                text={`License No. : ${data?.licence[0]?.licenceNumber}`}
                                customTextStyles={{fontSize: wp(3.5), fontWeight: '600'}}
                            />
                            {/* Ratings and Reviews */}
                            <View style={{flexDirection: 'row', gap: wp(2), alignItems: 'center'}}>
                                <View style={styles.starsContainer}>
                                    <StarRating rating={data?.ratingDetails?.patientRatingToLab || 0} />
                                    <Text
                                        style={{
                                            color: colors.black,
                                            fontWeight: 'bold',
                                            fontSize: wp(3.5),
                                        }}>
                                        {data?.ratingDetails?.patientRatingToLab || '0'}.0
                                    </Text>
                                </View>
                                <Text style={{fontSize: wp(3.2), color: colors.black}}>
                                    ({data?.ratingDetails?.remarksCount || '0' + ' Feedback'})
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Timing Details */}
                    <View style={{marginVertical: hp(1)}}>
                        <Text style={styles.timingHeader}>Timing Details : </Text>

                        {data?.appointmentDates?.sunday?.length > 0 && <LabTimings day="Sunday" time={data?.appointmentDates['sunday']} />}
                        {data?.appointmentDates?.monday?.length > 0 && <LabTimings day="Monday" time={data?.appointmentDates['monday']} />}
                        {data?.appointmentDates?.tuesday?.length > 0 && <LabTimings day="Tuesday" time={data?.appointmentDates['tuesday']} />}
                        {data?.appointmentDates?.wednesday?.length > 0 && <LabTimings day="Wednesday" time={data?.appointmentDates['wednesday']} />}
                        {data?.appointmentDates?.thursday?.length > 0 && <LabTimings day="Thursday" time={data?.appointmentDates['thursday']} />}
                        {data?.appointmentDates?.friday?.length > 0 && <LabTimings day="Friday" time={data?.appointmentDates['friday']} />}
                        {data?.appointmentDates?.saturday?.length > 0 && <LabTimings day="Saturday" time={data?.appointmentDates['saturday']} />}
                    </View>

                    {/* Location address */}
                    <View style={{marginVertical: hp(1)}}>
                        <Text style={styles.timingHeader}>Location Details : </Text>

                        <IconText index={3} text={data?.address?.locationAddress} customTextStyles={{fontSize: wp(3.3), width: wp(85)}} />
                        <IconText
                            index={14}
                            boldText={`₹${data?.pickupCharges}`}
                            text={` (Pick up charges up to ${data?.pickAvailableUpto} km)`}
                            customTextStyles={{fontSize: wp(3.3), width: wp(85)}}
                        />
                        <IconText
                            index={15}
                            boldText={`₹${data?.smplCollectinChrges}`}
                            text={` (Home Collection Charge Free above ₹1000)`}
                            customTextStyles={{fontSize: wp(3.3), width: wp(85)}}
                        />
                    </View>
                </View>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        borderWidth: wp(0.001),
        backgroundColor: colors.white,
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headingContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    labName: {
        fontSize: wp(4.5),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    labCardImg: {
        height: wp(25),
        width: wp(25),
        borderRadius: wp(20),
    },
    starsContainer: {
        borderRadius: wp(2),
        paddingVertical: wp(1),
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
    },
    timingHeader: {
        fontSize: wp(4),
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    dayText: {
        fontSize: wp(3),
        color: colors.lightBlack,
        width: wp(18),
    },
    colon: {
        fontSize: wp(3.2),
        color: colors.lightBlack,
        marginHorizontal: wp(2),
    },
    timingsText: {
        fontSize: wp(3),
        color: colors.lightBlack,
        fontWeight: 'bold',
        width: wp(60),
    },
});
