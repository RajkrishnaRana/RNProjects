import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import TabSection from '../components/TabSections/TabSection';
import Clipboard from '@react-native-clipboard/clipboard';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import {useAuthStore} from '../store/authStore';
import PageLoading from '../components/LottieComponent/PageLoading';
import {useReferralStore} from '../store/referralStore';
import {BASE_URL} from '../config';
import BackgroundGradient from '../components/BackgroundGradient';
import TabBarParent from '../components/TabBarParent';
import {isIos} from '../utils/platform';
import Toast from 'react-native-simple-toast';
import {isTab} from '../utils/isTab';

interface PatientDetails {
    _id: string;
    firstName: string;
    middleName: string | null; // middleName can be null
    lastName: string;
    fullName: string;
}

export interface ReferralDetail {
    _id: string;
    userId: string;
    createdAt: string; // ISO date string
    point: number;
    refCode: string;
    referreeId: string;
    expiryDate: string; // ISO date string
    userDetails?: PatientDetails;
    spendingPoint: number;
}

export interface Invitation {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string; // Optional, as not all invitations have an email
    phoneNumber?: string; // Optional, as not all invitations have a phone number
    createdAt: string; // ISO date string
    referralId: string;
}

interface Doc {
    invitationHistory: Invitation[];
    referralId: string;
    referralDetails: ReferralDetail[];
    totalCreditedPoints: number;
    totalDebitedPoints: number;
    totalBal: number;
}

export interface ApiResponse {
    status: boolean;
    msg: string;
    doc: Doc;
}

export default function ReferralPointsScreen() {
    // GLOBAL STATES --------------------------------->
    const token = useAuthStore(state => state.token);
    const setReferralApiData = useReferralStore(state => state.setReferralApiData);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientreferralhistory`;
    // const url = `https://ad27e6ab66a1.ngrok-free.app/hru/patientappapi/patientreferralhistory`;
    const {isPending, error, data} = useQuery({
        queryKey: ['referAFriend'],
        queryFn: () => postData(url, {token: token}),
        select: data => {
            setReferralApiData(data);
            return data;
        },
    });

    // LOCAL FUNCTIONS ----------------------------->
    const copyReferralCode = () => {
        Clipboard.setString(data?.doc?.referralId);
        isIos() && Toast.show('Copied to clipboard', Toast.SHORT);
    };

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <>
                            <Text>Some error occured</Text>
                        </>
                    ) : (
                        <>
                            <View style={{alignItems: 'center', gap: isTab ? hp(1.5) : hp(1)}}>
                                <LottieView
                                    source={require('../assets/LottieFiles/refer.json')}
                                    autoPlay
                                    loop={false}
                                    style={{height: isTab ? wp(20) : wp(35), width: wp(90)}}
                                />
                                <Animated.View style={styles.referCodeContainer} entering={FadeInDown.springify()}>
                                    <Text style={styles.referralCodeText}>{data?.doc?.referralId}</Text>

                                    <TouchableOpacity style={styles.copyButton} onPress={copyReferralCode}>
                                        <Text style={styles.copyButtonTitle}>Copy</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            <TabSection />
                        </>
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
        paddingHorizontal: wp(3),
        gap: hp(1),
    },
    referCodeContainer: {
        flexDirection: 'row',
        width: wp(80),
        alignItems: 'center',
        backgroundColor: colors.blueWhite,
        borderRadius: wp(3),
        borderColor: colors.primary,
        elevation: 3,
    },
    referralCodeText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.darkGrey,
        width: wp(55),
        paddingVertical: isTab ? hp(0.9) : hp(1.5),
        paddingHorizontal: wp(3),
        fontWeight: 'bold',
    },
    copyButton: {
        backgroundColor: colors.primary,
        flex: 1,
        paddingVertical: isTab ? hp(0.8) : hp(1.2),
        borderTopRightRadius: wp(3),
        borderBottomEndRadius: wp(3),
        elevation: 3,
    },
    copyButtonTitle: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: isTab ? wp(3) : wp(4),
    },
});
