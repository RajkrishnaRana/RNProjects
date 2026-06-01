import { Alert, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import HealthVaultCard from '../../components/Cards/HealthVaultCard';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useQuery } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { useAuthStore } from '../../store/authStore';
import { postData } from '../../api';
import { PatientPrescriptionsProps } from './PrescriptionScreen';
import { FlashList } from '@shopify/flash-list';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import { BASE_URL } from '../../config';
import { downloadFile, viewFile } from '../../utils/fileHelper';
import { useNavigation } from '../../hooks/useNavigation';
import { queryClient } from '../../../App';
import BackgroundGradient from '../../components/BackgroundGradient';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import FilterBox from '../../components/FilterBox';
import { isIos } from '../../utils/platform';

type InvoiceScreenRouteProp = RouteProp<RootStackParamList, 'Invoices'>;

export default function InvoiceScreen() {
    // CONSTANTS ------------------->
    const navigation = useNavigation();
    const { profileId } = useRoute<InvoiceScreenRouteProp>().params;

    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);
    const logout = useAuthStore(state => state.logout);

    // LOCAL STATES ------------------------------>
    const [doctorLabPharmacy, setDoctorLabPharmacy] = useState<'Doctor' | 'Lab' | 'Pharmacy'>('Doctor');
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setLoading] = useState<Record<string, boolean>>({});
    const [downloadLoading, setDownloadLoading] = useState<Record<string, boolean>>({});

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patienthealthinvoice`;
    const { isPending, error, data } = useQuery({
        queryKey: ['invoiceData' + profileId],
        queryFn: () => postData(url, { token: token, profileId: profileId }),
        select: d => {
            if (d?.tokenExpired) {
                Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [{ text: 'OK', onPress: () => logout() }]);
            }

            console.log(d.doc);
            const labInvoices = d?.doc?.labAppInvoices?.map((item: any) => ({ type: 'Lab Uploaded', ...item }));
            const pharmacyInvoices = d?.doc?.pharmacyAppInvoices?.map((item: any) => ({ type: 'Pharmacy Uploaded', ...item }));
            return {
                Doctor: d?.doc?.doctorAppInvoices,
                Lab: labInvoices,
                Pharmacy: pharmacyInvoices,
            };
        },
    });

    const onRefresh = () => {
        setRefresh(true);
        queryClient.invalidateQueries({
            queryKey: ['invoiceData' + profileId],
        });
        setRefresh(false);
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <View style={styles.filterBoxContainer}>
                    <FilterBox name="Doctor" selected={doctorLabPharmacy === 'Doctor'} onPress={() => setDoctorLabPharmacy('Doctor')} />
                    <FilterBox name="Lab" selected={doctorLabPharmacy === 'Lab'} onPress={() => setDoctorLabPharmacy('Lab')} />
                    <FilterBox name="Pharmacy" selected={doctorLabPharmacy === 'Pharmacy'} onPress={() => setDoctorLabPharmacy('Pharmacy')} />
                </View>

                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <FlashList
                        data={data?.[doctorLabPharmacy]}
                        renderItem={({ item }: { item: PatientPrescriptionsProps }) => {
                            const fileUrl =
                                item.type === 'Lab Uploaded'
                                    ? `${BASE_URL}/lab/${item._id}/receipt.pdf`
                                    : `${BASE_URL}/patient/${item._id}/invoice.pdf`;
                            const fileName = `${item._id}Invoice.pdf`;

                            return (
                                <HealthVaultCard
                                    componentType="Invoice"
                                    item={item as PatientPrescriptionsProps}
                                    iconName="files-o"
                                    loading={isLoading[item._id]}
                                    downloadLoading={downloadLoading[item._id]}
                                    downloadFunction={async () => {
                                        console.log(fileUrl, token);
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: true }));
                                        await downloadFile(
                                            fileUrl,
                                            fileName,
                                            undefined,
                                            'POST',
                                            { token: token },
                                            { 'Content-Type': 'application/json' },
                                        );
                                        setDownloadLoading(prev => ({ ...prev, [item._id]: false }));
                                    }}
                                    fileViewFunction={async () => {
                                        setLoading(prev => ({ ...prev, [item._id]: true }));
                                        await viewFile(
                                            fileUrl,
                                            fileName,
                                            navigation,
                                            undefined,
                                            'POST',
                                            { token: token },
                                            { 'Content-Type': 'application/json' },
                                        );

                                        setLoading(prev => ({ ...prev, [item._id]: false }));
                                    }}
                                />
                            );
                        }}
                        contentContainerStyle={styles.itemContainer}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={0.7}
                        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                        ListEmptyComponent={
                            <ListEmptyComponent
                                customText="No invoices found for this patient"
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
    itemContainer: {
        paddingTop: hp(1),
        paddingBottom: 22,
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
