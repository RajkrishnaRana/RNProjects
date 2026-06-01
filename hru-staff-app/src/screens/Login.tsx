import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {z} from 'zod';
import {colors} from '../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextField from '../components/Textfield';
import {useNavigation} from '../hooks/useNavigation';
import BigButton from '../components/Buttons/Bigbutton';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../api';
import {useAuthStore} from '../store/authStore';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import LoginHeader from '../components/LoginHeader';
import LoginBody from '../components/LoginBody';
import LoginHeroSection from '../components/LoginHeroSection';
import CheckBox from '../components/CheckBox';
import {setNotificationDetails} from '../utils/notification';
import BASE_URL from '../config';

// ZOD VALIDATION SCHEMA  ------------>
const loginSchema = z.object({
    phone_no: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, {message: 'Phone number must be numeric'}),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginDataType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES -------------->
    const {
        login,
        setLoginData,
        loginData,
        setPhnPass,
        phone_no,
        password,
        setIsRememberMe,
        isRememberMe,
    } = useAuthStore();

    // LOCAL STATES -------------->
    const [rememberMe, setRememberMe] = useState(isRememberMe);

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone_no: phone_no, // '8100365591',
            password: password, //'Pradip@123',
        },
    });

    // Mutation for login ------------------------------------->
    const url = `${BASE_URL}/hru/Labstaffappapi/login`;
    const mutation = useMutation({
        mutationFn: (data: LoginDataType) => postData(url, data),
        onSuccess: (data, variables) => {
            if (data.error_code) {
                Toast.show(`${data?.status}: ${data?.msg}`, Toast.LONG);
            } else {
                setLoginData(variables);
                setNotificationDetails(data?.data?.auth_token);
                console.log(data);
                if (rememberMe) {
                    setIsRememberMe(true);
                    setPhnPass(variables);
                } else {
                    setIsRememberMe(false);
                    setPhnPass({phone_no: '', password: ''});
                }
                login(data?.data);
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

    return (
        <View style={styles.container}>
            <LoginHeroSection />
            <LoginBody>
                <View>
                    <Text style={styles.logInText}>Log In</Text>
                    <Text style={styles.subLoginText}>
                        Sign in to your existing account
                    </Text>
                </View>

                <View style={{marginTop: hp(5)}}>
                    <Controller
                        control={control}
                        name="phone_no"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                // label="Phone No."
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

                    <View style={{height: hp(2)}} />

                    <Controller
                        control={control}
                        name="password"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                // label="Password"
                                placeholder="Enter Password"
                                value={value}
                                onChangeText={onChange}
                                isPassword={true}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.password?.message}
                            />
                        )}
                    />
                </View>

                <View style={{marginTop: hp(2), marginLeft: wp(1)}}>
                    <CheckBox
                        rememberMe={rememberMe}
                        setRememberMe={() => setRememberMe(prev => !prev)}
                        title="Remember Me"
                    />
                </View>

                <BigButton
                    onPress={handleSubmit(onSubmit)}
                    title="LOGIN"
                    loading={mutation.status === 'pending'}
                />

                <View style={{height: hp(5)}} />
            </LoginBody>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logInText: {
        fontSize: wp(8),
        fontWeight: '800',
        color: colors.primary,
        marginTop: hp(5),
    },
    subLoginText: {
        fontSize: wp(4),
        color: colors.darkBlue,
    },
    rememberMeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(2),
    },
});
