import {StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BigButton from '../BigButton';
import FileSelectorCard from '../Cards/FileSelectorCard';
import SelectiveFile from '../SelectiveFile';
import {BASE_URL} from '../../config';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '../../store/authStore';
import {postData} from '../../api';
import PageLoading from '../LottieComponent/PageLoading';
import {PatientPrescriptionsProps} from '../../screens/HealthVault/PrescriptionScreen';
import Toast from 'react-native-simple-toast';
import {queryClient} from '../../../App';

interface DoctorNameProps {
    _id: string;
    name: string;
    appointmentId: string;
    startTime: string;
    isSelected: boolean;
}

interface Props {
    profileId: string;
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    item: PatientPrescriptionsProps;
    type?: 'Uploaded' | 'Digital' | 'Doctor Uploaded' | 'Lab Uploaded';
}

export default function ShareModal({isModalVisible, setModalVisible, profileId, item, type}: Props) {
    // GLOBAL STATES ----------------------------->
    const token = useAuthStore(s => s.token);

    // LOCAL STATES ------------------------------------>
    const [doctorState, setDoctorState] = useState<DoctorNameProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/getdoctorforsharereport`;
    const {isPending, error, data} = useQuery({
        queryKey: ['getDoctorsForShare' + profileId],
        queryFn: () => postData(url, {token: token, profileId: profileId}),
        select: data => {
            const modifiedData = data?.docs?.map((item: any, index: number) => ({
                ...item,
                isSelected: index === 0 ? true : false,
            }));

            return modifiedData;
        },
    });

    // LOCAL FUNCTIONS ---------------------->
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const onSharePress = async () => {
        const selectedItem = doctorState.find(item => item.isSelected);

        let tempId;
        let finalId;
        if (item?.labTests?.reportPath) {
            let tempId = item?.labTests?.reportPath.split('/');
            finalId = tempId[1].split('.');
        }

        type ShareReportDataType = {
            appointmentId: string | undefined;
            ext: string;
            id: string | undefined;
            path: string | undefined;
            reportType: string | undefined;
            sharedByPatient: boolean;
        };

        const dataToPost: ShareReportDataType = {
            appointmentId: selectedItem?.appointmentId,
            ext: 'pdf',
            id: type === 'Lab Uploaded' ? finalId?.[0] : item?.uploadedReport?.id,
            path: type === 'Lab Uploaded' ? item?.labTests?.reportPath : item?.uploadedReport?.path,
            reportType: type === 'Lab Uploaded' ? item?.labTests?.testName : item?.uploadedReport?.reportType,
            sharedByPatient: true,
        };

        console.log('share payload', dataToPost);

        const url = `${BASE_URL}/hru/Patientappapi/sharereporttodoctor`;
        try {
            setIsLoading(true);
            const res = await postData(url, dataToPost);
            setModalVisible(false);
            Toast.show(res.msg, Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['reportsData' + profileId],
            });
        } catch (error) {
            setIsLoading(false);
            Toast.show('Failed to share', Toast.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelection = (index: number) => {
        setDoctorState(prev => {
            const updatedArr = prev.map((item, i) => {
                return {
                    ...item,
                    isSelected: i === index ? true : false,
                };
            });

            return updatedArr;
        });
    };

    // SIDE EFFECTS ------------------------->
    useEffect(() => {
        setDoctorState(data);
    }, [data]);

    return (
        <Modal visible={isModalVisible} animationType="fade" transparent>
            <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={styles.modalStyle}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        {isPending ? (
                            <PageLoading />
                        ) : error ? (
                            <Text>Some error occured</Text>
                        ) : (
                            <>
                                <Text style={styles.deleteModalText}>Choose Doctors</Text>

                                <View style={styles.fileSelectContainer}>
                                    <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
                                        {doctorState?.map((item: any, index: number) => {
                                            return (
                                                <SelectiveFile type="DoctorName" item={item} key={index} onPress={() => handleFileSelection(index)} />
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: hp(2),
                                        gap: wp(4),
                                    }}>
                                    <BigButton
                                        title="Share"
                                        onPress={onSharePress}
                                        customStyle={[styles.deleteModalButton, {backgroundColor: colors.darkBlue}]}
                                        customTextStyle={{fontSize: wp(4)}}
                                        loading={isLoading}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 15,
        marginHorizontal: wp(10),
        padding: wp(5),
        alignItems: 'center',
    },
    deleteModalText: {
        color: colors.darkGrey,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    deleteModalButton: {
        width: wp(30),
        marginTop: 0,
        borderRadius: wp(10),
    },
    fileSelectContainer: {
        borderWidth: 1.5,
        borderColor: colors.darkBlue,
        borderRadius: wp(3),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
        height: hp(30),
        width: wp(70),
    },
});
