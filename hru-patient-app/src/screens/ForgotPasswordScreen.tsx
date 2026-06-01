import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextField from '../components/TextField';
import BigButton from '../components/BigButton';
import SignUpPrompt from '../components/SignUpPrompt';
import { useNavigation } from '../hooks/useNavigation';
import BackButton from '../components/BackButton';
import Toast from 'react-native-simple-toast';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { postData } from '../api';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BASE_URL } from '../config';
import { isTab } from '../utils/isTab';

// ZOD VALIDATION SCHEMA  ------------>
const forgotPasswordSchema = z.object({
    phone_no: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, { message: 'Phone number must be numeric' }),
});
export type ForgotPasswordDataType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordDataType>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    // Mutation for Forgot Password ------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/forgotPassword`;
    const mutation = useMutation({
        mutationFn: (data: ForgotPasswordDataType) => postData(url, data),
        onSuccess: (data, variables) => {
            if (data.error_code) {
                Toast.show(`${data.status}: ${data.msg}`, Toast.LONG);
            } else {
                navigation.push('OtpScreen', { phoneNumber: variables.phone_no });
            }
        },
        onError: error => {
            console.log(error);
            Toast.show('Something went wrong with the API', Toast.LONG);
        },
    });

    // ForgotPassword Handler ------------------------------------->
    function onSubmit(data: ForgotPasswordDataType) {
        mutation.mutate(data);
    }

    function handleSignUpPrompt() {
        navigation.push('Signup', { isOtpVerified: false });
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Image source={require('../assets/images/security.png')} style={styles.img} />
            <Text style={styles.forgotPassText}>Forgot Password</Text>
            <Text style={styles.subText}>Set a new password for your profile here</Text>

            <View style={styles.textFieldContainer}>
                <Controller
                    control={control}
                    name="phone_no"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            customLabelStyle={styles.textField}
                            placeholder="Enter Phone No."
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

                <BigButton onPress={handleSubmit(onSubmit)} title="SUBMIT" loading={mutation.status === 'pending'} customStyle={styles.button} />

                <SignUpPrompt onPress={handleSignUpPrompt} primaryText="Don't have an account ? " linkText="SIGN UP" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    forgotPassText: {
        fontSize: isTab ? wp(3.5) : wp(5.5),
        color: colors.primary,
        textAlign: 'center',
        marginTop: isTab ? hp(3) : hp(5),
        fontWeight: 'bold',
    },
    img: {
        height: isTab ? wp(15) : wp(30),
        width: isTab ? wp(15) : wp(30),
        alignSelf: 'center',
        marginTop: hp(15),
    },
    subText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.grey,
        textAlign: 'center',
        marginTop: hp(1),
    },
    textFieldContainer: {
        marginTop: hp(3),
        paddingHorizontal: wp(5),
    },
    textField: {
        color: colors.grey,
        fontSize: isTab ? wp(3) : wp(4),
    },
    button: {
        marginTop: hp(3),
    },
});
