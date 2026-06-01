import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DocumentPickerResponse, pick} from '@react-native-documents/picker';
import Toast from 'react-native-simple-toast';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import CustomDropdown from '../../components/CustomDropdown';
import BackgroundGradient from '../../components/BackgroundGradient';
import CheckBox from '../../components/CheckBox';
import PageLoading from '../../components/LottieComponent/PageLoading';
import {FlashList} from '@shopify/flash-list';
import SelectiveFile from '../../components/SelectiveFile';
import {useAuthStore} from '../../store/authStore';
import {BASE_URL} from '../../config';
import {queryClient} from '../../../App';
import {postData} from '../../api';
import TextField from '../../components/TextField';
import FileViewCard from '../../components/Cards/FileViewCard';
import BigButton from '../../components/BigButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '../../hooks/useNavigation';

type PrescriptionUploadScreenProps = RouteProp<RootStackParamList, 'PrescriptionUploadScreen'>;

export default function PrescriptionUploadScreen() {
    const {data} = useRoute<PrescriptionUploadScreenProps>().params;
    console.log(data);
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------->
    const {token} = useAuthStore();

    // LOCAL STATES --------------------------->
    const [name, setName] = useState<any>();
    const [newOrHealthValut, setNewOrHealthVault] = useState({
        healthValut: false,
        new: true,
    });
    const [healthVaultFilesState, setHealthVaultFilesState] = useState<HealthVaultFile[]>();
    const [loading, setLoading] = useState(false);
    const [fileUploadLoading, setFileUploadLoading] = useState(false);
    const [doc, setDoc] = useState<DocumentPickerResponse[]>([]);
    const [uploadedFileName, setUploadedFileName] = useState<string>();

    // LOCAL FUNCTIONS ------------------------------>
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

    const handleUpload = async () => {
        if (!uploadedFileName || uploadedFileName === '') {
            Toast.show('Please enter file name', Toast.SHORT);
            return;
        }

        try {
            setFileUploadLoading(true);
            const prescriptions = healthVaultFilesState?.filter((item: any) => item.isSelected) || [];

            if (prescriptions.length === 0 && doc.length === 0) {
                Toast.show('Please select at least one file', Toast.SHORT);
                return;
            }

            const payload = {
                profileId: name?.id,
                fileName: uploadedFileName,
                prescriptions: prescriptions,
                addedUsingMobileApp: true,
                ...(doc.length > 0 && {docTypeOne: 'Prescription'}),
            };

            const formData = new FormData();
            formData.append('token', token);
            formData.append('healthVaultUploadCount', doc.length);
            formData.append('formData', JSON.stringify(payload));

            for (let i = 0; i < doc.length; i++) {
                formData.append('healthFiles', {
                    uri: doc[i].uri,
                    type: doc[i].type,
                    name: doc[i].name,
                });
            }

            const url = `${BASE_URL}/hru/Patientappapi/uploadcantreadprescription`;
            // const url = `https://fb27-2401-4900-1c85-fcf6-9038-6089-133b-ee50.ngrok-free.app/hru/Patientappapi/uploadcantreadprescription`;
            const res = await postData(url, formData, true);

            if (!res.status) {
                Toast.show('Error uploading files', Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('Cant read prescription ------>', res);
            Toast.show('Files uploaded successfully', Toast.SHORT);
            navigation.goBack();
            setDoc([]);
            setUploadedFileName('');
        } catch (error) {
            Toast.show('Error uploading files', Toast.SHORT);
            console.log(error);
        } finally {
            setFileUploadLoading(false);
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
            <View style={styles.dropdownContainer}>
                <Text style={styles.detailHeader}>Patient Name : </Text>
                <CustomDropdown
                    customDropdownStyle={styles.customDropdownStyle}
                    customSelectedTextStyle={styles.customSelectedTextStyle}
                    data={data?.patientDetails?.patientOption}
                    label={null}
                    mode={true}
                    value={name?.id}
                    setValue={setName}
                    customLabelField="name" // Define the field in data representing the label
                    customValueField="id" // Define the field in data representing the value
                />
            </View>

            {name ? (
                <>
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

                    <>
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
                                                    height: hp(22),
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
                    </>
                </>
            ) : (
                <Text style={styles.emptyPatientText}>**Please select a patient first**</Text>
            )}

            {name && <BigButton title="Upload" onPress={handleUpload} customStyle={{marginHorizontal: wp(5)}} loading={fileUploadLoading} />}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    dropdownContainer: {
        flexDirection: 'row',
        marginVertical: hp(2),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp(5),
    },
    detailHeader: {
        fontSize: wp(4.1),
        color: colors.black,
        fontWeight: '500',
    },
    customDropdownStyle: {
        width: wp(55),
        paddingVertical: hp(1),
        backgroundColor: colors.white,
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
        borderWidth: wp(0.001),
        elevation: 1,
    },
    fileList: {
        height: hp(40),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: wp(2),
        marginVertical: hp(1),
        padding: wp(2),
        backgroundColor: colors.white,
        marginHorizontal: wp(3),
    },

    customSelectedTextStyle: {
        color: colors.darkBlue,
        fontWeight: 'bold',
        fontSize: wp(3.7),
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp(1),
        marginHorizontal: wp(5),
    },
    emptyPatientText: {
        color: colors.darkGrey,
        fontSize: wp(3.5),
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: hp(5),
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
});
