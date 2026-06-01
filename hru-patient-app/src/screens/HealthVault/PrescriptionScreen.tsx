import { Alert, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import HealthVaultCard from '../../components/Cards/HealthVaultCard';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import PageLoading from '../../components/LottieComponent/PageLoading';
import FilterBox from '../../components/FilterBox';
import { FlashList } from '@shopify/flash-list';
import ErrorComponent from '../../components/ErrorComponent';
import { BASE_URL } from '../../config';
import { deleteFile, downloadFile, viewFile } from '../../utils/fileHelper';
import { useNavigation } from '../../hooks/useNavigation';
import { queryClient } from '../../../App';
import BackgroundGradient from '../../components/BackgroundGradient';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import { isIos } from '../../utils/platform';

type PrescriptionScreenRouteProp = RouteProp<RootStackParamList, 'Prescriptions'>;

export type DeletefileParams = {
    healthFileId: string | undefined;
    filePath: string | undefined;
};

export type PrescriptionScreenProps = {
    token: string;
    profileId: string;
};

export interface DoctorDetails {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

interface UploadedPrescription {
    id?: string;
    ext?: string;
    fileName?: string;
    name?: string;
    path: string;
    prescriptionPath?: string;
    reportPath?: string;
    reportType?: string;
}

interface LabTests {
    _id: string;
    labReportPath: string;
    price: string;
    reportName: string;
    reportPath: string;
    testId: string;
    testName: string;
}

export type DocumentType = 'Uploaded' | 'Digital' | 'Doctor Uploaded' | 'Lab Uploaded';

export interface PatientPrescriptionsProps {
    _id: string;
    type?: DocumentType;
    doctorId: string;
    bookingId: string;
    prescriptionDate?: string;
    prescriptionPath?: string;
    invoiceDate?: string;
    uploadedPrescription?: UploadedPrescription;
    uploadedReport?: UploadedPrescription;
    uploadedInvoice?: UploadedPrescription;
    uploadedPrescriptions?: UploadedPrescription[];
    doctorDetails: DoctorDetails;
    labDetails: {
        labName: string;
        _id: string;
    };
    labTests: LabTests;
}

export default function PrescriptionScreen() {
    // CONSTANTS ------------------->
    const navigation = useNavigation();
    const { profileId } = useRoute<PrescriptionScreenRouteProp>().params;

    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);
    const logout = useAuthStore(state => state.logout);

    // LOCAL STATES ------------------------------>
    const [doctorOrPatient, setDoctorOrPatient] = useState('Patient');
    const [isLoading, setLoading] = useState<Record<string, boolean>>({});
    const [downloadLoading, setDownloadLoading] = useState<Record<string, boolean>>({});
    // loading = {}, loading = {_id : false}
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patienthealthprescription`;
    // const url = `https://a013-2401-4900-1c85-e344-cbd8-d8b6-d151-c465.ngrok-free.app/hru/Patientappapi/patienthealthprescription`;
    const { isPending, error, data } = useQuery({
        queryKey: ['prescriptionsData' + profileId],
        queryFn: () => postData(url, { token: token, profileId: profileId }),
        select: d => {
            if (d?.tokenExpired) {
                Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [{ text: 'OK', onPress: () => logout() }]);
            }

            const actualData = d?.doc;
            let patientPrescriptions: PatientPrescriptionsProps[] = [];
            let doctorPrescriptions: PatientPrescriptionsProps[] = [];

            actualData?.profile?.forEach((item: any) => patientPrescriptions.push({ type: 'Uploaded', ...item }));

            actualData?.prescriptions?.forEach((item: any) => {
                if (item?.uploadedPrescriptions) {
                    item?.uploadedPrescriptions?.forEach((prescription: any) => {
                        doctorPrescriptions.push({
                            type: 'Doctor Uploaded',
                            ...item,
                            uploadedPrescription: prescription,
                        });
                    });
                } else doctorPrescriptions.push({ type: 'Digital', ...item });
            });

            // console.log('patientPrescriptions', patientPrescriptions);

            return { Patient: patientPrescriptions, Doctor: doctorPrescriptions };
        },
    });

    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['prescriptionsData' + profileId],
        });
        setRefresh(false);
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <View style={styles.filterBoxContainer}>
                    <FilterBox name="Patient Uploaded" selected={doctorOrPatient === 'Patient'} onPress={() => setDoctorOrPatient('Patient')} />
                    <FilterBox name="Doctor Uploaded" selected={doctorOrPatient === 'Doctor'} onPress={() => setDoctorOrPatient('Doctor')} />
                </View>

                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <FlashList
                        data={data?.[doctorOrPatient as 'Patient' | 'Doctor']}
                        renderItem={({ item }) => {
                            const patientFileUrl = item?.uploadedPrescription?.prescriptionPath || '';
                            const patientFileName = item?._id + item?.uploadedPrescription?.fileName || item?._id + 'prescription';

                            const fileUrl = `${BASE_URL}/patient/${item._id}/prescription.pdf`;
                            const fileName = `${item._id}${item?.bookingId}Prescription.pdf`;

                            return (
                                <HealthVaultCard
                                    item={item}
                                    iconName="file-text-o"
                                    componentType="Prescription"
                                    loading={isLoading[item._id]}
                                    downloadLoading={downloadLoading[item._id]}
                                    downloadFunction={async () => {
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: true }));
                                        if (doctorOrPatient === 'Patient') {
                                            await downloadFile(patientFileUrl, patientFileName);
                                        } else {
                                            await downloadFile(
                                                fileUrl,
                                                fileName,
                                                undefined,
                                                'POST',
                                                { token: token },
                                                { 'Content-Type': 'application/json' },
                                            );
                                        }
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: false }));
                                    }}
                                    deleteFunction={() => {
                                        deleteFile(item?._id, item?.uploadedPrescription?.path || '', 'prescriptionsData' + profileId);
                                    }}
                                    fileViewFunction={async () => {
                                        console.log('item', item);
                                        setLoading(prev => ({ ...prev, [item._id]: true }));
                                        try {
                                            if (doctorOrPatient === 'Patient') {
                                                await viewFile(patientFileUrl, patientFileName, navigation, 'Prescription');
                                            } else {
                                                await viewFile(
                                                    fileUrl,
                                                    fileName,
                                                    navigation,
                                                    'DigitalPrescription',
                                                    'POST',
                                                    { token: token },
                                                    { 'Content-Type': 'application/json' },
                                                );
                                            }
                                        } catch (e) {
                                            console.error('Error viewing file:', e);
                                        } finally {
                                            setLoading(prev => ({ ...prev, [item._id]: false }));
                                        }
                                    }}
                                />
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={0.7}
                        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        ListEmptyComponent={
                            <ListEmptyComponent
                                customText="No presciption found for this patient"
                                image={require('../../assets/icons/no_report.png')}
                                imageStyle={styles.emptyImage}
                                customStyle={styles.listemptyContainer}
                            />
                        }
                    />
                )}
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.white,
        // paddingHorizontal: wp(3),
    },
    filterBoxContainer: {
        flexDirection: 'row',
        // marginTop: hp(0.5),
        marginVertical: hp(1.5),
        paddingHorizontal: wp(3),
    },
    emptyImage: {
        width: 100,
        height: 100,
    },
    listemptyContainer: {
        height: isIos() ? hp(70) : hp(80),
        width: wp(100),
    },
});
