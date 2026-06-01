import { RefreshControl, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import HealthVaultCard from '../../components/Cards/HealthVaultCard';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { PatientPrescriptionsProps } from './PrescriptionScreen';
import { FlashList } from '@shopify/flash-list';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import FilterBox from '../../components/FilterBox';
import { BASE_URL } from '../../config';
import { deleteFile, downloadFile, viewFile } from '../../utils/fileHelper';
import { useNavigation } from '../../hooks/useNavigation';
import { queryClient } from '../../../App';
import BackgroundGradient from '../../components/BackgroundGradient';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import { isIos } from '../../utils/platform';

type ReportScreenRouteProp = RouteProp<RootStackParamList, 'Reports'>;

export interface SampleReportProps {
    type: string;
    fileName?: string;
    doctor?: string;
    transactionId?: string;
    prescribedOn?: string;
}

export default function ReportScreen() {
    // GLOBAL CONSTANTS ------------------->
    const navigation = useNavigation();
    const { profileId } = useRoute<ReportScreenRouteProp>().params;

    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);

    // LOCAL STATES ------------------------------>
    const [doctorOrPatient, setDoctorOrPatient] = useState('Patient');
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setLoading] = useState<Record<string, boolean>>({});
    const [downloadLoading, setDownloadLoading] = useState<Record<string, boolean>>({});

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patienthealthreport`;
    const { isPending, error, data } = useQuery({
        queryKey: ['reportsData' + profileId],
        queryFn: () => postData(url, { token: token, profileId: profileId }),
        select: d => {
            const actualData = d?.doc;
            // console.log('actualData', actualData);
            let patientReports: PatientPrescriptionsProps[] = [];
            let doctorReports: PatientPrescriptionsProps[] = [];
            let labReports: PatientPrescriptionsProps[] = [];

            actualData?.profile?.forEach((item: any) => patientReports.push({ type: 'Uploaded', ...item }));

            actualData?.reports?.forEach((item: any) => {
                if (item?.uploadedReports) {
                    item?.uploadedReports?.forEach((report: any) => {
                        if (report?.reportType) {
                            doctorReports.push({
                                type: 'Doctor Uploaded',
                                uploadedReport: report,
                                ...item,
                            });
                        }
                    });
                } else patientReports.push({ type: 'Digital', ...item });
            });

            actualData?.labReports?.forEach((labReport: any) => {
                labReport?.labTests?.forEach((test: any) => {
                    labReports.push({
                        type: 'Lab Uploaded',
                        ...labReport,
                        labTests: test,
                    });
                });
            });

            console.log({ labReports, doctorReports });
            return { Patient: patientReports, Doctor: doctorReports, Lab: labReports };
        },
    });

    const onRefresh = () => {
        setRefresh(true);
        queryClient.invalidateQueries({
            queryKey: ['reportsData' + profileId],
        });
        setRefresh(false);
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <View style={styles.filterBoxContainer}>
                    <FilterBox name="Patient" selected={doctorOrPatient === 'Patient'} onPress={() => setDoctorOrPatient('Patient')} />
                    <FilterBox name="Doctor" selected={doctorOrPatient === 'Doctor'} onPress={() => setDoctorOrPatient('Doctor')} />
                    <FilterBox name="Lab" selected={doctorOrPatient === 'Lab'} onPress={() => setDoctorOrPatient('Lab')} />
                </View>

                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <FlashList
                        data={data?.[doctorOrPatient as 'Patient' | 'Doctor' | 'Lab']}
                        renderItem={({ item }) => {
                            const patientFileUrl = item?.uploadedReport?.reportPath || '';
                            const patientFileName = item?._id + item?.uploadedReport?.fileName || item?._id + 'Report';

                            const fileUrl = `${BASE_URL}/hru/Patientappapi/${item?._id}/${item?.uploadedReport?.id}/report.pdf`;
                            const fileName = `${item?.bookingId}${item?.uploadedReport?.id}Report.pdf`;

                            // const labFileUrl = `${BASE_URL}/hru/Patientappapi/${item?.labId}/${item?.labTests?.testId}/report.pdf`;
                            const labFileName = `${item?.labTests?.testId}_${item?._id}_${item?.labTests?.reportName}`;

                            return (
                                <HealthVaultCard
                                    item={item}
                                    componentType="Report"
                                    iconName="clipboard"
                                    profileId={profileId}
                                    loading={isLoading[item._id]}
                                    downloadLoading={downloadLoading[item._id]}
                                    downloadFunction={async () => {
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: true }));
                                        if (doctorOrPatient === 'Patient') {
                                            await downloadFile(patientFileUrl, patientFileName);
                                        } else if (item?.type === 'Lab Uploaded') {
                                            await downloadFile(item?.labTests?.labReportPath, labFileName);
                                        } else {
                                            await downloadFile(fileUrl, fileName);
                                        }
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: false }));
                                    }}
                                    deleteFunction={() => {
                                        deleteFile(item?._id, item?.uploadedReport?.path || '', 'reportsData' + profileId);
                                    }}
                                    fileViewFunction={async () => {
                                        setLoading(prev => ({ ...prev, [item._id]: true }));
                                        if (doctorOrPatient === 'Patient') {
                                            await viewFile(patientFileUrl, patientFileName, navigation);
                                        } else if (item?.type === 'Lab Uploaded') {
                                            await viewFile(item?.labTests?.labReportPath, labFileName, navigation);
                                        } else {
                                            await viewFile(fileUrl, fileName, navigation);
                                        }
                                        setLoading(prev => ({ ...prev, [item._id]: false }));
                                    }}
                                    shareFunction={() => {
                                        console.log(item);
                                    }}
                                />
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={0.7}
                        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                        ListEmptyComponent={
                            <ListEmptyComponent
                                customText="No reports found for this patient"
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
    },
    filterBoxContainer: {
        flexDirection: 'row',
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
