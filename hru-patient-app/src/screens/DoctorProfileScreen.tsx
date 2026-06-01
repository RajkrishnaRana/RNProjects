import {Image, ImageProps, RefreshControl, ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import IconDetails from '../components/IconDetails';
import {useNavigation} from '../hooks/useNavigation';
import {tokenExpiredMsg} from '../utils';
import {BASE_URL} from '../config';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import {useAuthStore} from '../store/authStore';
import {RootStackParamList} from '../types/routeTypes';
import {RouteProp, useRoute} from '@react-navigation/native';
import ErrorComponent from '../components/ErrorComponent';
import PageLoading from '../components/LottieComponent/PageLoading';
import CustomRating from '../components/BookAppointmentComponents/CustomRating';
import useDoctorProfile from '../hooks/useDoctorProfile';
import {useBookAppointmentStore} from '../store/bookAppointmentStore';
import {FlashList} from '@shopify/flash-list';
import CliniqueCard from '../components/CliniqueCard';
import BackgroundGradient from '../components/BackgroundGradient';
import TabBarParent from '../components/TabBarParent';
import {queryClient} from '../../App';
import {isTab} from '../utils/isTab';

type DoctorProfileScreenRouteProp = RouteProp<RootStackParamList, 'DoctorProfile'>;

interface InfoDetailsProps {
    imgSrc: ImageProps;
    title: string;
    customTextStyle?: StyleProp<TextStyle>;
}

interface DrInfoDetailsProps {
    imgSrc: ImageProps;
    imgTitle: string;
    details: string;
}

// function BreakLine() {
//     return (
//         <View
//             style={{
//                 height: hp(0.1),
//                 backgroundColor: colors.grey,
//                 marginVertical: hp(2),
//             }}
//         />
//     );
// }

function InfoDetails({imgSrc, title, customTextStyle}: InfoDetailsProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                gap: wp(1),
                alignItems: 'center',
            }}>
            <Image source={imgSrc} style={{width: isTab ? wp(2.5) : wp(4), height: isTab ? wp(2.5) : wp(4)}} tintColor={colors.primary} />
            <Text
                style={[
                    {
                        color: colors.darkGrey,
                        fontSize: isTab ? wp(2) : wp(3.5),
                    },
                    customTextStyle,
                ]}>
                {title}
            </Text>
        </View>
    );
}

function DrInfoDetails({imgSrc, imgTitle, details}: DrInfoDetailsProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    gap: wp(3),
                    alignItems: 'center',
                    width: isTab ? wp(20) : wp(30),
                }}>
                <Image source={imgSrc} style={{width: isTab ? wp(2.5) : wp(4), height: isTab ? wp(3) : wp(4)}} tintColor={colors.primary} />
                <Text
                    style={{
                        color: colors.black,
                        fontSize: isTab ? wp(2) : wp(3.5),
                        // fontWeight: 'bold',
                    }}>
                    {imgTitle}
                </Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.detailText}>{details}</Text>
            </View>
        </View>
    );
}

export default function DoctorProfileScreen() {
    const navigation = useNavigation();
    const {id, key} = useRoute<DoctorProfileScreenRouteProp>().params;

    // GLOBAL STATES ----------------------------------->
    const logout = useAuthStore(state => state.logout);
    const setDoctorDetails = useBookAppointmentStore(s => s.setDoctorDetails);

    // LOCAL STATES ------------------------------->
    const [refreshing, setRefreshing] = React.useState(false);

    // DATA FETCHING -------------------------------->
    const url = key ? `${BASE_URL}/hru/Patientappapi/${id}/doctorprofile?key=${key}` : `${BASE_URL}/hru/Patientappapi/${id}/doctorprofile`;
    const {isPending, error, data} = useQuery({
        queryKey: ['doctorProfile' + id],
        queryFn: () => postData(url),
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            setDoctorDetails(data?.doc?.doctorDetails);
            console.log('DoctorProfile', data);
            return data.doc;
        },
    });

    const totalPatientUrl = `${BASE_URL}/hru/Patientappapi/gettotalpatientofdoctor`;
    const {data: totalPatientData} = useQuery({
        queryKey: ['totalPatient', id],
        queryFn: () => postData(totalPatientUrl, {doctorId: id}),
    });

    // CUSTOM HOOK CALLING FOR DATA EXTRACTING ----------------------->
    const {
        doctorProfileImg,
        drName,
        designation,
        drRating,
        totalYrsExperience,
        totalPatientsRating,
        totalReviews,
        totalPatientGiveRating,
        registration,
        certificates,
        awards,
        experiences,
        education,
        services,
        aboutDoctor,
        email,
        phone,
        address,
    } = useDoctorProfile(data);

    // LOCAL FUNCTIONS --------------------------------------------->
    const handleBookAppointment = () => navigation.push('Clinic', {id: id});

    //LOCAL FUNCTIONS ----------------------------------------->
    const renderItem = ({item}: {item: ClinicInfo}) => (
        <CliniqueCard item={item} responseData={data?.responseData} rescheduleAmount={data?.rescheduleAmount} />
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            queryKey: ['doctorProfile' + id],
        });
        setRefreshing(false);
    };

    return (
        <TabBarParent>
            <View style={{flex: 1}}>
                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <BackgroundGradient>
                        <ScrollView
                            contentContainerStyle={styles.container}
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                            {/* Doctor Profile Header */}
                            <View style={styles.doctorHeaderContainer}>
                                {/* Profile Picture */}
                                <View style={styles.imgContainer}>
                                    <Image
                                        source={doctorProfileImg}
                                        style={{
                                            height: isTab ? wp(9) : wp(18),
                                            width: isTab ? wp(9) : wp(18),
                                            borderRadius: wp(9),
                                        }}
                                    />
                                </View>

                                {/* Details */}
                                <View style={{gap: hp(0.3)}}>
                                    <Text style={styles.drName}>{drName}</Text>
                                    <Text style={styles.doctorHeaderDetails}>{designation}</Text>
                                    <View style={{flexDirection: 'row', gap: wp(1), alignItems: 'center'}}>
                                        <Text style={{fontSize: isTab ? wp(2.2) : wp(3.5), color: colors.black}}>{drRating.toFixed(1) || 0}</Text>
                                        <CustomRating prevRating={drRating} customStartSize={isTab ? wp(2.2) : wp(3.5)} />
                                        <Text
                                            style={{fontSize: isTab ? wp(2.2) : wp(3.5), color: colors.black}}>{`(${totalPatientGiveRating})`}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.detailsContainer}>
                                <IconDetails
                                    imgSrc={require('../assets/icons/patients.png')}
                                    highlightDetail={totalPatientData?.doc || 0}
                                    detail="Patients"
                                />
                                <IconDetails
                                    imgSrc={require('../assets/icons/experiences.png')}
                                    highlightDetail={`${totalYrsExperience}`}
                                    detail="Years Exp."
                                />
                                <IconDetails
                                    imgSrc={require('../assets/icons/location.png')}
                                    highlightDetail={`${data?.doctorDetails?.addresses?.length || 0}`}
                                    detail="Clinics"
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.push('PatientFeedback', {
                                            data: data?.patientFeedbacks,
                                        })
                                    }>
                                    <IconDetails
                                        imgSrc={require('../assets/icons/reviews.png')}
                                        highlightDetail={`${totalReviews}`}
                                        detail="Reviews"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{marginVertical: isTab ? hp(1) : hp(2)}}>
                                <Text style={[styles.header]}>Clinics Available : </Text>
                                <FlashList
                                    data={data?.doctorDetails?.addresses || ([] as ClinicInfo[])}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item?.id}
                                />
                            </View>

                            <View
                                style={{
                                    gap: isTab ? wp(1) : wp(2),
                                    backgroundColor: colors.white,
                                    paddingHorizontal: wp(3),
                                    borderRadius: wp(3),
                                    paddingVertical: isTab ? hp(1) : hp(1.5),
                                }}>
                                <Text style={styles.header}>Doctor Information : </Text>
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/stethoscope.png')}
                                    imgTitle="Registration : "
                                    details={registration || 'No registration data available'}
                                />
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/certificate.png')}
                                    imgTitle="Certificates : "
                                    details={certificates || 'No certificates data available'}
                                />
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/medal.png')}
                                    imgTitle="Awards : "
                                    details={awards || 'No awards data available'}
                                />
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/stethoscope.png')}
                                    imgTitle="Experiences : "
                                    details={experiences || 'No experiences data available'}
                                />
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/scholar.png')}
                                    imgTitle="Education : "
                                    details={education || 'No education data available'}
                                />
                                <DrInfoDetails
                                    imgSrc={require('../assets/icons/customer.png')}
                                    imgTitle="Services : "
                                    details={services || 'No services data available'}
                                />
                            </View>

                            <View
                                style={{
                                    backgroundColor: colors.white,
                                    borderRadius: wp(3),
                                    paddingHorizontal: wp(3),
                                    paddingVertical: isTab ? hp(1) : hp(1.5),
                                    marginVertical: isTab ? hp(1) : hp(1.5),
                                }}>
                                <Text style={styles.header}>About : </Text>
                                <Text
                                    style={{
                                        color: colors.darkGrey,
                                        fontSize: isTab ? wp(2) : wp(3.5),
                                    }}>
                                    {aboutDoctor || 'No data available'}
                                </Text>
                                <View style={styles.infoContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: isTab ? wp(5) : wp(4),
                                        }}>
                                        {email && <InfoDetails imgSrc={require('../assets/icons/email.png')} title={email} />}
                                        {phone && <InfoDetails imgSrc={require('../assets/icons/phone.png')} title={phone} />}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </BackgroundGradient>
                )}
            </View>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: wp(3),
        // marginTop: hp(1),
        paddingBottom: hp(1),
        // backgroundColor: colors.backgroundColor,
    },
    doctorHeaderContainer: {
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        marginVertical: isTab ? hp(1) : hp(1.5),
    },
    doctorHeaderDetails: {
        fontSize: isTab ? wp(1.8) : wp(3.5),
        color: colors.darkGrey,
        marginBottom: hp(0.5),
        width: isTab ? wp(75) : wp(70),
    },
    imgContainer: {
        // backgroundColor: colors.blueWhite,
        // width: wp(18),
        // height: wp(18),
        // borderRadius: wp(5),
        // borderWidth: wp(0.2),
        // borderColor: colors.darkBlue,
        alignItems: 'center',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    drName: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(2.5) : wp(4),
        color: colors.black,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: colors.white,
        paddingVertical: isTab ? hp(1) : hp(2),
        borderRadius: wp(3),
    },
    header: {
        fontSize: isTab ? wp(2) : wp(3),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: isTab ? hp(1) : hp(1.5),
    },
    detailText: {
        fontSize: isTab ? wp(1.8) : wp(3),
        color: colors.darkGrey,
        textAlign: 'left',
    },
    infoContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        marginTop: hp(1),
        marginBottom: hp(1),
        alignItems: 'center',
        paddingLeft: wp(2),
    },
});
