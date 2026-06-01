import {
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routes';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import LabTestNameCard from '../components/Card/LabTestNameCard';
import {Details} from '../components/Details';
import {getName} from '../utils';
import moment from 'moment';
import TextField from '../components/Textfield';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Bigbutton from '../components/Buttons/Bigbutton';
import {useMutation, useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import Toast from 'react-native-simple-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '../hooks/useNavigation';
import {useAuthStore} from '../store/authStore';
import {queryClient} from '../../App';
import CustomDropdown from '../components/CustomDropdown';
import BackgroundGradient from '../components/BackgroundGradient';
import BASE_URL from '../config';

type OrderDetailsScreenRouteProps = RouteProp<
    RootStackParamList,
    'Order Details'
>;

interface CustomerStatus {
    _id: string;
    createdAt: string; // or Date if you prefer to work with Date objects
    isActive: boolean;
    name: string;
    _index: number;
}

// ZOD VALIDATION SCHEMA  ----------------->
const submitSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});
export type SubmitDataType = z.infer<typeof submitSchema>;

export default function OrderDetailsScreen() {
    const navigation = useNavigation();
    const {item} = useRoute<OrderDetailsScreenRouteProps>().params;
    console.log(item);

    // GLOBAL STATES -------------------------->
    const {loginData, login} = useAuthStore();

    // LOCAL STATES ------------------->
    const [isOtpVerified, setOtpVerified] = useState(
        item?.otpVerified || false,
    );
    const [isLoading, setLoading] = useState(false);
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [reason, setReason] = useState<CustomerStatus>();

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<SubmitDataType>({
        resolver: zodResolver(submitSchema),
    });

    // Query for Not Collected Orders Reason ---------------->
    const url = `${BASE_URL}/hru/Labstaffappapi/getreasondetails`;
    const {isPending, error, data} = useQuery({
        queryKey: ['notCollectedOrdersReason'],
        queryFn: () => postData(url, {}),
    });

    // LOCAL FUNCTIONS -------------------->
    const patientName = getName(
        item.patientDetails?.firstName,
        item.patientDetails?.middleName,
        item.patientDetails?.lastName,
    );

    const formattedDate = moment(item?.appointmentDetails?.startTime).format(
        'D MMM, YYYY',
    );

    const collectionAddress = item?.collectionAddressDetails;

    // Verify OTP or submit function ----------------------->
    const onSubmit = async (data: {otp: string}) => {
        try {
            setLoading(true);
            const payloadForOtp = {
                appointmentId: item.appointmentId,
                phlebotomist: item?.phlebotomist,
                otp: data.otp,
            };

            const verifyOtpUrl = `${BASE_URL}/hru/Labstaffappapi/staffverifyotp`;
            const res = await postData(verifyOtpUrl, payloadForOtp);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.LONG);
                throw new Error(res.msg);
            }

            Toast.show('OTP verified successfully', Toast.SHORT);

            const payloadForSubmit = {
                appointmentId: item.appointmentId,
                phlebotomist: item?.phlebotomist,
                sampleCollectionStatus: true,
                sampleCollectedDate: new Date(),
                status: 5,
            };

            const sampleUrl = `${BASE_URL}/hru/Labstaffappapi/savesamplecollection`;
            const result = await postData(sampleUrl, payloadForSubmit);
            if (!result.status) {
                Toast.show(`${result.msg}`, Toast.SHORT);
                throw new Error(result.msg);
            }

            Toast.show('Test Result Submitted successfully', Toast.SHORT);

            queryClient.invalidateQueries({
                queryKey: ['phlebotomistData'],
            });
            navigation.goBack();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Call with patient mobile Number function
    const callNumber = (phone: string) => {
        let phoneNumber = phone;

        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        } else {
            phoneNumber = `tel:${phone}`;
        }

        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };

    // To open google map
    const goToMap = (coordinates: [number, number]) => {
        const url = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
        Linking.openURL(url);
    };

    const notCollectedOrderSubmit = async () => {
        if (!reason) {
            Toast.show(
                'Please select a reason for not collection',
                Toast.SHORT,
            );
            return;
        }

        try {
            setSubmitLoading(true);
            const payload = {
                appointmentId: item.appointmentId,
                phlebotomist: item?.phlebotomist,
                sampleCollectionStatus: false,
                status: 6,
                reason: reason?.name,
                reasonDate: new Date(),
            };
            const url = `${BASE_URL}/hru/Labstaffappapi/savesamplecollection`;
            const res = await postData(url, payload);
            if (!res.status) {
                Toast.show(`${res?.status}: ${res?.msg}`, Toast.SHORT);
                throw new Error(res?.msg);
            }
            queryClient.invalidateQueries({
                queryKey: ['phlebotomistData'],
            });
            navigation.goBack();
        } catch (error) {
            Toast.show('Something went wrong', Toast.LONG);
            console.error(error);
        } finally {
            setSubmitLoading(false);
        }
    };

    // SIDE EFFECTS ------------------------------------->
    // useEffect(() => {
    //     setReason(data?.docs[0]);
    // }, [data]);

    return (
        <BackgroundGradient>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: hp(1),
                    paddingBottom: hp(25),
                }}>
                {/* TEST LIST */}
                <View style={styles.testListsContainer}>
                    <Text style={styles.headingText}>List of Tests :</Text>

                    <View style={styles.labtestNameContainer}>
                        {item?.appointmentDetails?.labTests?.map(
                            (test, index) => {
                                return (
                                    <LabTestNameCard key={index} test={test} />
                                );
                            },
                        )}
                    </View>
                </View>

                {/* PATIENT DETAILS */}
                <View style={[styles.testListsContainer]}>
                    <Text style={styles.headingText}>Patient Details :</Text>

                    <View style={{marginLeft: wp(2), marginBottom: hp(1)}}>
                        <Details
                            header="Collection Address"
                            details={`${
                                collectionAddress?.collectionAddress || ''
                            }, ${
                                collectionAddress?.collectionAddressPin || ''
                            }`}
                        />
                        <Details
                            header="Mobile Number"
                            details={item.patientDetails?.mobileNumber}
                        />
                        <Details header="Patient Name" details={patientName} />
                        <Details
                            header="HRU Id"
                            details={item.patientDetails?.hruId}
                        />
                        <Details header="Order Date" details={formattedDate} />
                    </View>

                    <View style={styles.buttonContainer}>
                        {/* Location button availabilty */}
                        {item?.collectionAddressDetails?.locationInfo
                            ?.coordinates && (
                            <Bigbutton
                                title={
                                    <MaterialIcons
                                        name="location-pin"
                                        color={colors.white}
                                        size={wp(5)}
                                    />
                                }
                                onPress={() =>
                                    goToMap(
                                        item?.collectionAddressDetails
                                            ?.locationInfo?.coordinates as [
                                            number,
                                            number,
                                        ],
                                    )
                                }
                                customStyle={styles.phoneButton}
                                customTextStyle={{fontSize: wp(4)}}
                            />
                        )}

                        <Bigbutton
                            title={
                                <IoniconsIcons
                                    name="call"
                                    color={colors.white}
                                    size={wp(5)}
                                />
                            }
                            onPress={() =>
                                callNumber(
                                    item.patientDetails?.mobileNumber || '',
                                )
                            }
                            customStyle={styles.phoneButton}
                            customTextStyle={{fontSize: wp(4)}}
                        />
                    </View>
                </View>

                {/* SUBMIT OTP */}
                <View style={styles.testListsContainer}>
                    <Text style={styles.headingText}>
                        Submit Booking Confirmation No.
                    </Text>

                    <Controller
                        control={control}
                        name="otp"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                placeholder="Enter Booking Confirmation No."
                                value={isOtpVerified ? 'OTP Verified' : value}
                                isNumeric={true}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                editable={isOtpVerified ? false : true}
                                errorValue={errors.otp?.message}
                                customTextInputContainerStyle={
                                    styles.customTextInput
                                }
                            />
                        )}
                    />

                    <Bigbutton
                        title={'Submit'}
                        onPress={handleSubmit(onSubmit)}
                        customStyle={styles.customButton}
                        loading={isLoading}
                    />
                </View>

                {/* NOT COLLECTION REASON */}
                <View style={styles.testListsContainer}>
                    {item?.sampleCollectionStatus !== false ? (
                        <>
                            <Text style={styles.headingText}>
                                Select Your Reason for not collecting sample:
                            </Text>

                            {data?.docs?.length > 0 ? (
                                <>
                                    <CustomDropdown
                                        customDropdownStyle={
                                            styles.customTextInputD
                                        }
                                        customSelectedTextStyle={
                                            styles.customDropdownText
                                        }
                                        data={data?.docs}
                                        label={null}
                                        value={reason?._id as string}
                                        setValue={setReason}
                                        customLabelField="name" // Define the field in data representing the label
                                        customValueField="_id" // Define the field in data representing the value
                                    />

                                    <Bigbutton
                                        title="Submit"
                                        onPress={notCollectedOrderSubmit}
                                        customStyle={styles.customButton}
                                        loading={isSubmitLoading}
                                    />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.collectionText}>
                                        No Reason Found
                                    </Text>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.collectionText}>
                                Reason for not collection is submitted
                            </Text>
                        </>
                    )}
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    testListsContainer: {
        marginHorizontal: wp(3),
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(5),
        marginVertical: hp(0.8),
    },
    headingText: {
        fontSize: wp(5),
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: hp(1),
        marginLeft: wp(1),
    },
    labtestNameContainer: {
        paddingHorizontal: wp(1),
        flexDirection: 'row',
        gap: hp(1.5),
        marginBottom: hp(0.5),
        flexWrap: 'wrap',
    },
    phoneButton: {
        marginTop: hp(2),
        width: wp(25),
        alignSelf: 'center',
        paddingVertical: hp(0.75),
    },
    customTextInput: {
        // borderWidth: 0,
        boxShadow: colors.primaryShadowColor2,
        height: 'auto',
        marginTop: hp(1),
    },
    customButton: {
        marginTop: hp(2),
        width: wp(50),
        alignSelf: 'center',
        paddingVertical: hp(1),
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(4),
    },
    customDropdownText: {
        fontSize: wp(4),
        color: colors.black,
        fontWeight: 'bold',
    },
    collectionText: {
        fontSize: wp(4),
        color: colors.darkGrey,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    customTextInputD: {
        boxShadow: colors.primaryShadowColor2,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
        borderRadius: wp(5),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
    },
});
