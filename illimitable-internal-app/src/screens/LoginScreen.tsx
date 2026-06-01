import {ScrollView, StyleSheet, Text, View, Image, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import {Colors} from '../common/colors';
import {getUniqueId} from 'react-native-device-info';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TextField from '../components/TextField';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import BigButton from '../components/buttons/BigButton';
import {useAuthStore} from '../store/authStore';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../utils/apiHelper';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {setNotificationDetails} from '../services/notificationServices';
import {useNavigation} from '../hooks/useNavigation';

// ZOD VALIDATION SCHEMA  ------------>
const loginSchema = z.object({
    email: z.string().email('Email must be a valid email address'),
    totp: z.string().length(6, {message: 'OTP must be exactly 6 characters long'}),
});
export type LoginDataType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------->
    const {login, setDeviceId, email, setTokens} = useAuthStore();

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: email || '',
        },
    });

    // Mutation for login ------------------------------------->
    const url = 'https://illimitable.in/app/mobile/login-internal-app.json';
    const mutation = useMutation({
        mutationFn: async (data: LoginDataType) => {
            try {
                const id = await getUniqueId();
                setDeviceId(id);
                console.log({
                    ...data,
                    deviceId: id,
                    // deviceId: 'f4f81fbde6fd0559',
                    // deviceId: '2c379396bac6a91c', // Saumalya Device Id
                });

                return postData(url, {
                    ...data,
                    deviceId: id,
                    // deviceId: 'f4f81fbde6fd0559',
                    // deviceId: '2c379396bac6a91c',
                });
            } catch (error) {
                return Promise.reject(error); // Reject the promise if there's an error
            }
        },
        onSuccess: async data => {
            // console.log(data);
            if (data.status === false) {
                Toast.show({
                    type: 'error',
                    text1: data.msg || 'Error while login, please try again',
                    visibilityTime: 4000,
                });
                return;
            }

            // Toast.show({
            //     type: 'success',
            //     text1: 'Login successful',
            //     visibilityTime: 4000,
            // });
            login({...data?.doc});
            setTokens(data?.doc?.token);
            setNotificationDetails(data?.doc?.token);
            // console.log(data?.doc);
            navigation.replace('Home');
        },
        onError: error => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error ? `${error}` : 'Error while loging, please try again',
                visibilityTime: 4000,
            });
        },
    });

    // LOCAL FUNCTIONS ------------------->
    const onSubmit = async (data: LoginDataType) => {
        mutation.mutate(data);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[Colors.LIGHT_BLUE, Colors.PRIMARY, Colors.PRIMARY]} style={styles.headerContainer}>
                <Image source={require('../assets/images/icpl.png')} style={styles.headerImg} />
            </LinearGradient>

            <KeyboardAvoidingView behavior="padding">
                <ScrollView style={styles.inputContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                    <View style={{marginBottom: hp(4)}}>
                        <Text style={styles.headerText}>Welcome Back</Text>
                        <Text style={styles.headerBodyText}>Login with your email</Text>
                    </View>

                    <Controller
                        control={control}
                        name="email"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                name="email"
                                label="Email"
                                placeholder="Enter your Email"
                                value={value}
                                setValue={setValue}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.email?.message}
                            />
                        )}
                    />

                    <View style={{height: hp(2)}} />

                    <Controller
                        control={control}
                        name="totp"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                name="totp"
                                label="OTP"
                                placeholder="Enter OTP"
                                value={value}
                                setValue={setValue}
                                isNumeric={true}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.totp?.message}
                            />
                        )}
                    />

                    <BigButton
                        title="Login"
                        onPress={handleSubmit(onSubmit)}
                        loading={mutation.status === 'pending'}
                        customMarginTop={{marginBottom: hp(7)}}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    headerContainer: {
        paddingHorizontal: wp(3),
        height: hp(30),
    },
    headerImg: {
        width: wp(70),
        height: hp(7),
        marginTop: hp(10),
        alignSelf: 'center',
    },
    headerText: {
        color: Colors.PRIMARY,
        fontSize: wp(7),
        fontWeight: 'bold',
        // textAlign: 'center',
    },
    headerBodyText: {
        color: Colors.PRIMARY,
        // textAlign: 'center',
    },
    inputContainer: {
        // zIndex: 1,
        paddingHorizontal: wp(5),
        paddingTop: hp(5),
        borderTopRightRadius: wp(7), // Apply borderRadius
        borderTopLeftRadius: wp(7),
        marginTop: -hp(6),
        backgroundColor: Colors.WHITE,
        paddingBottom: hp(10),
    },
});
