import { StyleSheet, View } from 'react-native';
import React from 'react';
import StackHeader from '../components/Headers/StackHeader';
import CustomDromdown from '../components/Dropdown/CustomDromdown';
import useRecordPluckingInDetails from '../hooks/screenHooks/useRecordPluckingInDetails';
import GradientButton from '../components/Buttons/GradientButton';
import { useAppSelector } from '../hooks/typedReduxHooks';

export default function RecordPluckingDetailsScreen() {
    const {
        section,
        setSection,
        allSection,
        allShift,
        allBatch,
        allKamjari,
        batch,
        setBatch,
        shift,
        setShift,
        kamjari,
        setKamjari,
        weighment,
        setWeighment,
        WEIGHMENTDATA,
        handleNext,
        locationLoading,
        handleLogs,
    } = useRecordPluckingInDetails();
    const { userData } = useAppSelector(state => state.auth);

    // console.log('all batch info :', allBatch);
    // console.log('all shift info :', allShift);
    // console.log('all kamjari info :', allKamjari);

    return (
        <>
            <StackHeader title="Record Plucking Details" description="Track tea leaf collection" />

            <View style={styles.container}>
                <CustomDromdown
                    data={WEIGHMENTDATA ?? []}
                    label="Select Weighment"
                    value={weighment}
                    setValue={setWeighment}
                    customLabelField="name"
                    customValueField="id"
                />

                <CustomDromdown
                    data={allSection ?? []}
                    label="Section Name"
                    customPlaceholder="Select Section"
                    value={section}
                    setValue={setSection}
                    customLabelField="sectionName"
                    customValueField="sectionId"
                    searchFeature
                />

                <CustomDromdown
                    data={allBatch ?? []}
                    label="Batch Name"
                    customPlaceholder="Select Batch"
                    value={batch}
                    setValue={setBatch}
                    customLabelField="batchName"
                    customValueField="batchId"
                />

                <CustomDromdown
                    data={allShift ?? []}
                    label="Shift Name"
                    customPlaceholder="Select Shit"
                    value={shift}
                    setValue={setShift}
                    customLabelField="shiftCode"
                    customValueField="shiftId"
                />

                {allKamjari.length > 1 && userData?.allowAssignWorker && (
                    <CustomDromdown
                        data={allKamjari ?? []}
                        label="Kamjari Name"
                        customPlaceholder="Select Kamjari"
                        value={kamjari}
                        setValue={setKamjari}
                        customLabelField="kamjariName"
                        customValueField="kamjariId"
                    />
                )}

                <GradientButton title="Next" onPress={handleNext} loading={locationLoading} onLongPress={handleLogs} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        marginHorizontal: 15,
        marginTop: 10,
    },
});
