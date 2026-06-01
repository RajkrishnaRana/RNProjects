import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { colors } from '../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import BackButton from '../components/BackButton';
import BigButton from '../components/BigButton';
import { useNavigation } from '../hooks/useNavigation';
import SignUpPrompt from '../components/SignUpPrompt';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../api';
import Toast from 'react-native-simple-toast';
import { z } from 'zod';
import { useSignUpStore } from '../store/signUpStore';
import { BASE_URL } from '../config';
import useCountdownTimer from '../hooks/useCountdownTimer';
import { isTab } from '../utils/isTab';
import { useAuthStore } from '../store/authStore';

type OtpVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

// ZOD VALIDATION SCHEMA  ------------>
const otpVerificationSchema = z.object({
    phone_no: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, { message: 'Phone number must be numeric' }),
    otp: z.string().length(4, 'OTP must be 4 digits'),
});
export type OtpVerificationScreenProps = z.infer<typeof otpVerificationSchema>;

export default function OtpVerificationScreen() {
    // CONSTANTS -------------->
    const navigation = useNavigation();

    // GLOBAL STATES -------------->
    const { _id, setProfiles, mobile } = useSignUpStore();
    const { login } = useAuthStore();

    // LOCAL STATES -------------->
    const { phoneNumber, type, patientId } = useRoute<OtpVerificationScreenRouteProp>().params;

    const [otpText, setOtpText] = useState('');
    const [loading, setLoading] = useState(false);
    const { isTimerRunning, formattedTime, setSecondsLeft, setIsTimerRunning } = useCountdownTimer();

    // Mutation for OTP Verification ------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/verifyOTP`;
    const mutation = useMutation({
        mutationFn: (data: OtpVerificationScreenProps) => postData(url, data),
        onSuccess: data => {
            if (data.error_code) {
                Toast.show(`${data.status}: ${data.msg}`, Toast.LONG);
            } else {
                if (type === 'signup') navigation.replace('Signup', { isOtpVerified: true });
                else if (type === 'bookingTimeLogin') {
                    navigation.goBack();
                    navigation.goBack();
                } else {
                    navigation.replace('ResetPassword', {
                        phoneNumber: phoneNumber,
                    });
                }
            }
        },
        onError: error => {
            console.log(error);
            Toast.show('Something went wrong with the API', Toast.LONG);
        },
    });

    // LOCAL FUNCTIONS ------------------------------------------------------------>
    function handleVerify(text: string) {
        const result = otpVerificationSchema.safeParse({
            phone_no: phoneNumber,
            otp: text,
        });

        if (!result.success) {
            const errorMessage = result.error.message;
            Toast.show(errorMessage, Toast.LONG);
            return;
        }

        mutation.mutate(result.data);
    }

    async function handleSignUpOtp(text: string) {
        try {
            setLoading(true);

            const url2 = `${BASE_URL}/validate-otp.json`; // Adjust URL as needed
            const payload = {
                _id: _id,
                otp: text,
            };

            const res = await postData(url2, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log(res);
            setProfiles(res.doc.profiles);
            navigation.replace('Signup', { isOtpVerified: true });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleResendOtp() {
        const url2 = `${BASE_URL}/send-otp-to-patient.json`;
        const payload = {
            mobile: mobile,
            userType: 'PATIENT',
            resendOtp: true,
        };

        const res = await postData(url2, payload);

        if (!res.status) {
            Toast.show(res.msg, Toast.SHORT);
            throw new Error(res.msg);
        }

        console.log(res);
        Toast.show('OTP sent successfully', Toast.SHORT);
        setSecondsLeft(30);
        setIsTimerRunning(true);
    }

    async function handleVerifyWithOtp(text: string) {
        try {
            setLoading(true);
            const verifyURL = `${BASE_URL}/hru/Patientappapi/loginThroughOtp`;
            // const verifyURL = 'https://84058fb7d929.ngrok-free.app/hru/Patientappapi/loginThroughOtp';
            const payload = {
                otp: text,
                patientId: patientId,
            };
            console.log('payload', payload);

            const res = await postData(verifyURL, payload);

            if (!res.status || res.error_code) {
                Toast.show(res.msg, Toast.SHORT);
                return;
            }

            console.log('veritywithotp response', res);
            login(res?.data, false);
            Toast.show(res.msg, Toast.SHORT);

            navigation.goBack();
            navigation.goBack();
        } catch (error: Error | any) {
            Toast.show(String(error.msg), Toast.SHORT);
            console.log('otpverify error', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.greenBackground}>
                <Text style={styles.verificationText}>Verification</Text>
                <Text style={styles.descriptionText}>We have sent a code to your phone number</Text>
                <Text style={styles.emailText}>{phoneNumber}</Text>
            </View>

            <BackButton />

            <View style={styles.bodyContainer}>
                <OtpInput
                    numberOfDigits={6}
                    focusColor="green"
                    focusStickBlinkingDuration={500}
                    onTextChange={setOtpText}
                    onFilled={text =>
                        type === 'signup' ? handleSignUpOtp(text) : type === 'bookingTimeLogin' ? handleVerifyWithOtp(text) : handleVerify(text)
                    }
                    textInputProps={{
                        accessibilityLabel: 'One-Time Password',
                    }}
                    theme={{
                        containerStyle: styles.otpContainer,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                        focusStickStyle: styles.focusStick,
                        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    }}
                />

                <Text style={styles.informationText}>It will be vaild for 5 minutes</Text>

                <SignUpPrompt
                    primaryText="Have not got yet ? "
                    linkText={isTimerRunning ? `${formattedTime}` : 'RESEND'}
                    onPress={isTimerRunning ? () => {} : handleResendOtp}
                />

                <BigButton
                    title="VERIFY"
                    onPress={() =>
                        type === 'signup'
                            ? handleSignUpOtp(otpText)
                            : type === 'bookingTimeLogin'
                            ? handleVerifyWithOtp(otpText)
                            : handleVerify(otpText)
                    }
                    loading={type === 'signup' || type === 'bookingTimeLogin' ? loading : mutation.status === 'pending'}
                    customStyle={{ marginHorizontal: wp(5) }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greenBackground: {
        height: hp(30),
        width: wp(100),
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verificationText: {
        color: colors.white,
        fontSize: isTab ? wp(5) : wp(6),
        fontWeight: 'bold',
    },
    descriptionText: {
        color: colors.white,
        fontSize: isTab ? wp(2.5) : wp(3.5),
        marginTop: hp(0.5),
    },
    emailText: {
        color: colors.white,
        fontSize: isTab ? wp(3) : wp(4),
        fontWeight: 'bold',
        marginTop: hp(1),
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: colors.white,
        marginTop: hp(-5),
        borderWidth: 1,
        borderColor: colors.primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    otpContainer: {
        marginTop: hp(5),
        paddingHorizontal: wp(5),
    },
    pinCodeContainer: {
        width: wp(12),
        height: wp(13),
        backgroundColor: colors.blueWhite,
    },
    pinCodeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    focusStick: {
        borderColor: colors.primary,
    },
    activePinCodeContainer: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    informationText: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.grey,
        textAlign: 'center',
        marginTop: hp(3),
    },
});
