import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {DocumentPickerResponse, pick} from '@react-native-documents/picker';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import Toast from 'react-native-simple-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FilterBox from '../FilterBox';
import FileViewCard from './FileViewCard';
import {FlashList} from '@shopify/flash-list';
import BigButton from '../BigButton';
import TextField from '../TextField';
import {BASE_URL} from '../../config';
import {postData} from '../../api';
import {queryClient} from '../../../App';
import {isTab} from '../../utils/isTab';

interface UploadSectionCardProps {
    token: string | null;
    profileId: string | undefined;
    customStyle?: StyleProp<ViewStyle>;
}

type PrescriptionOrReport = 'Prescription' | 'Report';

export default function UploadSectionCard({token, profileId, customStyle}: UploadSectionCardProps) {
    const [prescriptionOrReport, setPrescriptionOrReport] = useState<PrescriptionOrReport>('Prescription');
    const [loading, setLoading] = useState(false);
    const [doc, setDoc] = useState<DocumentPickerResponse[]>([]);
    const [fileName, setFileName] = useState('');

    // LOCAL FUNCTIONS ------------------------------>
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

    async function upload() {
        try {
            setLoading(true);
            // console.log(profileId);
            const payload = {
                profileId: profileId,
                type: prescriptionOrReport,
                fileName: fileName,
                addedUsingMobileApp: true,
            };

            // console.log(JSON.stringify(payload));
            // console.log(token);

            const formData = new FormData();
            formData.append('formData', JSON.stringify(payload));
            formData.append('token', token);

            for (let i = 0; i < doc.length; i++) {
                formData.append('healthFiles', {
                    uri: doc[i].uri,
                    type: doc[i].type,
                    name: doc[i].name,
                });
            }

            if (fileName === '') {
                Toast.show('Please enter file name', Toast.SHORT);
                return;
            }

            const url = `${BASE_URL}/hru/Patientappapi/healthfileupload`;

            const res = await postData(url, formData, true);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                return;
            }

            Toast.show('Files uploaded successfully', Toast.SHORT);
            const queryKey = (prescriptionOrReport === 'Prescription' ? 'prescriptionsData' : 'reportsData') + profileId;
            queryClient.invalidateQueries({queryKey: [queryKey]});
            setDoc([]);
            setFileName('');
        } catch (error) {
            Toast.show('Error uploading files', Toast.SHORT);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const renderItem = ({item}: {item: DocumentPickerResponse}) => {
        const onPress = () => {
            setDoc(prev => prev.filter(doc => doc.uri !== item.uri));
        };
        return <FileViewCard item={item} onPress={onPress} />;
    };

    return (
        <View style={styles.fileSelectContainer}>
            <View style={styles.filterBoxContainer}>
                <FilterBox
                    name="Prescripton"
                    selected={prescriptionOrReport === 'Prescription'}
                    onPress={() => setPrescriptionOrReport('Prescription')}
                />
                <FilterBox name="Report" selected={prescriptionOrReport === 'Report'} onPress={() => setPrescriptionOrReport('Report')} />
            </View>

            <>
                {doc.length > 0 ? (
                    <View style={{}}>
                        <View
                            style={[
                                styles.fileSelectContainer,
                                {
                                    height: hp(20),
                                    marginTop: hp(-1.5),
                                    borderWidth: 0,
                                },
                            ]}>
                            <FlashList data={doc} renderItem={renderItem} estimatedItemSize={20} keyExtractor={(item, index) => index.toString()} />
                        </View>

                        <Text style={{color: colors.darkGrey, fontSize: isTab ? wp(2) : wp(2.5)}}>
                            <Text style={{color: 'red'}}>*</Text>multiple selected files comply with one pdf with this file name
                        </Text>
                        <TextField
                            placeholder="Enter File Name"
                            value={fileName}
                            onChangeText={setFileName}
                            customContainerStyle={styles.textFieldStyle}
                        />
                        <View style={styles.uploadOrFileSelect}>
                            <BigButton
                                title="Select Files"
                                onPress={fileUpload}
                                customStyle={styles.customButtonStyle}
                                customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                            />
                            <BigButton
                                title="Upload"
                                onPress={upload}
                                customStyle={styles.customButtonStyle}
                                customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                                loading={loading}
                            />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={[styles.uploadSection, customStyle]} onPress={fileUpload}>
                        <FontAwesome name="cloud-upload" size={isTab ? wp(5.5) : wp(10)} color={colors.primary} />
                        <Text style={styles.uploadText}>Upload Prescription / Reports</Text>
                        <Text style={styles.uploadHint}>Tap here to Upload your report’s images 1 or more (jpg, pdf, png)</Text>
                    </TouchableOpacity>
                )}
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    uploadSection: {
        alignItems: 'center',
        paddingVertical: hp(3),
        paddingHorizontal: wp(3),
        margin: wp(1),
        // borderWidth: wp(0.1),
        borderColor: colors.grey,
        borderRadius: wp(5),
        // elevation: 2,
    },
    uploadText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        marginTop: hp(1),
        textAlign: 'center',
        color: colors.black,
    },
    uploadHint: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: 'gray',
        marginTop: hp(0.5),
        textAlign: 'center',
    },
    fileSelectContainer: {
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: isTab ? hp(1) : hp(2),
        marginVertical: hp(1),
        marginTop: hp(1),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        // backgroundColor: colors.blueWhite,
    },
    filterBoxContainer: {
        flexDirection: 'row',
        marginBottom: hp(2),
    },
    fileViewContainer: {
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        borderRadius: wp(3),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
    },
    uploadOrFileSelect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    customButtonStyle: {
        width: wp(40),
        marginTop: isTab ? hp(0.5) : hp(1),
        paddingVertical: hp(1),
    },
    textFieldStyle: {
        marginTop: isTab ? hp(0.5) : hp(1),
        marginBottom: hp(1),
    },
});
