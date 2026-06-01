import { ImageSourcePropType, StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { useClinicProfile } from '../../hooks/Clinic/useClinicProfile';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import BackgroundGradient from '../../components/BackgroundGradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import IconText from '../../components/IconText';
import { getName, slicingText } from '../../utils';
import { colors } from '../../common/colors';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import ClinicProfileImg from '../../components/Clinic/ClinicProfileImg';
import Accordian from '../../components/Animated/Accordian';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ClinicDoctorCard from '../../components/Clinic/ClinicDoctorCard';
import { FlashList } from '@shopify/flash-list';
import ClinicReviewCard from '../../components/Clinic/ClinicReviewCard';
import CinicMembershipCard from '../../components/Clinic/CinicMembershipCard';
import ClinicFacilitiesCard from '../../components/Clinic/ClinicFacilitiesCard';
import StarRating from '../../components/StarRating';
import { isTab } from '../../utils/isTab';

type ClinicProfileScreenRouteProp = RouteProp<RootStackParamList, 'ClinicProfile'>;

const Header = ({ text, src }: { text: string; src: ImageSourcePropType }) => {
    return (
        <View style={styles.accordianHeader}>
            <Image source={src} style={styles.icon} />
            <Text style={styles.headerText}>{text}</Text>
        </View>
    );
};

const ItemSeparatorComponent = () => <View style={{ height: hp(1.5) }} />;
const ListEmptyComponent = () => <Text style={styles.listEmptyText}>No Data Available</Text>;

export default function ClinicProfileScreen() {
    const { id } = useRoute<ClinicProfileScreenRouteProp>().params;
    const { isLoading, error, clinicDetails, imageGallery, getSpecialitiesDoctors, hospitalReviews, uniqueSpecialities, rating, goToClinicLocation } =
        useClinicProfile(id);

    return (
        <BackgroundGradient>
            {isLoading ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Clinic Details */}
                    <View style={styles.clinicDetailsContainer}>
                        <ClinicProfileImg
                            src={clinicDetails?.clinicProfileImgPath}
                            char={clinicDetails?.clinicName?.charAt(0)}
                            gallery={imageGallery}
                        />

                        <View>
                            <Text style={styles.clinicHeader}>{slicingText(clinicDetails?.clinicName, 25)}</Text>

                            <View style={styles.ratingContainer}>
                                <StarRating rating={Number(rating)} />
                                <Text style={{ fontSize: isTab ? wp(2.2) : wp(3.2), color: colors.black }}>{rating ? rating.toFixed(1) : 0}</Text>
                                <Text style={{ fontSize: isTab ? wp(2.2) : wp(3.2), color: colors.black }}>({hospitalReviews?.length} reviews)</Text>
                            </View>

                            <View style={[styles.ratingContainer, { marginBottom: hp(0.5) }]}>
                                <IconText index={5} text={clinicDetails?.specialities?.[0]} />
                                <IconText index={16} text={`Total Beds : ${clinicDetails?.noOfBedsAvl}`} />
                            </View>
                            <View style={[styles.ratingContainer, { marginBottom: hp(0.5) }]}>
                                <IconText index={4} text={clinicDetails?.mobileNumber} />
                                <IconText index={13} text={clinicDetails?.email} />
                            </View>
                            <IconText
                                index={3}
                                text={clinicDetails?.address?.locationAddressOne}
                                customTextStyles={{ maxWidth: isTab ? wp(70) : wp(60) }}
                            />
                        </View>
                    </View>

                    {/* Doctor Details */}
                    <Accordian
                        header="About Clinic"
                        children={
                            <Animated.View entering={FadeInDown.springify().delay(200)}>
                                <Header src={require('../../assets/icons/building.png')} text={`About ${clinicDetails?.clinicName}: `} />
                                <Text style={styles.details}>{clinicDetails?.about?.data}</Text>
                            </Animated.View>
                        }
                    />

                    <Accordian
                        header="Our Expert Doctors"
                        initialState
                        children={
                            <Animated.View entering={FadeInDown.springify().delay(200)}>
                                <FlashList
                                    data={getSpecialitiesDoctors || []}
                                    renderItem={({ item }) => <ClinicDoctorCard data={item} id={clinicDetails?.address?._id} />}
                                    estimatedItemSize={100}
                                    keyExtractor={(item: any) => item._id}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    ListEmptyComponent={ListEmptyComponent}
                                />
                            </Animated.View>
                        }
                    />

                    <Accordian
                        header="Our Specialities"
                        children={
                            <Animated.View entering={FadeInDown.springify().delay(200)}>
                                <FlashList
                                    data={uniqueSpecialities || []}
                                    renderItem={({ item }) => (
                                        <ClinicFacilitiesCard img={item?.imgUrl?.imageUrl} heading={item?.name} desc={item?.description} />
                                    )}
                                    estimatedItemSize={100}
                                    keyExtractor={(item: any) => item._id}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    ListEmptyComponent={ListEmptyComponent}
                                />
                            </Animated.View>
                        }
                    />

                    <Accordian
                        header="Our Facilities"
                        children={
                            <Animated.View entering={FadeInDown.springify().delay(200)}>
                                <FlashList
                                    data={clinicDetails?.facilities || []}
                                    renderItem={({ item }) => (
                                        <ClinicFacilitiesCard
                                            img={item?.facilityImg?.imageUrl}
                                            heading={item?.facilityLabel}
                                            desc={item?.facilityDescription}
                                        />
                                    )}
                                    estimatedItemSize={100}
                                    keyExtractor={(item: any) => item.id}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    ListEmptyComponent={ListEmptyComponent}
                                />
                            </Animated.View>
                        }
                    />

                    <Accordian
                        header="Contact & Location"
                        children={
                            <Animated.View entering={FadeInDown.springify().delay(200)}>
                                <Header src={require('../../assets/icons/clinicOwner.png')} text="Owner Information : " />
                                <View style={styles.detailContainer}>
                                    <Text style={styles.details}>
                                        Name : {getName(clinicDetails?.ownerFirstName, null, clinicDetails?.ownerLastName)}
                                    </Text>
                                    <Text style={styles.details}>Mobile : {clinicDetails?.mobileNumber}</Text>
                                </View>
                                <Text style={styles.details}> Email : {clinicDetails?.email}</Text>

                                <View style={{ height: isTab ? hp(1) : hp(2) }} />

                                <View style={styles.detailContainer}>
                                    <Header src={require('../../assets/icons/location.png')} text="Location : " />
                                    <Pressable onPress={goToClinicLocation}>
                                        <Text style={styles.mapText}>View map</Text>
                                    </Pressable>
                                </View>
                                <Text style={[styles.details, { maxWidth: wp(90) }]}>{clinicDetails?.address?.locationAddressOne}</Text>
                            </Animated.View>
                        }
                    />

                    {clinicDetails.membershipData?.length > 0 && (
                        <Accordian
                            header="Membership"
                            children={
                                <Animated.View entering={FadeInDown.springify().delay(200)}>
                                    <FlashList
                                        data={clinicDetails.membershipData}
                                        renderItem={({ item }) => <CinicMembershipCard description={item?.memberShipData} />}
                                        estimatedItemSize={100}
                                        keyExtractor={(item: any) => item.id}
                                        ItemSeparatorComponent={ItemSeparatorComponent}
                                        ListEmptyComponent={ListEmptyComponent}
                                    />
                                </Animated.View>
                            }
                        />
                    )}

                    {hospitalReviews?.length > 0 && (
                        <Accordian
                            header="Reviews"
                            children={
                                <Animated.View entering={FadeInDown.springify().delay(200)}>
                                    <FlashList
                                        data={hospitalReviews}
                                        renderItem={({ item }: any) => (
                                            <ClinicReviewCard
                                                image={item?.patientProfile?.[0]?.profile?.[0]?.profileImg?.imageUrl}
                                                name={getName(
                                                    item?.patientProfile?.[0]?.profile?.[0]?.firstName,
                                                    item?.patientProfile?.[0]?.profile?.[0]?.middleName,
                                                    item?.patientProfile?.[0]?.profile?.[0]?.lastName,
                                                    item?.patientProfile?.[0]?.profile?.[0]?.prefix,
                                                )}
                                                firstLetter={item?.patientProfile?.[0]?.profile?.[0]?.firstName?.[0]}
                                                rating={item?.patientRatingToDoctor}
                                                review={item?.remarks}
                                            />
                                        )}
                                        estimatedItemSize={100}
                                        keyExtractor={(item: any) => item._id}
                                        ItemSeparatorComponent={ItemSeparatorComponent}
                                        ListEmptyComponent={ListEmptyComponent}
                                    />
                                </Animated.View>
                            }
                        />
                    )}
                </ScrollView>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, paddingBottom: hp(6) },
    clinicDetailsContainer: {
        backgroundColor: 'white',
        borderRadius: isTab ? wp(3) : wp(5),
        padding: wp(3),
        marginHorizontal: wp(3),
        marginTop: hp(1),
        elevation: 1,
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: isTab ? wp(1.5) : wp(3),
        alignItems: 'center',
        marginBottom: isTab ? hp(0.5) : hp(1),
    },
    clinicHeader: {
        fontSize: isTab ? wp(3.5) : wp(5),
        fontWeight: 'bold',
        color: 'black',
        marginBottom: isTab ? hp(0.2) : hp(0.5),
    },
    accordianHeader: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginBottom: hp(0.3),
    },
    icon: {
        width: isTab ? wp(2.5) : wp(3.5),
        height: isTab ? wp(2.5) : wp(3.5),
        tintColor: colors.primary,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(2.2) : wp(3.5),
        color: colors.darkBlue,
    },
    detailContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    details: {
        color: colors.lightBlack,
        fontSize: isTab ? wp(2) : wp(3),
        fontWeight: '500',
        maxWidth: '100%',
        textAlign: 'left',
    },
    listEmptyText: { textAlign: 'center', color: colors.black },
    mapText: {
        fontSize: isTab ? wp(2.2) : wp(3.2),
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textDecorationColor: colors.darkBlue,
        color: colors.darkBlue,
    },
});
