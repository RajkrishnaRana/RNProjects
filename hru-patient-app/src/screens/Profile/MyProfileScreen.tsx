import { StyleSheet, Text, View, Image, ImageSourcePropType, Alert } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import { useAuthStore } from '../../store/authStore';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { getName, imageSelector, tokenExpiredMsg } from '../../utils';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import { BASE_URL } from '../../config';
import { BackHandler } from 'react-native';
import BackgroundGradient from '../../components/BackgroundGradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import TabBarParent from '../../components/TabBarParent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isTab } from '../../utils/isTab';

interface ProfileInfoProps {
    label?: string;
    value: string;
    path?: ImageSourcePropType;
    customIcon?: React.ReactNode;
}

const ProfileInfo = ({ label, value, path, customIcon }: ProfileInfoProps) => {
    return (
        <View style={styles.infoRow}>
            {customIcon ? customIcon : <Image source={path} style={styles.icon} tintColor={colors.primary} />}
            <View style={styles.infoText}>
                {/* <Text style={styles.label}>{label}</Text> */}
                <Text style={styles.value}>{value || '-'}</Text>
            </View>
        </View>
    );
};

export default function MyProfileScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ---------------------------------->
    const { token, logout } = useAuthStore();

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patienteditprofile`;
    const { isPending, error, data } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => postData(url, { token: token }),
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            console.log('userProfile', data);
            return data.doc;
        },
    });

    // console.log(data);

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <ErrorComponent />
                    ) : (
                        <>
                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                {/* Profile Info */}
                                <View style={styles.profileSection}>
                                    <Image source={imageSelector(data?.profileImgPath, data?.gender)} style={styles.profileImage} />
                                    <View style={styles.profileDetails}>
                                        <Text style={styles.profileName}>
                                            {getName(data?.firstName, data?.middleName, data?.lastName, data?.prefix)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Information */}
                                <View style={styles.infoSection}>
                                    <ProfileInfo label="PHONE NUMBER" value={data?.mobileNumber} path={require('../../assets/icons/phone.png')} />

                                    <ProfileInfo
                                        label="DATE OF BIRTH"
                                        value={dayjs(data?.dob).format('DD MMM YYYY')}
                                        path={require('../../assets/icons/calendar.png')}
                                    />

                                    <ProfileInfo
                                        label="GENDER"
                                        value={data?.gender}
                                        customIcon={
                                            data?.gender === 'MALE' ? (
                                                <MaterialCommunityIcons name="gender-male" size={wp(5)} color={colors.primary} />
                                            ) : (
                                                <MaterialCommunityIcons name="gender-female" size={wp(5)} color={colors.primary} />
                                            )
                                        }
                                    />

                                    {/* <ProfileInfo
                                    label="HEALTH STATUS"
                                    value={data?.healthScheme}
                                    path={require('../../assets/icons/doctor.png')}
                                /> */}

                                    <ProfileInfo label="EMAIL" value={data?.email} path={require('../../assets/icons/email.png')} />

                                    <ProfileInfo
                                        // label="HEALTH STATUS"
                                        customIcon={
                                            <FontAwesomeIcon
                                                name="handshake-o"
                                                size={isTab ? wp(2.5) : wp(5)}
                                                color={colors.primary}
                                                style={{ marginHorizontal: wp(0.5) }}
                                            />
                                        }
                                        value={data?.referralId}
                                    />

                                    <ProfileInfo
                                        // label="HEALTH STATUS"
                                        value={
                                            data?.addresses[0]?.addressLineOne.length > (isTab ? 45 : 30)
                                                ? data?.addresses[0]?.addressLineOne.slice(0, isTab ? 45 : 30) + '...'
                                                : data?.addresses[0]?.addressLineOne
                                        }
                                        path={require('../../assets/icons/location.png')}
                                    />

                                    <ProfileInfo
                                        // label="HEALTH STATUS"
                                        value={data?.bloodGroup}
                                        path={require('../../assets/icons/heart.png')}
                                    />
                                </View>
                            </View>
                            <BigButton
                                title="Edit Details"
                                onPress={() => {
                                    navigation.push('EditProfile', { data: data });
                                }}
                            />
                        </>
                        // <></>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginHorizontal: wp(3),
        marginVertical: hp(2),
        paddingBottom: hp(3),
        paddingHorizontal: wp(3),
        borderRadius: wp(5),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(3),
    },
    headerTitle: {
        fontSize: wp(5),
        fontWeight: 'bold',
    },
    editText: {
        color: colors.primary,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    profileSection: {
        paddingVertical: hp(2),
        alignItems: 'center',
        // marginBottom: hp(1.5),
        gap: hp(1),
    },
    profileImage: {
        width: isTab ? wp(12) : wp(17),
        height: isTab ? wp(12) : wp(17),
        borderRadius: wp(15),
        marginRight: 15,
        borderWidth: 0.2,
        elevation: 1,
        borderColor: colors.darkBlue,
    },
    profileDetails: {
        justifyContent: 'center',
    },
    profileName: {
        fontSize: isTab ? wp(3) : wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    profileTagline: {
        fontSize: wp(4),
        color: 'gray',
    },
    icon: {
        width: isTab ? wp(3) : wp(6),
        height: isTab ? wp(3) : wp(6),
    },
    infoSection: {
        marginTop: 20,
        paddingHorizontal: wp(3),
        gap: isTab ? 0 : hp(0.5),
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isTab ? hp(1) : hp(1.5),
        borderBottomWidth: 0.2,
        borderColor: colors.darkGrey,
        // width: wp(45),
    },
    infoText: {
        marginLeft: wp(4),
        paddingVertical: hp(1),
    },
    label: {
        fontSize: isTab ? wp(2) : wp(3),
        color: colors.black,
    },
    value: {
        fontSize: isTab ? wp(2.5) : wp(4),
        // fontWeight: 'bold',
        color: colors.black,
    },
});
