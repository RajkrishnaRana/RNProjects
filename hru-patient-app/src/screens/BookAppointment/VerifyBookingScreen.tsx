import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppointmentSummaryCard from '../../components/Cards/AppointmentSummaryCard';
import CustomDropdown from '../../components/CustomDropdown';
import CheckBox from '../../components/CheckBox';
import FilterBox from '../../components/FilterBox';
import UploadSectionCard from '../../components/Cards/UploadSectionCard';
import TextField from '../../components/TextField';
import BigButton from '../../components/BigButton';
import SelectiveFile from '../../components/SelectiveFile';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { BASE_URL } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { useAuthStore } from '../../store/authStore';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import RazorpayCheckout from 'react-native-razorpay';
import SelectOrUploadDocCard from '../../components/Cards/SelectOrUploadDocCard';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../../App';
import Confetti from '../../components/LottieComponent/Confetti';
import { useNavigation } from '../../hooks/useNavigation';
import { useBookingInformation } from '../../store/bookingInformation';
import BackgroundGradient from '../../components/BackgroundGradient';
import { isTab } from '../../utils/isTab';

type VerifyBookingScreenRouteProps = RouteProp<RootStackParamList, 'VerifyBooking'>;

export type FileUpload = {
    Prescription: DocumentPickerResponse[];
    Report: DocumentPickerResponse[];
};

export type PrescriptionOrReport = 'Prescription' | 'Report';

export default function VerifyBookingScreen() {
    const { key } = useRoute<VerifyBookingScreenRouteProps>().params;
    const navigation = useNavigation();

    // GLOBAL STATES -------------------------->
    const token = useAuthStore(s => s.token);
    const { setBookingInformation, setPaymentInfo } = useBookingInformation();

    // LOCAL STATES -------------------->
    const [name, setName] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [newOrHealthValut, setNewOrHealthVault] = useState({
        healthValut: false,
        new: true,
    });
    const [prescriptionOrReport, setPrescriptionOrReport] = useState<PrescriptionOrReport>('Prescription');
    const [doc, setDoc] = useState<FileUpload>({ Prescription: [], Report: [] });
    const [uploadedFileName, setUploadedFileName] = useState({
        Prescription: '',
        Report: '',
    });
    const [healthVaultFilesState, setHealthVaultFilesState] = useState<HealthValutFilesObj>();
    const [symptoms, setSymptoms] = useState('');
    const [paymentMethod, setPaymentMethod] = useState({
        fullPayment: false,
        bookAmountPayment: false,
        disableBookAmountPayment: true,
    });
    const [couponCode, setCouponCode] = useState<string>();
    const [couponDiscount, setCouponDiscount] = useState<any>();
    const [isConfettiVisible, setConfettiVisible] = useState(false);
    const [usePoints, setUsePoints] = useState(false);

    //DATA FETCHING ----------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientbookappointment?key=${key}`;
    const { isPending, error, data } = useQuery({
        queryKey: ['verifyBooking' + key],
        queryFn: async () => {
            const response = await postData(url, { token: token });
            if (response?.status === false) {
                throw new Error(response?.msg || 'Unknown error occurred');
            }
            return response;
        },
        select: data => {
            console.log('Verify Booking', data);
            return data.doc;
        },
    });

    // LOCAL FUNCTIONS ------------------------------------>
    const healthValultFileType = (text: PrescriptionOrReport) => {
        return text === 'Prescription' ? 'patientPrescriptions' : 'patientReports';
    };

    const handleSelectUploadRecords = (text: string) => {
        setNewOrHealthVault({
            healthValut: text == 'Health Vault',
            new: text == 'New Upload',
        });
    };

    const handleFileSelection = (index: number) => {
        setHealthVaultFilesState(prev => {
            const updatedArr = prev?.[healthValultFileType(prescriptionOrReport)]?.map((item, i) => {
                // console.log({i, index});
                return {
                    ...item,
                    isSelected: i === index ? !item.isSelected : item.isSelected,
                };
            });

            return {
                ...prev,
                [healthValultFileType(prescriptionOrReport)]: updatedArr,
            };
        });
    };

    const handlePaymentMethod = (text: string) => {
        setPaymentMethod({
            fullPayment: text == 'Full',
            bookAmountPayment: text == 'Book Amount',
            disableBookAmountPayment: data?.bookingAmount == data?.responseData?.consultationFee,
        });
    };

    const handleBookingConfirmation = async () => {
        try {
            setFinalSubmitLoading(true);
            const selectedPrescriptions = healthVaultFilesState?.patientPrescriptions?.filter(i => i.isSelected) || [];
            const selectedReports = healthVaultFilesState?.patientReports?.filter(i => i.isSelected) || [];

            interface Payload {
                profileId?: any; // Use specific types (e.g., string, number) if known
                doctorId?: any;
                workAddressId?: any;
                uid?: any;
                startTime?: any;
                endTime?: any;
                bookedBy: string;
                consultationMode?: any;
                consultationFee?: any;
                textSymptoms: string;
                fileName?: string;
                reportName?: string;
                reports?: any;
                prescriptions?: any;
                patientNumber: string;
                patientName?: any;
                docTypeOne?: string; // Add optional property
                docTypeTwo?: string; // Add optional property
            }

            const payload: Payload = {
                profileId: name?.id,
                doctorId: data?.responseData?.doctorId,
                workAddressId: data?.responseData?.clinicId,
                uid: data?.responseData?.uid,
                startTime: data?.responseData?.startTime,
                endTime: data?.responseData?.endTime,
                bookedBy: 'PATIENT',
                consultationMode: data?.responseData.consultationMode,
                consultationFee: data?.responseData.consultationFee,
                textSymptoms: symptoms,
                fileName: uploadedFileName.Prescription,
                reportName: uploadedFileName.Report,
                reports: selectedReports,
                prescriptions: selectedPrescriptions,
                patientNumber: `91${data?.patientDetails.mobileNumber}`,
                patientName: name?.name,
            };

            if (doc['Prescription'].length > 0) payload.docTypeOne = 'Prescription';
            if (doc['Report'].length > 0) payload.docTypeTwo = 'Report';

            console.log('Verify booking Payload', payload);

            const formData = new FormData();

            formData.append('formData', JSON.stringify(payload));
            formData.append('token', token);

            if (doc['Prescription'].length > 0) {
                formData.append('healthVaultUploadCount', doc['Prescription'].length);
                for (let i = 0; i < doc['Prescription'].length; i++) {
                    formData.append('healthFiles', {
                        uri: doc['Prescription'][i].uri,
                        type: doc['Prescription'][i].type,
                        name: doc['Prescription'][i].name,
                    });
                }
            }

            if (doc['Report'].length > 0) {
                formData.append('healthVaultUploadReportCount', doc['Report'].length);
                for (let i = 0; i < doc['Report'].length; i++) {
                    formData.append('healthFilesOfReport', {
                        uri: doc['Report'][i].uri,
                        type: doc['Report'][i].type,
                        name: doc['Report'][i].name,
                    });
                }
            }

            const url = `${BASE_URL}/hru/Patientappapi/bookappointment`;
            // const url = 'https://50f2-2401-4900-1c00-7998-cb90-1570-a29d-478e.ngrok-free.app/hru/Patientappapi/bookappointment';
            const res = await postData(url, formData, true);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log(payload);
            console.log(res);

            const payload2 = {
                orderId: res?.appointmentId,
                txnValue: paymentMethod.bookAmountPayment
                    ? data?.bookingAmount
                    : couponDiscount?.discountedConsultFee
                    ? couponDiscount?.discountedConsultFee
                    : data?.responseData.consultationFee,
                paymentType: 'payinFull',
                couponId: couponDiscount?.companyId,
                bookingAmount: data?.bookingAmount,
                isUsedCoupon: couponDiscount?.companyId ? true : false,
                isUsedBonus: usePoints && couponDiscount ? true : false,
                bonusDiscount: data?.usableBonusPoint,
                ...(couponDiscount && { couponDiscount: couponDiscount?.discount }),
            };

            console.log('payload2', payload2);

            const url2 = `${BASE_URL}/init-process-payment-v2.html`;
            // const url2 = 'https://50f2-2401-4900-1c00-7998-cb90-1570-a29d-478e.ngrok-free.app/init-process-payment-v2.html';
            const res2 = await postData(url2, payload2);

            if (!res2.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log(payload2);
            console.log(res2);

            setBookingInformation(payload as any);
            setPaymentInfo(payload2 as any);

            if (res2.doc?.hasOwnProperty('callback_url')) {
                delete res2.doc?.['callback_url'];
            }

            RazorpayCheckout.open(res2.doc)
                .then(async data => {
                    setFinalSubmitLoading(true);
                    console.log(data);
                    // Alert.alert('Payment Successful!');
                    Toast.show('Payment Successfull', Toast.LONG);

                    // const url = `https://50f2-2401-4900-1c00-7998-cb90-1570-a29d-478e.ngrok-free.app/hru/Patientappapi/bookappointmentrzrpcallback`;
                    const url = `${BASE_URL}/hru/Patientappapi/bookappointmentrzrpcallback`;
                    const res = await postData(url, data);

                    if (!res.status) {
                        Toast.show(`${res.msg}`, Toast.SHORT);
                        throw new Error(res.msg);
                    }

                    console.log(res);
                    queryClient.invalidateQueries({
                        queryKey: ['appointmentData'],
                    });
                    navigation.push('PaymentSuccessfull', { type: 'patient' });
                })
                .catch(error => {
                    console.error(`Error: ${error.code} | ${error.description}`);
                    Alert.alert('Payment Failed!');
                })
                .finally(() => {
                    setFinalSubmitLoading(false);
                });
        } catch (e) {
            console.error(e);
        } finally {
            setFinalSubmitLoading(false);
        }
    };

    const handleApplyCouponcode = async () => {
        if (!couponCode && !usePoints && couponDiscount === undefined) {
            Toast.show('Please enter coupon code or use points', Toast.LONG);
            return;
        }

        if (!usePoints && !couponCode && couponDiscount) {
            setCouponDiscount(undefined);
            return;
        }

        try {
            setApplyLoading(true);
            const payload = {
                token: token,
                couponCode: couponCode,
                consultationFee: data?.doctorDetails?.addresses?.consultationFee,
                usedBonusPoints: usePoints ? data?.usableBonusPoint : 0,
                ...(usePoints && { usableBonusPoint: data?.usableBonusPoint }),
                doctorId: data?.doctorDetails?._id,
                clinicId: data?.doctorDetails?.addresses?.id,
            };

            const url = `${BASE_URL}/apply-coupon-referral.json`;
            console.log('applycoupon payload ------------->', payload);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.LONG);
                throw new Error(res.msg);
            }

            console.log('coupon discount res ------>', res);
            setConfettiVisible(true);
            // setTimeout(() => {
            //     setConfettiVisible(false);
            // }, 3000);

            setCouponDiscount(res.doc);
        } catch (error) {
            console.error(error);
        } finally {
            setApplyLoading(false);
        }
    };

    //SIDE EFFECTS ------------------------>
    useEffect(() => {
        initialLoad && setName(data?.patientDetails?.patientOption[0]);
        setInitialLoad(false);
    }, [data, initialLoad]);

    // For Data fetching from patient health vault
    useEffect(() => {
        const fetchHealthVaultFiles = async () => {
            setLoading(true);
            const payload = {
                token: token,
                profileId: name?.id,
            };

            const url = `${BASE_URL}/hru/Patientappapi/healthvaultlist`;
            const res = await queryClient.fetchQuery({
                queryKey: ['healthVaultList' + name?.id],
                queryFn: () => postData(url, payload),
            });

            if (!res.status) {
                Toast.show('Failed to fetch health vault files', Toast.SHORT);
                setLoading(false);
                return;
            }

            let updatedDoc: HealthValutFilesObj = {
                patientPrescriptions: [],
                patientReports: [],
            };

            for (const key of Object.keys(res?.doc)) {
                const updatedData: HealthVaultFile[] =
                    res.doc[key]?.map((item: HealthVaultFile) => ({
                        ...item,
                        isSelected: false,
                    })) || [];

                updatedDoc[key as keyof HealthValutFilesObj] = updatedData;
            }
            // console.log('UpdatedDoc----------', updatedDoc);
            setHealthVaultFilesState(updatedDoc);
            setLoading(false);
        };

        if (newOrHealthValut.healthValut) fetchHealthVaultFiles();
    }, [name, newOrHealthValut]);

    // For the Booking amount or full payment
    useEffect(() => {
        if (data?.bookingAmount !== data?.responseData?.consultationFee) {
            setPaymentMethod({
                fullPayment: false,
                bookAmountPayment: true,
                disableBookAmountPayment: false,
            });
        } else {
            setPaymentMethod({
                fullPayment: true,
                bookAmountPayment: false,
                disableBookAmountPayment: true,
            });
        }
    }, [data]);

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.appointmentSummaryContainer}>
                        <AppointmentSummaryCard data={data} couponDiscount={couponDiscount} paymentMethod={paymentMethod} />
                    </View>

                    <View style={{ marginHorizontal: wp(2) }}>
                        <Text style={styles.header}>Patient Details : </Text>
                        <View style={styles.dropdownContainer}>
                            {/* <Text style={styles.detailHeader}>Appointment For : </Text> */}
                            <CustomDropdown
                                customDropdownStyle={styles.customDropdownStyle}
                                customSelectedTextStyle={styles.customSelectedTextStyle}
                                customPlaceholder="-- Select a patient -- "
                                data={data?.patientDetails?.patientOption}
                                label={null}
                                mode={true}
                                value={name?.id}
                                setValue={setName}
                                customLabelField="name" // Define the field in data representing the label
                                customValueField="id" // Define the field in data representing the value
                            />
                        </View>

                        {name && (
                            <>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: hp(1),
                                    }}
                                >
                                    <Text style={styles.detailHeader}>Upload Records : </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: wp(2),
                                        }}
                                    >
                                        <CheckBox
                                            rememberMe={newOrHealthValut.healthValut}
                                            setRememberMe={() => handleSelectUploadRecords('Health Vault')}
                                            title="Health Vault"
                                        />
                                        <CheckBox
                                            rememberMe={newOrHealthValut.new}
                                            setRememberMe={() => handleSelectUploadRecords('New Upload')}
                                            title="New Upload"
                                        />
                                    </View>
                                </View>

                                <>
                                    {newOrHealthValut.healthValut ? (
                                        <View style={styles.fileList}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <View style={styles.filterBoxContainer}>
                                                    <FilterBox
                                                        name="Prescripton"
                                                        selected={prescriptionOrReport === 'Prescription'}
                                                        onPress={() => setPrescriptionOrReport('Prescription')}
                                                    />
                                                    <FilterBox
                                                        name="Report"
                                                        selected={prescriptionOrReport === 'Report'}
                                                        onPress={() => setPrescriptionOrReport('Report')}
                                                    />
                                                </View>
                                            </View>
                                            {healthVaultFilesState?.[healthValultFileType(prescriptionOrReport)].length ? (
                                                <FlashList
                                                    nestedScrollEnabled={true}
                                                    data={healthVaultFilesState?.[healthValultFileType(prescriptionOrReport)]}
                                                    renderItem={({ item, index }: { item: HealthVaultFile; index: number }) => (
                                                        <SelectiveFile item={item} onPress={() => handleFileSelection(index)} />
                                                    )}
                                                />
                                            ) : loading ? (
                                                <PageLoading />
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: colors.darkGrey,
                                                        fontSize: wp(4),
                                                    }}
                                                >
                                                    No Files Available
                                                </Text>
                                            )}
                                        </View>
                                    ) : (
                                        <SelectOrUploadDocCard
                                            doc={doc}
                                            setDoc={setDoc}
                                            prescriptionOrReport={prescriptionOrReport}
                                            setPrescriptionOrReport={setPrescriptionOrReport}
                                            uploadedFileName={uploadedFileName}
                                            setUploadedFileName={setUploadedFileName}
                                            profileId="dhapfa"
                                        />
                                    )}
                                </>

                                <TextField
                                    label="Describe Your Symptoms / Complaints"
                                    placeholder="Describe Your Symptoms / Complaints"
                                    value={symptoms}
                                    onChangeText={setSymptoms}
                                    customContainerStyle={{
                                        marginVertical: hp(1),
                                    }}
                                    customLabelStyle={styles.customLabelStyle}
                                />

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: wp(3),
                                        marginVertical: hp(1),
                                    }}
                                >
                                    <Text style={styles.detailHeader}>Payment Type : </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: wp(2),
                                        }}
                                    >
                                        {!paymentMethod.disableBookAmountPayment && (
                                            <CheckBox
                                                rememberMe={paymentMethod.bookAmountPayment}
                                                setRememberMe={() => handlePaymentMethod('Book Amount')}
                                                title="Pay Book Amount"
                                            />
                                        )}
                                        <CheckBox
                                            rememberMe={paymentMethod.fullPayment}
                                            setRememberMe={() => handlePaymentMethod('Full')}
                                            title="Pay Full"
                                        />
                                    </View>
                                </View>

                                {paymentMethod.fullPayment && (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginVertical: hp(1),
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TextField
                                                label="Coupon code"
                                                placeholder="Coupon code"
                                                value={couponCode}
                                                onChangeText={setCouponCode}
                                                customContainerStyle={{ width: wp(55) }}
                                                customLabelStyle={styles.customLabelStyle}
                                            />

                                            <BigButton
                                                title="Apply"
                                                onPress={handleApplyCouponcode}
                                                loading={applyLoading}
                                                customStyle={{
                                                    width: wp(30),
                                                    marginTop: hp(0),
                                                    backgroundColor: colors.darkBlue,
                                                }}
                                            />
                                        </View>

                                        <View style={{ marginVertical: isTab ? hp(0) : hp(1) }}>
                                            <CheckBox
                                                rememberMe={usePoints}
                                                setRememberMe={() => setUsePoints(prev => !prev)}
                                                title={`${data?.usableBonusPoint || '0'} points out of ${data?.usableBonusPoint} points can be used`}
                                            />
                                        </View>
                                    </>
                                )}

                                <Text style={styles.paymentHeader}>
                                    {paymentMethod.fullPayment ? 'Total Amount Payble' : 'Booking Amount Payble Now'}:{' '}
                                    <Text
                                        style={{
                                            color: colors.darkBlue,
                                            fontSize: isTab ? wp(2.5) : wp(4.5),
                                        }}
                                    >
                                        ₹
                                        {paymentMethod.fullPayment
                                            ? couponDiscount?.discountedConsultFee || data?.responseData?.consultationFee
                                            : data?.bookingAmount}
                                    </Text>
                                </Text>
                                {paymentMethod.bookAmountPayment && (
                                    <Text style={{ fontSize: isTab ? wp(2) : wp(3), color: 'red', textAlign: 'center', lineHeight: hp(2) }}>
                                        **You will be charged only the booking amount, remaining payment wiil be collected at the clinic
                                    </Text>
                                )}
                                <BigButton
                                    title="Proceed to Book"
                                    onPress={handleBookingConfirmation}
                                    loading={finalSubmitLoading}
                                    customStyle={{ marginTop: hp(0.5) }}
                                />

                                <Confetti
                                    isConfettiVisible={isConfettiVisible}
                                    discountPrice={couponDiscount?.discount}
                                    setIsConfettiVisible={setConfettiVisible}
                                    bookingPrice={couponDiscount?.discountedConsultFee}
                                    consultantFee={data?.responseData?.consultationFee}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // backgroundColor: colors.white,
        paddingHorizontal: wp(3),
        paddingBottom: hp(3),
    },
    appointmentSummaryContainer: {
        marginVertical: hp(1.5),
    },
    header: {
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: 'bold',
        color: colors.black,
    },
    dropdownContainer: {
        flexDirection: 'row',
        marginVertical: hp(0.5),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    detailHeader: {
        fontSize: isTab ? wp(3) : wp(4.1),
        color: colors.black,
        fontWeight: 'bold',
    },
    fileList: {
        height: isTab ? hp(30) : hp(40),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: wp(2),
        marginVertical: hp(1),
        padding: wp(2),
        backgroundColor: colors.white,
    },
    customDropdownStyle: {
        width: wp(90),
        paddingVertical: isTab ? hp(0.5) : hp(1),
        // borderWidth: 1,
        // borderColor: colors.darkBlue,
        backgroundColor: colors.blueWhite,
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
    },
    customSelectedTextStyle: {
        color: colors.darkBlue,
        fontWeight: 'bold',
        fontSize: isTab ? wp(3) : wp(3.7),
    },
    fileSelectContainer: {
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: wp(3),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
    },
    filterBoxContainer: {
        flexDirection: 'row',
        marginBottom: hp(2),
    },
    customLabelStyle: {
        color: colors.darkGrey,
        fontWeight: 'bold',
    },
    paymentHeader: {
        marginTop: hp(3),
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.lightBlack,
        marginBottom: hp(1),
    },
});
