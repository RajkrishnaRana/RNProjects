import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import BackgroundGradient from '../../components/BackgroundGradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../../components/StarRating';
import IconText from '../../components/IconText';
import Octicons from 'react-native-vector-icons/Octicons';
import {getName} from '../../utils';
import CustomDropdown from '../../components/CustomDropdown';
import CheckBox from '../../components/CheckBox';
import {DocumentPickerResponse, pick} from '@react-native-documents/picker';
import FileViewCard from '../../components/Cards/FileViewCard';
import Toast from 'react-native-simple-toast';
import {FlashList} from '@shopify/flash-list';
import TextField from '../../components/TextField';
import BigButton from '../../components/BigButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PageLoading from '../../components/LottieComponent/PageLoading';
import SelectiveFile from '../../components/SelectiveFile';
import {useAuthStore} from '../../store/authStore';
import {BASE_URL} from '../../config';
import {queryClient} from '../../../App';
import {postData} from '../../api';
import RazorpayCheckout from 'react-native-razorpay';
import {useNavigation} from '../../hooks/useNavigation';
import {useBookingInformation} from '../../store/bookingInformation';
import {isTab} from '../../utils/isTab';

const DAYS = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
};

type LabBookingTimingScreenProps = RouteProp<RootStackParamList, 'VerifyLabBooking'>;

export default function VerifyLabBookingScreen() {
    const navigation = useNavigation();
    const {appointmentDates, selectedAppointmentTimings, data} = useRoute<LabBookingTimingScreenProps>().params;
    const LabCardData = data?.responseData?.cartData[0]?.labDetails;
    const PatientAddresses = data?.responseData?.patientAddresses;
    const PatientOption = data?.patientDetails?.patientOption;

    // GLOBAL STATES ----------------------------->
    const {token} = useAuthStore();
    const {setBookingInformation, setPaymentInfo} = useBookingInformation();

    // LOCAL STATES -------------------------------->
    const [name, setName] = useState<{id: string; name: string} | undefined>();
    const [selectedAddress, setSelectedAddress] = useState<number>();

    //For Uploading Doc
    const [newOrHealthValut, setNewOrHealthVault] = useState({
        healthValut: false,
        new: true,
    });
    const [healthVaultFilesState, setHealthVaultFilesState] = useState<HealthVaultFile[]>();
    const [loading, setLoading] = useState(false);
    const [doc, setDoc] = useState<DocumentPickerResponse[]>([]);
    const [uploadedFileName, setUploadedFileName] = useState<string>();
    const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);

    // LOCAL FUNCTIONS ------------------------------>
    const handleDateString = (text: string | undefined) => {
        const originalDate = text?.split(',')?.[1].trim();
        const parts = originalDate?.split(' ');
        const newDate = `${parts?.[0]},${parts?.[1].replace(',', '')}`;
        return newDate;
    };

    const handleSelectUploadRecords = (text: string) => {
        setNewOrHealthVault({
            healthValut: text == 'Health Vault',
            new: text == 'New Upload',
        });
    };

    const handleFileSelection = (index: number) => {
        setHealthVaultFilesState(prev =>
            prev?.map((item: any, i: number) => ({
                ...item,
                isSelected: i === index ? !item.isSelected : item.isSelected,
            }))
        );
    };

    const renderItem = ({item}: {item: DocumentPickerResponse}) => {
        const onPress = () => {
            setDoc(prev => prev.filter(doc => doc.uri !== item.uri));
        };

        return <FileViewCard item={item} onPress={onPress} />;
    };

    async function fileUpload() {
        try {
            const doc = await pick({
                allowMultiSelection: true,
                allowedTypes: [
                    'image/*', // All image formats (JPEG, PNG, etc.)
                    'application/pdf', // PDF files
                    'application/msword', // .doc files
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx files
                ],
            });
            setDoc(prev => [...prev, ...doc]);
        } catch (error) {
            Toast.show('No Documents Selected', Toast.SHORT);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleBookingConfirmation = async () => {
        try {
            setFinalSubmitLoading(true);
            const selectedPrescriptions = healthVaultFilesState?.filter(i => i.isSelected) || [];

            const selectedDate = appointmentDates?.find(i => i.isSelected);
            const selectedSlot = selectedAppointmentTimings[0]?.slots?.find(j => j.isSelected);
            const cartIds = data?.responseData?.cartData?.map((i: any) => i._id);
            const SlotDay = appointmentDates?.find(i => i.isSelected)?.value;

            if ((data?.responseData?.homeCollection || data?.responseData?.patientPickUp) && selectedAddress === undefined) {
                Toast.show('Please select an address for sample collection', Toast.SHORT);
                return;
            }

            if (data?.responseData?.isRxRequire && selectedPrescriptions?.length == 0 && doc?.length == 0) {
                Toast.show(
                    'For this lab test prescription is mandatory, so please upload the prescription or select from health vault ',
                    Toast.SHORT
                );
                return;
            }

            if (doc?.length > 0 && !uploadedFileName) {
                Toast.show('Please enter prescription a name', Toast.SHORT);
                return;
            }

            const url = `${BASE_URL}/hru/Patientappapi/patientbooklabappointment`;
            // const url = 'https://8f27-2401-4900-1c01-299c-4817-fd4b-97ff-17b4.ngrok-free.app/hru/Patientappapi/patientbooklabappointment';
            const payload = {
                profileId: name?.id,
                labId: LabCardData?._id,
                workAddressId: LabCardData?.address?.[0]?._id,
                bookedBy: 'PATIENT',
                fileName: uploadedFileName,
                prescriptions: selectedPrescriptions,
                labTests: data?.labTests,
                patientNumber: `91${data?.patientDetails.mobileNumber}`,
                totalAmount: data?.responseData?.totalAmount + data?.responseData?.pointsDiscount + data?.responseData?.couponDiscount,
                pointsDiscount: data?.responseData?.pointsDiscount || 0,
                couponDiscount: data?.responseData?.couponDiscount || 0,
                payingAmount: data?.responseData?.totalAmount,
                collectionCharge: data?.responseData?.collectionCharge || 0,
                pickupCharges: data?.responseData?.pickupCharges || 0,
                homeCollection: data?.responseData?.homeCollection,
                patientPickUp: data?.responseData?.patientPickUp,
                // patientName: patientName,
                uid: selectedSlot?.uid,
                startTime: selectedSlot?.id,
                endTime: selectedSlot?.endTime,
                slotTime: selectedSlot?.display,
                slotDate: `${handleDateString(SlotDay)}${new Date().getFullYear()}`,
                slotDay: DAYS[SlotDay?.split(',')?.[0] as keyof typeof DAYS],
                cartIds: cartIds,
                ...(data?.responseData?.patientPickUp ||
                    (data?.responseData?.homeCollection && {patientAddressesId: PatientAddresses[selectedAddress as number]?._id})),
                ...(doc?.length > 0 && {docTypeOne: 'Prescription'}),
            };

            console.log('labBookAppointmentPayload', payload);

            const formData = new FormData();
            formData.append('token', token);

            if (doc?.length) {
                formData.append('healthVaultUploadCount', doc?.length);
                for (let i = 0; i < doc?.length; i++) {
                    formData.append('healthFiles', {
                        uri: doc[i].uri,
                        type: doc[i].type,
                        name: doc[i].name,
                    });
                }
            }

            formData.append('formData', JSON.stringify(payload));

            const res = await postData(url, formData, true);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                return;
            }

            console.log('labBookAppointmentResponse', res);

            const payloadForPayment = {
                token: token,
                orderId: res?.appointmentId,
                txnValue: data?.responseData?.totalAmount,
                paymentType: 'payinFull',
                couponId: data?.responseData?.couponId,
                paidAmount: data?.responseData?.totalAmount,
                isUsedCoupon: data?.responseData.couponDiscount ? true : false,
                isUsedBonus: data?.responseData?.pointsDiscount ? true : false,
                ...(data?.responseData?.couponDiscount > 0 && {couponDiscount: data?.responseData.couponDiscount}),
                ...(data?.responseData?.pointsDiscount > 0 && {bonusDiscount: data?.responseData.pointsDiscount}),
            };

            console.log('payloadForPayment', payloadForPayment);

            const url2 = `${BASE_URL}/init-process-payment-v3.html`;
            // const url2 = `${BASE_URL}/hru/Patientappapi/initprocesspaymentforlabtestbook`;
            // const url2 = 'https://651f00dbb2b8.ngrok-free.app/init-process-payment-v3.html';
            const res2 = await postData(url2, payloadForPayment);

            if (!res2.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('Razorpay Init Response', res2);

            setBookingInformation({data: data, name: name} as any);
            setPaymentInfo(payloadForPayment as any);

            if (res2.doc?.hasOwnProperty('callback_url')) {
                delete res2.doc?.['callback_url'];
            }

            RazorpayCheckout.open(res2.doc)
                .then(async data => {
                    setFinalSubmitLoading(true);
                    console.log(data);
                    // Alert.alert('Payment Successful!');
                    Toast.show('Payment Successfull', Toast.LONG);

                    // const url = `https://8f27-2401-4900-1c01-299c-4817-fd4b-97ff-17b4.ngrok-free.app/hru/Patientappapi/booklabappointmentrzrpcallback`;
                    const url = `${BASE_URL}/hru/Patientappapi/booklabappointmentrzrpcallback`;
                    const res = await postData(url, data);

                    if (!res.status) {
                        Toast.show(`${res.msg}`, Toast.SHORT);
                        throw new Error(res.msg);
                    }

                    console.log('Razorpay Response', res);
                    queryClient.invalidateQueries({
                        queryKey: ['labAppointmentData'],
                    });
                    navigation.push('PaymentSuccessfull', {type: 'lab'});
                })
                .catch(error => {
                    console.error(`Error: ${error.code} | ${error.description}`);
                    Alert.alert('Payment Failed!');
                })
                .finally(() => {
                    setFinalSubmitLoading(false);
                });
        } catch (error) {
            console.error(error);
        } finally {
            setFinalSubmitLoading(false);
        }
    };

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

            const updatedData: HealthVaultFile[] =
                res.doc?.patientPrescriptions?.map((item: HealthVaultFile) => ({
                    ...item,
                    isSelected: false,
                })) || [];

            // console.log('UpdatedDoc----------', updatedDoc);
            setHealthVaultFilesState(updatedData);
            setLoading(false);
        };

        if (newOrHealthValut.healthValut) fetchHealthVaultFiles();
    }, [name, newOrHealthValut]);

    return (
        <BackgroundGradient>
            <ScrollView style={{flexGrow: 1, paddingTop: hp(1.5), paddingBottom: hp(2)}} showsVerticalScrollIndicator={false}>
                {/* Lab Card */}
                <View style={styles.labContainer}>
                    {LabCardData?.labProfileImgPath ? (
                        <Image style={styles.image} src={LabCardData?.labProfileImgPath} />
                    ) : (
                        <LinearGradient colors={['orange', 'orange', 'yellow']} style={[styles.image, styles.placeholder]}>
                            <Text style={styles.labPlaceHolderChar}>{LabCardData?.labName?.charAt(0).toUpperCase()}</Text>
                        </LinearGradient>
                    )}

                    <View>
                        <Text style={styles.labName}>{LabCardData?.labName}</Text>

                        {/* Ratings and Reviews */}
                        <View style={{flexDirection: 'row', gap: wp(2), alignItems: 'center'}}>
                            <View style={styles.starsContainer}>
                                <StarRating rating={data?.labratingDetails?.patientRatingToLab || 0} />
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontWeight: 'bold',
                                        fontSize: wp(3.5),
                                    }}>
                                    {data?.patientRatingToLab?.patientRatingToLab || '0'}.0
                                </Text>
                            </View>
                            <Text style={{fontSize: wp(3.2), color: colors.black}}>
                                ({data?.patientRatingToLab?.remarksCount || '0' + ' Feedback'})
                            </Text>
                        </View>

                        {/* Address */}
                        <IconText
                            index={3}
                            text={LabCardData?.address[0]?.locationAddress?.substring(0, 35) + '...'}
                            customTextStyles={{fontSize: wp(3.3), width: wp(85)}}
                        />
                    </View>
                </View>

                {/* Select Address Card */}
                {(data?.responseData?.homeCollection || data?.responseData?.patientPickUp) && (
                    <View style={[styles.labContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                        <Text style={{fontSize: wp(4), fontWeight: 'bold', color: colors.black}}>Select Your Address :</Text>

                        {PatientAddresses?.map((address: any, index: number) => {
                            return (
                                <View style={{flexDirection: 'row', gap: wp(3), alignItems: 'center'}} key={index}>
                                    <TouchableOpacity onPress={() => setSelectedAddress(index)}>
                                        {index === selectedAddress ? (
                                            <Octicons name="check-circle-fill" size={wp(5.2)} color={colors.darkBlue} />
                                        ) : (
                                            <Image source={require('../../assets/icons/circle.png')} style={[styles.rememberMeIcon]} />
                                        )}
                                    </TouchableOpacity>

                                    <View>
                                        <Text style={{fontSize: wp(4), fontWeight: 'bold', color: colors.black}}>
                                            {getName(address?.firstName, address?.middleName, address?.lastName)}
                                        </Text>
                                        <Text style={{fontSize: wp(3.5), color: colors.black}}>{address?.addressLineOne}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Select Your Patient */}
                <View style={styles.dropdownContainer}>
                    <Text style={{fontSize: wp(4), fontWeight: 'bold', color: colors.black}}>Appointment For : </Text>
                    <CustomDropdown
                        customDropdownStyle={styles.customDropdownStyle}
                        customSelectedTextStyle={styles.customSelectedTextStyle}
                        customPlaceholder="-- Select a patient -- "
                        data={PatientOption}
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
                        {/* Upload Documents Section */}
                        <View style={styles.checkboxContainer}>
                            <Text style={styles.detailHeader}>Upload Records : </Text>
                            <View style={{flexDirection: 'row', gap: wp(2)}}>
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

                        {/* Upload Files List */}
                        {newOrHealthValut.healthValut ? (
                            <View style={styles.fileList}>
                                {healthVaultFilesState?.length ? (
                                    <FlashList
                                        nestedScrollEnabled={true}
                                        estimatedItemSize={100}
                                        data={healthVaultFilesState}
                                        renderItem={({item, index}: {item: HealthVaultFile; index: number}) => (
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
                                        }}>
                                        No Files Available
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <View style={styles.fileList}>
                                {doc?.length > 0 ? (
                                    <View style={{marginHorizontal: wp(3)}}>
                                        <View
                                            style={[
                                                {
                                                    height: hp(15),
                                                    marginTop: hp(0),
                                                    backgroundColor: colors.white,
                                                    // paddingHorizontal: wp(3),
                                                    paddingVertical: hp(1),
                                                    borderRadius: wp(3),
                                                },
                                            ]}>
                                            <FlashList
                                                data={doc}
                                                renderItem={renderItem}
                                                estimatedItemSize={20}
                                                keyExtractor={(item, index) => index.toString()}
                                                nestedScrollEnabled
                                            />
                                        </View>

                                        <TextField
                                            placeholder="Enter  File name"
                                            value={uploadedFileName}
                                            onChangeText={setUploadedFileName}
                                            customContainerStyle={styles.textFieldStyle}
                                        />
                                        <Text style={{color: colors.darkGrey, fontSize: wp(2.5), textAlign: 'center'}}>
                                            <Text style={{color: 'red'}}>*</Text>All uploaded files will be consolidated into one pdf with this file
                                            name
                                        </Text>

                                        <View style={styles.uploadOrFileSelect}>
                                            <BigButton
                                                title="Select More Files"
                                                onPress={fileUpload}
                                                customStyle={styles.customButtonStyle}
                                                customTextStyle={{fontSize: wp(4)}}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={[styles.uploadSection]} onPress={fileUpload}>
                                        <FontAwesome name="cloud-upload" size={wp(10)} color={colors.primary} />
                                        <Text style={styles.uploadText}>Upload Prescription / Reports</Text>
                                        <Text style={styles.uploadHint}>Tap to Upload your report’s images 1 or more (jpg, pdf, png)</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Total Amount Payble Section */}
                        <Text style={styles.paymentHeader}>
                            'Total Amount Payble :{' '}
                            <Text
                                style={{
                                    color: colors.darkBlue,
                                    fontSize: wp(4.5),
                                }}>
                                ₹{data?.responseData?.totalAmount}
                            </Text>
                        </Text>

                        <BigButton
                            title="Proceed to Book"
                            onPress={handleBookingConfirmation}
                            loading={finalSubmitLoading}
                            customStyle={{marginTop: hp(0.5), marginBottom: hp(3), marginHorizontal: wp(5)}}
                        />
                    </>
                )}
            </ScrollView>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    labContainer: {
        marginHorizontal: wp(3),
        marginBottom: hp(2),
        backgroundColor: colors.white,
        elevation: 2,
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    image: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(10),
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labPlaceHolderChar: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: colors.black,
    },
    labName: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: isTab ? wp(3) : wp(5),
        width: wp(48),
    },
    starsContainer: {
        borderRadius: wp(2),
        paddingVertical: wp(1),
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
    },
    rememberMeIcon: {
        width: wp(5),
        height: wp(5),
    },
    dropdownContainer: {
        marginBottom: hp(2),
        marginHorizontal: wp(3),
        gap: hp(0.5),
    },
    customDropdownStyle: {
        width: wp(94),
        paddingVertical: hp(1),
        backgroundColor: colors.blueWhite,
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
    },
    customSelectedTextStyle: {
        color: colors.darkBlue,
        fontWeight: 'bold',
        fontSize: wp(3.7),
    },
    detailHeader: {
        fontSize: wp(4.1),
        color: colors.black,
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp(0.5),
        marginHorizontal: wp(4),
    },
    fileList: {
        height: hp(33),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: wp(2),
        marginVertical: hp(1),
        padding: wp(2),
        backgroundColor: colors.white,
        marginHorizontal: wp(3),
    },
    uploadSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(3),
        paddingHorizontal: wp(3),
        borderColor: colors.grey,
        borderRadius: wp(5),
    },
    uploadText: {
        fontSize: wp(4),
        fontWeight: 'bold',
        marginTop: hp(1),
        textAlign: 'center',
        color: colors.black,
    },
    uploadHint: {
        fontSize: wp(3.5),
        color: 'gray',
        marginTop: hp(0.5),
        textAlign: 'center',
    },
    textFieldStyle: {
        marginTop: hp(1),
        marginBottom: hp(1),
    },
    uploadOrFileSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(1),
    },
    customButtonStyle: {
        width: wp(50),
        marginTop: hp(1),
        paddingVertical: hp(1),
    },
    paymentHeader: {
        marginTop: hp(3),
        fontSize: wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.lightBlack,
        marginBottom: hp(1),
    },
});
