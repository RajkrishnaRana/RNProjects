import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FilterBox from '../FilterBox';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import UploadSectionCard from './UploadSectionCard';
import SelectiveFile from '../SelectiveFile';

interface FilesProps {
    type: string;
    name: string;
    isSelected: boolean;
}

interface HealthVaultProps {
    Report: FilesProps[];
    Prescription: FilesProps[];
}

const healthVaultFiles: HealthVaultProps = {
    Report: [
        {
            type: 'Report',
            name: 'R.pdf',
            isSelected: false,
        },
        {
            type: 'Report',
            name: 'R.pdf',
            isSelected: false,
        },
        {
            type: 'Report',
            name: 'R.pdf',
            isSelected: false,
        },
        {
            type: 'Report',
            name: 'R.pdf',
            isSelected: false,
        },
        {
            type: 'Report',
            name: 'R.pdf',
            isSelected: false,
        },
    ],
    Prescription: [
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
        {
            type: 'Prescription',
            name: 'DoctorUp.pdf',
            isSelected: false,
        },
    ],
};

export default function FileSelectorCard() {
    const [newOrHealthValut, setNewOrHealthVault] = useState({
        healthValut: true,
        new: false,
    });
    const [prescriptionOrReport, setPrescriptionOrReport] =
        useState<keyof HealthVaultProps>('Prescription');
    const [healthVaultFilesState, setHealthVaultFilesState] =
        useState(healthVaultFiles);

    const handleFileSelection = (index: number) => {
        setHealthVaultFilesState(prev => {
            const updatedArr = prev[prescriptionOrReport]?.map((item, i) => {
                return {
                    ...item,
                    isSelected:
                        i === index ? !item.isSelected : item.isSelected,
                };
            });

            return {
                ...prev,
                [prescriptionOrReport]: updatedArr,
            };
        });
    };

    return (
        <View style={styles.fileSelectContainer}>
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

            {newOrHealthValut.healthValut ? (
                <ScrollView style={{height: hp(30)}} nestedScrollEnabled={true}>
                    {healthVaultFilesState[prescriptionOrReport].map(
                        (item: FilesProps, index: number) => {
                            return (
                                <SelectiveFile
                                    item={item}
                                    key={index}
                                    onPress={() => handleFileSelection(index)}
                                />
                            );
                        },
                    )}
                </ScrollView>
            ) : (
                <UploadSectionCard />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fileSelectContainer: {
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: wp(3),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
        height: hp(30),
    },
    filterBoxContainer: {
        flexDirection: 'row',
        marginBottom: hp(2),
    },
});
