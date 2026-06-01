import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomDromdown from '../Dropdown/CustomDromdown';
import SectionIconHeader from '../Headers/SectionIconHeader';
import { colors } from '../../common/colors';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import SectionMaster from '../../model/sectionMaster';

interface Props {
    section: SectionMaster | undefined;
    setSection: (section: SectionMaster) => void;
    allSection: SectionMaster[];
    allKamjari: any[];
    allBatch: any[];
    allShift: any[];
    kamjari: any;
    batch: any;
    shift: any;
    setKamjari: (kamjari: any) => void;
    setBatch: (batch: any) => void;
    setShift: (shift: any) => void;
}

export default function ActivityContainerSection({
    section,
    setSection,
    allSection,
    allKamjari,
    allBatch,
    allShift,
    kamjari,
    batch,
    shift,
    setKamjari,
    setBatch,
    setShift,
}: Props) {
    return (
        <View style={styles.container}>
            <SectionIconHeader
                customIconContainerColor={colors.veryLightGreen}
                customIcon={<MaterialDesignIcons name="form-select" size={15} color={colors.lightGreen} />}
                title="Activity Details"
                description="Select work sssignment parameters"
                customTextColor={colors.black}
                cutomDescriptionTextColor={colors.grey}
            />

            {/* For maintaining a gap from title to first dropdown */}
            <View style={styles.formContainer}>
                <CustomDromdown
                    data={allSection ?? []}
                    label="Section Name"
                    customPlaceholder="Select Section"
                    value={section}
                    setValue={setSection}
                    customLabelField="sectionName"
                    customValueField="sectionId"
                    searchFeature
                    mode={false}
                    customContainerStyle={styles.dropdown}
                />

                <CustomDromdown
                    data={allKamjari ?? []}
                    label="Kamjari Name"
                    customPlaceholder="Select Kamjari"
                    value={kamjari}
                    setValue={setKamjari}
                    customLabelField="kamjariName"
                    customValueField="kamjariId"
                    searchFeature
                    isNecessary
                    mode={false}
                    customContainerStyle={styles.dropdown}
                />
            </View>

            <View style={styles.formContainer}>
                <CustomDromdown
                    data={allBatch ?? []}
                    label="Batch Name"
                    customPlaceholder="Select Batch"
                    value={batch}
                    setValue={setBatch}
                    customLabelField="batchName"
                    customValueField="batchId"
                    searchFeature
                    isNecessary
                    mode={false}
                    customContainerStyle={styles.dropdown}
                />

                <CustomDromdown
                    data={allShift ?? []}
                    label="Shift Name"
                    customPlaceholder="Select Shit"
                    value={shift}
                    setValue={setShift}
                    customLabelField="shiftCode"
                    customValueField="shiftId"
                    searchFeature
                    mode={false}
                    customContainerStyle={styles.dropdown}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 15,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 8,
        gap: 10,
    },
    formContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    dropdown: { width: '48%' }
});
