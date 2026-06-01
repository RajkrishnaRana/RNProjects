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
import {FileUpload} from '../../screens/BookAppointment/VerifyBookingScreen';
import {isTab} from '../../utils/isTab';

interface Props {
    profileId: string;
    prescriptionOrReport: PrescriptionOrReport;
    setPrescriptionOrReport: React.Dispatch<React.SetStateAction<PrescriptionOrReport>>;
    doc: FileUpload;
    setDoc: React.Dispatch<React.SetStateAction<FileUpload>>;
    uploadedFileName: {Prescription: string; Report: string};
    setUploadedFileName: React.Dispatch<React.SetStateAction<{Prescription: string; Report: string}>>;
}

type PrescriptionOrReport = 'Prescription' | 'Report';

export default function SelectOrUploadDocCard({
    profileId,
    doc,
    setDoc,
    prescriptionOrReport,
    setPrescriptionOrReport,
    uploadedFileName,
    setUploadedFileName,
}: Props) {
    // const [loading, setLoading] = useState(false);
    // const [doc, setDoc] = useState<FileUpload>({Prescription: [], Report: []});
    // const [fileName, setFileName] = useState('');

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
            setDoc(prev => {
                const currentFiles = prev[prescriptionOrReport] || [];
                const currentFileNames = currentFiles.map(file => file.name);

                // Filter new files to only include those not already present
                const newFiles = doc.filter(newFile => !currentFileNames.includes(newFile.name));

                // Only update state if there are new unique files
                if (newFiles.length > 0) {
                    return {
                        ...prev,
                        [prescriptionOrReport]: [...currentFiles, ...newFiles],
                    };
                } else {
                    // Optionally show a message if duplicates were found
                    Toast.show('Same named files are not added', Toast.SHORT);
                    return prev; // Return previous state unchanged
                }
            });
        } catch (error) {
            Toast.show('No Documents Selected', Toast.SHORT);
            console.log(error);
        }
    }

    const renderItem = ({item}: {item: DocumentPickerResponse}) => {
        const onPress = () => {
            setDoc(prev => ({
                ...prev,
                [prescriptionOrReport]: prev[prescriptionOrReport].filter(doc => doc.uri !== item.uri),
            }));
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
                {doc[prescriptionOrReport].length > 0 ? (
                    <View style={{}}>
                        <View
                            style={[
                                {
                                    height: hp(15),
                                    marginTop: hp(0),
                                },
                            ]}>
                            <FlashList
                                data={doc[prescriptionOrReport]}
                                renderItem={renderItem}
                                estimatedItemSize={20}
                                keyExtractor={(item, index) => index.toString()}
                                nestedScrollEnabled
                            />
                        </View>

                        <TextField
                            placeholder="Enter File Name"
                            value={uploadedFileName[prescriptionOrReport]}
                            onChangeText={text =>
                                setUploadedFileName(prev => ({
                                    ...prev,
                                    [prescriptionOrReport]: text,
                                }))
                            }
                            customContainerStyle={styles.textFieldStyle}
                        />
                        <Text style={{color: colors.darkGrey, fontSize: isTab ? wp(1.8) : wp(2.5), textAlign: 'center'}}>
                            <Text style={{color: 'red'}}>*</Text>All uploaded files will be consolidated into one pdf with this file name
                        </Text>

                        <View style={styles.uploadOrFileSelect}>
                            <BigButton
                                title="Select More Files"
                                onPress={fileUpload}
                                customStyle={styles.customButtonStyle}
                                customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                            />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={[styles.uploadSection]} onPress={fileUpload}>
                        <FontAwesome name="cloud-upload" size={isTab ? wp(6) : wp(10)} color={colors.primary} />
                        <Text style={styles.uploadText}>Upload Prescription / Reports</Text>
                        <Text style={styles.uploadHint}>Tap to Upload your report’s images 1 or more (jpg, pdf, png)</Text>
                    </TouchableOpacity>
                )}
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    uploadSection: {
        alignItems: 'center',
        paddingVertical: isTab ? hp(1.5) : hp(3),
        paddingHorizontal: wp(3),
        margin: wp(1),
        // borderWidth: wp(0.3),
        borderColor: colors.grey,
        borderRadius: wp(5),
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
        marginVertical: isTab ? hp(0.5) : hp(1),
        marginTop: isTab ? hp(0) : hp(1),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        backgroundColor: colors.white,
    },
    filterBoxContainer: {
        flexDirection: 'row',
        marginBottom: isTab ? hp(1) : hp(2),
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    customButtonStyle: {
        width: wp(50),
        marginTop: isTab ? hp(0.5) : hp(1),
        paddingVertical: isTab ? hp(0.5) : hp(1),
    },
    textFieldStyle: {
        marginTop: isTab ? hp(0.5) : hp(1),
        marginBottom: isTab ? hp(0.5) : hp(1),
    },
});
