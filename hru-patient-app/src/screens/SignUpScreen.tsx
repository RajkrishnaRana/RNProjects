import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import LoginBody from '../components/LoginBody';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TextField from '../components/TextField';
import BigButton from '../components/BigButton';
import SignUpPrompt from '../components/SignUpPrompt';
import {useNavigation} from '../hooks/useNavigation';
import dayjs from 'dayjs';
import {DateType} from 'react-native-ui-datepicker';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {BASE_URL} from '../config';
import {postData} from '../api';
import Toast from 'react-native-simple-toast';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routeTypes';
import {useSignUpStore} from '../store/signUpStore';
import DatePickerModal from '../components/Modal/DatePickerModal';
import GenderRadioButton from '../components/GenderRadioButton';
import LinearGradient from 'react-native-linear-gradient';
import TextField2 from '../components/TextField2';
import CustomDropdown from '../components/CustomDropdown';
import {bloodGroup} from '../common/bloodGroup';
import {isTab} from '../utils/isTab';

type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'Signup'>;

// ZOD VALIDATION SCHEMAS ------------>
const initialSignupSchema = z.object({
    firstName: z.string().nonempty('First name is required'),
    // middleName: z.string().optional(),
    lastName: z.string().nonempty('Last name is required'),
    phone_no: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, {message: 'Phone number must be numeric'}),
});

const fullSignupSchema = z
    .object({
        firstName: z.string().nonempty('First name is required'),
        middleName: z.string().optional(),
        lastName: z.string().nonempty('Last name is required'),
        phone_no: z
            .string()
            .length(10, 'Phone No. must be 10 digits')
            .regex(/^\d{10}$/, {message: 'Phone number must be numeric'}),
        email: z.string().email('Please enter a valid email').optional(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]+$/,
                'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%?&)'
            ),
        confirmPassword: z.string().nonempty('Confirm password is required'),
        referralcode: z.string().optional(),
        bloodGroup: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type InitialSignUpDataType = z.infer<typeof initialSignupSchema>;
export type FullSignUpDataType = z.infer<typeof fullSignupSchema>;

export default function SignUpScreen() {
    const navigation = useNavigation();
    const {isOtpVerified} = useRoute<SignUpScreenRouteProp>().params;

    // GLOBAL STATES ---------------------------------->
    const {setIsSignUp, firstName, lastName, mobile, _id, profiles} = useSignUpStore();

    // LOCAL STATES ---------------------------->
    const [checked, setChecked] = useState<string | undefined>();
    const [dob, setDob] = useState<DateType>();
    const [loading, setLoading] = useState(false);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState<any>();

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<FullSignUpDataType>({
        resolver: zodResolver(isOtpVerified ? fullSignupSchema : initialSignupSchema),
        defaultValues: {
            firstName: (isOtpVerified && firstName) || '',
            lastName: (isOtpVerified && lastName) || '',
            phone_no: (isOtpVerified && mobile) || '',
        },
    });

    // LOCAL FUNCTIONS ----------------------->
    async function onSubmit(data: InitialSignUpDataType) {
        try {
            setLoading(true);
            const url = `${BASE_URL}/send-otp-to-patient.json`;
            const payload = {
                firstName: data.firstName,
                // middleName: data.middleName,
                lastName: data.lastName,
                mobile: data.phone_no,
                userType: 'PATIENT',
                savedStep: 1,
            };

            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log(res);

            setIsSignUp(data.firstName, data.lastName, data.phone_no, res?.doc?._id);
            navigation.push('OtpScreen', {
                type: 'signup',
                nextRoute: 'SuccessfullSignup',
            });
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit2(data: FullSignUpDataType) {
        if (!checked) {
            Toast.show('Please select gender', Toast.SHORT);
            return;
        }

        if (!dob) {
            Toast.show('Please select date of birth', Toast.SHORT);
            return;
        }

        try {
            setLoading(true);
            const url = `${BASE_URL}/patient-basic-details-register.json`; // Adjust URL as needed
            const payload = {
                _id: _id,
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                mobile: data.phone_no,
                email: data.email,
                password: data.password,
                cPassword: data.confirmPassword,
                dob: dayjs(dob).format(),
                gender: checked === 'MALE' ? 'MALE' : 'FEMALE',
                savedStep: 2,
                refCode: data.referralcode,
                profileId: profiles[0]?.id,
                profileCreatedAt: profiles[0]?.createdAt,
                profileCreatedBy: profiles[0]?.createdBy,
                bloodGroup: selectedBloodGroup?.label,
            };

            console.log('userSignup payload', payload);

            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log(res);

            // Navigate to success screen
            reset({
                firstName: '',
                lastName: '',
                phone_no: '',
                email: '',
                password: '',
                confirmPassword: '',
                middleName: '',
                referralcode: '',
                bloodGroup: '',
            }); // to clear out all the values from the form
            navigation.navigate('SuccessfullSignup');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{flex: 1}}>
            {/* <LoginHeroSection /> */}

            <LoginBody
                customStyle={{
                    paddingHorizontal: wp(3),
                }}>
                {!isOtpVerified && (
                    <LinearGradient
                        colors={[colors.white, colors.white]}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 1}}
                        style={[styles.imageContainer, {height: isTab ? wp(25) : wp(35), width: isTab ? wp(25) : wp(35)}]}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={{height: isOtpVerified ? 54 : 48, width: isOtpVerified ? 28 : 80}}
                        />
                    </LinearGradient>
                )}

                <View>
                    {/* <Text style={styles.logInText}>Sign Up</Text> */}
                    <Text style={[styles.subLoginText, isOtpVerified && {marginTop: hp(6)}]}>
                        {isOtpVerified ? 'Complete your profile' : 'Create your new account'}
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: isOtpVerified ? hp(2) : hp(6),
                        gap: hp(2),
                        backgroundColor: isOtpVerified ? colors.white : undefined,
                        paddingVertical: hp(2),
                        paddingHorizontal: wp(3),
                        borderRadius: wp(3),
                    }}>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                placeholder="First Name"
                                isNecessary
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                editable={!isOtpVerified}
                                errorValue={errors.firstName?.message}
                            />
                        )}
                    />

                    {isOtpVerified && (
                        <Controller
                            control={control}
                            name="middleName"
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextField
                                    placeholder="Middle Name"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur} // Trigger validation onBlur
                                    errorValue={errors.middleName?.message}
                                />
                            )}
                        />
                    )}

                    <Controller
                        control={control}
                        name="lastName"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                placeholder="Last Name"
                                isNecessary
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                editable={!isOtpVerified}
                                errorValue={errors.lastName?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="phone_no"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                placeholder="Mobile No."
                                isNecessary
                                value={value}
                                isNumeric={true}
                                onChangeText={text => {
                                    if (text.length <= 10) {
                                        onChange(text); // Update only if length <= 10
                                    }
                                }}
                                editable={!isOtpVerified}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.phone_no?.message}
                            />
                        )}
                    />

                    {isOtpVerified && (
                        <>
                            {/* <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextField
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur} // Trigger validation onBlur
                                        errorValue={errors.email?.message}
                                    />
                                )}
                            /> */}

                            <CustomDropdown
                                customPlaceholder="Select Blood Group"
                                data={bloodGroup}
                                customLabelField="label"
                                customValueField="id"
                                value={selectedBloodGroup}
                                setValue={setSelectedBloodGroup}
                                customDropdownStyle={[styles.dropdown]}
                                customSelectedTextStyle={styles.dropDownSelectedText}
                            />

                            {/* <Controller
                                control={control}
                                name="bloodGroup"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextField
                                        placeholder="Enter Blood Group"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur} // Trigger validation onBlur
                                        errorValue={errors.bloodGroup?.message}
                                    />
                                )}
                            /> */}

                            <View style={{flexDirection: 'row', gap: wp(5)}}>
                                <GenderRadioButton checked={checked} setChecked={setChecked} />

                                <DatePickerModal date={dob} setDate={setDob} customStyle={{width: wp(40)}} />
                            </View>

                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextField2
                                        placeholder="Enter Password"
                                        isNecessary
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur} // Trigger validation onBlur
                                        isPassword={true}
                                        errorValue={errors.password?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextField2
                                        placeholder="Re Enter Pasword"
                                        isNecessary
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur} // Trigger validation onBlur
                                        isPassword={true}
                                        errorValue={errors.confirmPassword?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="referralcode"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextField
                                        placeholder="Enter Referral code"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur} // Trigger validation onBlur
                                        errorValue={errors.referralcode?.message}
                                    />
                                )}
                            />
                        </>
                    )}

                    <BigButton
                        onPress={handleSubmit(isOtpVerified ? onSubmit2 : onSubmit)}
                        title={isOtpVerified ? 'SAVE' : 'SAVE & NEXT'}
                        loading={loading}
                        customStyle={{marginTop: hp(2)}}
                    />

                    <SignUpPrompt onPress={() => navigation.navigate('Login')} primaryText="Already have an account ? " linkText="LOG IN" />
                </View>

                <View style={{height: hp(5)}} />
            </LoginBody>
        </View>
    );
}

const styles = StyleSheet.create({
    logInText: {
        fontSize: wp(8),
        fontWeight: '800',
        color: colors.primary,
        marginTop: hp(3),
    },
    subLoginText: {
        marginTop: hp(2),
        fontSize: isTab ? wp(4) : wp(5),
        color: colors.darkGrey,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label: {
        fontSize: wp(3.5),
        color: colors.black,
        marginBottom: 5,
    },
    dobContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        // marginBottom: 15,
        paddingHorizontal: wp(2),
    },
    input2: {
        fontSize: wp(4),
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: wp(5),
        padding: wp(3),
        margin: wp(4),
    },
    imageContainer: {
        marginTop: hp(10),
        alignItems: 'center',
        justifyContent: 'center',
        height: wp(22),
        width: wp(22),
        alignSelf: 'center',
        borderRadius: wp(30),
        backgroundColor: colors.white,
        borderWidth: wp(0.5),
        borderColor: colors.primary,
    },
    logo: {
        width: 54,
        height: 28,
        alignSelf: 'center',
        // marginTop: hp(7),
    },
    dropdown: {
        width: wp(88),
        height: isTab ? hp(4) : hp(5),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: wp(3),
        backgroundColor: colors.white,
    },
    dropDownSelectedText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        // fontWeight: 'bold',
        paddingLeft: isTab ? wp(1) : wp(2),
    },
});
