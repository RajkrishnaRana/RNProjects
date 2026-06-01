import { ActivityIndicator, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SpecialitiesCard from '../components/Cards/SpecialitiesCard';
import { useNavigation } from '../hooks/useNavigation';
import { useAuthStore } from '../store/authStore';
import HorizontalList from './HorizontalList';
import { FlashList } from '@shopify/flash-list';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { tokenExpiredMsg } from '../utils';
import { useQuery } from '@tanstack/react-query';
import PageLoading from '../components/LottieComponent/PageLoading';
import ErrorComponent from '../components/ErrorComponent';
import TabBarParent from '../components/TabBarParent';
import { TestimonialCard } from '../components/Cards/TestimonialCard';
import SpecialitiesDoctorCard from '../components/Cards/SpecialitiesDoctorCard';
import BackgroundGradient from '../components/BackgroundGradient';
import { isIos } from '../utils/platform';
import { isTab } from '../utils/isTab';
import { useCurrentTabDashboard } from '../store/dashboardCurrentTab';

export interface specialitiesProps {
    imgSrc: ImageSourcePropType;
    title: string;
}
export interface nearbyHospitalsProps {
    imgSrc: ImageSourcePropType;
    title: string;
    timeDistance: string;
}

export interface doctorCardProps {
    title: string;
    subTitle: string;
}

export default function BookAppointmentScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------------>
    const { token, logout } = useAuthStore();
    const { nearestLocation, setLocationList } = useCurrentLocationStore();
    const { selectedTab } = useCurrentTabDashboard();
    console.log('nearestLocation', nearestLocation);

    // GET PAGE DATA -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/appointmentbook`;
    const payload = {
        token: token,
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        searchLocationId: nearestLocation?._id,
    };

    console.log(payload);
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['bookAppointmentPage'],
        queryFn: () => postData(url, payload),
        select: data => {
            if (data?.tokenExpired) {
                tokenExpiredMsg(logout);
                throw new Error('Token has expired. Please log in again.');
            }
            console.log('bookappointmentData ----------------->', data);
            return data?.doc;
        },
    });

    // PATIENT TESTIMONAL DATA FETCHING ----------------------->
    const url2 = `${BASE_URL}/hru/Patientappapi/gettestimonials`;
    const {
        isPending: isLoading,
        error: e,
        data: testimonials,
    } = useQuery({
        queryKey: ['testimonials'],
        queryFn: () => postData(url2),
        select: data => {
            return data?.docs;
        },
    });

    // SIDE EFFECTS ----------------------------------->
    // useEffect(() => {
    //     setLocationList(data?.locations);
    // }, [data]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <TabBarParent>
            <BackgroundGradient>
                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                        {/* Location & Searchbar */}
                        <View style={styles.searchContainer}>
                            <TouchableOpacity
                                style={styles.searchBoxContainer}
                                onPress={() =>
                                    navigation.push('Search', {
                                        data: data?.searchSpecialistDoctors,
                                        payload: payload,
                                    })
                                }
                            >
                                {selectedTab === 'doctor' ? (
                                    <Text style={styles.searchBoxText}>Search Doctors ...</Text>
                                ) : selectedTab === 'pharmacy' ? (
                                    <Text style={styles.searchBoxText}>Search medicines ...</Text>
                                ) : (
                                    <Text style={styles.searchBoxText}>Search Specialities, Doctors, Clinics ...</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Most Searched Specialities */}
                        <View
                            style={[
                                styles.specialitiesContainer,
                                {
                                    gap: hp(1),
                                    height: isTab ? hp(15) : hp(20),
                                },
                            ]}
                        >
                            <Text style={styles.header1}>
                                MOST SEARCHED <Text style={{ color: colors.red }}>SPECIALITIES</Text>
                            </Text>
                            <FlashList
                                data={data?.mostSearchedSpecialities}
                                renderItem={({ item }: { item: MostSearchedSpeciality }) => <SpecialitiesCard item={item} payload={payload} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingLeft: wp(3) }}
                            />
                        </View>

                        {/* Recently Visited Doctors */}
                        <View style={{ marginTop: hp(2) }}>
                            <Text style={styles.header1}>
                                RECENTLY VISITED <Text style={{ color: colors.red }}>DOCTORS</Text>
                            </Text>

                            <FlashList
                                data={data?.recentVisitedDoctors}
                                renderItem={({ item }: { item: RecentVisitedDoctor }) => {
                                    // return <DoctorCard item={item} />;
                                    return <SpecialitiesDoctorCard data={item} />;
                                }}
                            />
                        </View>

                        {/* Testimonials Section */}
                        <View style={styles.specialitiesContainer}>
                            <Text style={styles.header1}>
                                WHAT OUR <Text style={{ color: colors.red }}>PATIENTS SAY</Text>
                            </Text>

                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} size={wp(5)} />
                            ) : error ? (
                                <Text style={{ color: 'red' }}>Something went wrong</Text>
                            ) : (
                                <HorizontalList
                                    data={testimonials}
                                    renderItem={({ item }) => <TestimonialCard testimonial={item} />}
                                    autoScrollEnabled
                                    pagingEnabled={isIos() ? false : true}
                                />
                            )}
                        </View>
                    </ScrollView>
                )}
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(1),
    },
    customDropdownStyle: {
        width: wp(30),
        paddingVertical: wp(2),
        paddingHorizontal: wp(2),
        borderRadius: wp(10),
        backgroundColor: colors.blueWhite,
        elevation: 3,
    },
    customSelectedTextStyle: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
    searchBoxContainer: {
        backgroundColor: colors.white,
        borderRadius: wp(10),
        padding: isTab ? wp(2.5) : wp(3.5),
        flex: 1,
        flexDirection: 'row',
        borderWidth: wp(0.01),
        borderColor: colors.darkBlue,
        elevation: 3,
        marginHorizontal: wp(3),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    searchBoxText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
        color: colors.darkGrey,
    },
    specialitiesContainer: {
        flex: 1,
        marginTop: hp(3),
        paddingLeft: wp(3),
        alignItems: 'center',
    },
    header1: {
        fontSize: isTab ? wp(2.5) : wp(4.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
        textAlign: 'center',
    },
    doctorListContainer: {
        flexGrow: 1,
        marginTop: hp(2),
        paddingBottom: hp(1),
    },
    paginationContainer: {
        marginTop: hp(1.5),
        position: 'static',
    },
});
