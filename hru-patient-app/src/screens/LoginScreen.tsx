import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { colors } from '../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TextField from '../components/TextField';
import { useNavigation } from '../hooks/useNavigation';
import BigButton from '../components/BigButton';
import SignUpPrompt from '../components/SignUpPrompt';
import LoginBody from '../components/LoginBody';
import CheckBox from '../components/CheckBox';
import Toast from 'react-native-simple-toast';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../api';
import { useAuthStore } from '../store/authStore';
import { Controller, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setNotificationDetails } from '../utils/notification';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../config';
import TextField2 from '../components/TextField2';
import { isTab } from '../utils/isTab';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

// ZOD VALIDATION SCHEMA  ------------>
const loginSchema = z.object({
    phone_no: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, { message: 'Phone number must be numeric' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginDataType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const navigation = useNavigation();
    const routeProp = useRoute<LoginScreenRouteProp>().params;

    // GLOBAL STATES -------------->
    const { login, phone_no, password, setPhnPass, isBooking, setIsBooking } = useAuthStore();

    // LOCAL STATES -------------->
    const [rememberMe, setRememberMe] = useState(true);
    // const [realPass, setRealPass] = useState('');

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone_no: phone_no || '', // '1234567890', // '8100365591' // phone_no,
            password: password || '', //'AppTest@123', //'Pradip@123' // password,
        },
    });
    const { field } = useController({ control, name: 'phone_no' });

    // Mutation for login ------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/login`;

    const mutation = useMutation({
        mutationFn: (data: LoginDataType) => postData(url, data),
        onSuccess: (data, variables) => {
            if (data.error_code) {
                Toast.show(`${data.status}: ${data.msg}`, Toast.LONG);
            } else {
                // Toast.show('Login successful', Toast.LONG);
                // console.log(data);
                setNotificationDetails(data?.data?.auth_token);
                if (rememberMe) {
                    login(data?.data, rememberMe);
                    setPhnPass(variables);
                } else {
                    login(data?.data, rememberMe);
                    setPhnPass({ phone_no: '', password: '' });
                }
                // isBooking ? navigation.goBack() : navigation.navigate('Home');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
                setIsBooking(false);
            }
        },
        onError: error => {
            console.log(error);
            Toast.show('Something went wrong with the API', Toast.LONG);
        },
    });

    // LOCAL FUNCTIONS ------------------------------------------------------------>
    // Login Handler
    function onSubmit(data: LoginDataType) {
        mutation.mutate(data);
    }

    const handleVerifyWithOtp = async () => {
        if (field.value.length !== 10) {
            Toast.show('Please enter a valid phone number', Toast.LONG);
            return;
        }

        const urlForOtp = `${BASE_URL}/resend-otp-to-patient.json`;
        const res = await postData(urlForOtp, { mobile: field.value, userType: 'PATIENT' });

        if (!res.status) {
            Toast.show(res.msg, Toast.SHORT);
            return;
        }

        // console.log('handleVerifyOtp', res);

        Toast.show('OTP sent successfully', Toast.SHORT);
        navigation.push('OtpScreen', { phoneNumber: field.value, type: 'bookingTimeLogin', patientId: res?.patientId });
    };

    // SIDE EFFECTS -------------------------------------------------------------->
    // useEffect(() => {
    //     const handleBackPress = () => {
    //         BackHandler.exitApp();
    //         return true; // Prevent default back button behavior
    //     };

    //     // Add the back button listener
    //     const subscription = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         handleBackPress,
    //     );

    //     // Cleanup the listener on component unmount
    //     return () => {
    //         subscription.remove();
    //     };
    // }, [navigation]);

    return (
        <View style={styles.container}>
            {/* <LoginHeroSection /> */}

            <LoginBody>
                <LinearGradient colors={[colors.white, colors.white]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.imageContainer}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                </LinearGradient>

                <View>
                    {/* <Text style={styles.logInText}>Log In</Text> */}
                    <Text style={styles.subLoginText}>Welcome! Log in to continue</Text>
                </View>

                <View style={{ marginTop: hp(5) }}>
                    <Controller
                        control={control}
                        name="phone_no"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Phone No."
                                placeholder="Enter Phone Number"
                                value={value}
                                isNumeric={true}
                                onChangeText={text => {
                                    if (text.length <= 10) {
                                        onChange(text); // Update only if length <= 10
                                    }
                                }}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.phone_no?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField2
                                label="Password"
                                placeholder="Enter Password "
                                value={value}
                                onChangeText={onChange}
                                isPassword={true}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.password?.message}
                            />
                        )}
                    />
                </View>

                <View style={styles.rememberMeSection}>
                    {routeProp?.isBookingTime ? (
                        <View />
                    ) : (
                        <CheckBox rememberMe={rememberMe} setRememberMe={() => setRememberMe(prev => !prev)} title="Remember Me" />
                    )}
                    <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
                        <Text style={{ color: colors.primary, fontSize: isTab ? wp(2) : wp(3.5) }}>Forgot Password ?</Text>
                    </TouchableOpacity>
                </View>

                <BigButton onPress={handleSubmit(onSubmit)} title="LOGIN" loading={mutation.status === 'pending'} />

                {routeProp?.isBookingTime && (
                    <SignUpPrompt onPress={handleVerifyWithOtp} primaryText="Can't remember password ? " linkText="VERIFY WITH OTP" />
                )}

                <SignUpPrompt
                    onPress={() => navigation.push('Signup', { isOtpVerified: false })}
                    primaryText="Don't have an account ? "
                    linkText="SIGN UP"
                />
                {!routeProp?.isBookingTime && (
                    <SignUpPrompt onPress={() => navigation.navigate('Home')} primaryText="Continue without Login, " linkText="Click Here" />
                )}

                <View style={{ height: hp(5) }} />
            </LoginBody>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subLoginText: {
        marginTop: hp(4),
        fontSize: isTab ? wp(3) : wp(5),
        color: colors.darkGrey,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    rememberMeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: isTab ? hp(1) : hp(2),
    },
    logo: {
        width: 140,
        height: 65,
        alignSelf: 'center',
        // marginTop: hp(7),
    },
    imageContainer: {
        marginTop: isTab ? hp(20) : hp(15),
        alignItems: 'center',
        justifyContent: 'center',
        height: isTab ? wp(25) : wp(40),
        width: isTab ? wp(25) : wp(40),
        alignSelf: 'center',
        borderRadius: wp(30),
        backgroundColor: colors.white,
        borderWidth: wp(0.5),
        borderColor: colors.primary,
    },
});
