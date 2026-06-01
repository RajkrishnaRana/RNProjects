import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import TextField from '../components/TextField';
import BigButton from '../components/BigButton';
import BackButton from '../components/BackButton';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../api';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '../hooks/useNavigation';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routeTypes';
import {LoginDataType} from './LoginScreen';
import {BASE_URL} from '../config';
import {isTab} from '../utils/isTab';
import TextField2 from '../components/TextField2';

type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

// ZOD VALIDATION SCHEMA  ------------>
const formVerificationSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[0-9]/, 'Password must include at least one number')
            .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character'),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'], // Attach error to the confirmPassword field
    });

type ResetPasswordScreenProps = z.infer<typeof formVerificationSchema>;

export default function ResetPasswordScreen() {
    // CONSTANTS -------------->
    const navigation = useNavigation();
    const {phoneNumber} = useRoute<ResetPasswordScreenRouteProp>().params;

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<ResetPasswordScreenProps>({
        resolver: zodResolver(formVerificationSchema),
    });

    // Mutation for OTP Verification ------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/resetPassword`;
    const mutation = useMutation({
        mutationFn: (data: LoginDataType) => postData(url, data),
        onSuccess: data => {
            if (data.error_code) {
                Toast.show(`${data.status}: ${data.msg}`, Toast.LONG);
            } else {
                navigation.replace('Login');
            }
        },
        onError: error => {
            console.log(error);
            Toast.show('Something went wrong with the API', Toast.LONG);
        },
    });

    // LOCAL FUNCTION -------------->
    function onSubmit(data: ResetPasswordScreenProps) {
        mutation.mutate({phone_no: phoneNumber, password: data.password});
    }

    return (
        <ScrollView style={{flexGrow: 1, backgroundColor: colors.white}}>
            <BackButton />
            <Image source={require('../assets/images/reset-password.png')} style={styles.image} />
            <Text style={styles.resetPassWordText}>Reset Password</Text>
            <Text style={styles.subText}>Set your new password and complete the authentication</Text>

            <View style={styles.textFieldContainer}>
                <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextField2
                            placeholder="New Password"
                            label="New Password"
                            isPassword={true}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur} // Trigger validation onBlur
                            errorValue={errors.password?.message}
                        />
                    )}
                />

                <View style={{height: hp(2)}} />

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextField2
                            placeholder="Confirm Password"
                            label="Confirm Password"
                            isPassword={true}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur} // Trigger validation onBlur
                            errorValue={errors.confirmPassword?.message}
                        />
                    )}
                />

                <BigButton title="SUBMIT" onPress={handleSubmit(onSubmit)} loading={mutation.status === 'pending'} />
            </View>

            <View style={{height: hp(5)}}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        height: isTab ? wp(10) : wp(15),
        width: isTab ? wp(10) : wp(15),
        alignSelf: 'center',
        marginTop: isTab ? hp(15) : hp(10),
    },
    resetPassWordText: {
        fontSize: isTab ? wp(3.5) : wp(5.5),
        color: colors.primary,
        textAlign: 'center',
        marginTop: hp(3),
        fontWeight: 'bold',
    },
    subText: {
        fontSize: isTab ? wp(2) : wp(3.7),
        color: colors.grey,
        textAlign: 'center',
        marginTop: hp(1),
        paddingHorizontal: wp(5),
    },
    textFieldContainer: {
        paddingHorizontal: wp(5),
        marginTop: isTab ? hp(5) : hp(7),
    },
});
