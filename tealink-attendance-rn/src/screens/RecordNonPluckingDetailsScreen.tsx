import { StyleSheet } from 'react-native';
import React from 'react';
import StackHeader from '../components/Headers/StackHeader';
import ActivityContainerSection from '../components/Sections/ActivityContainerSection';
import WorkerIdentificationSection from '../components/Sections/WorkerIdentificationSection';
import useRecordNonPluckingDetails from '../hooks/screenHooks/useRecordNonPluckingDetails';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { hp } from '../utils/dimesion';
import WorkerLogged from '../components/Headers/WorkerLogged';

export default function RecordNonPluckingDetailsScreen() {
    const {
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
        nonPluckingImg,
        firstNonPluckingImg,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        workerCode,
        setWorkerCode,
        findWorker,
        worker,
        setWorker,
        workerCount,
        manualWorkerSelect,
        loading,
    } = useRecordNonPluckingDetails();

    return (
        <>
            <StackHeader title="Record Non Plucking Details" description="Track non tea leaf collection" children={<WorkerLogged />} />

            <KeyboardAwareScrollView contentContainerStyle={styles.container} bottomOffset={hp(5)} keyboardShouldPersistTaps="handled">
                <ActivityContainerSection
                    section={section}
                    setSection={setSection}
                    allSection={allSection}
                    allKamjari={allKamjari}
                    allBatch={allBatch}
                    allShift={allShift}
                    kamjari={kamjari}
                    batch={batch}
                    shift={shift}
                    setKamjari={setKamjari}
                    setBatch={setBatch}
                    setShift={setShift}
                />

                <WorkerIdentificationSection
                    firstImg={firstNonPluckingImg}
                    image={nonPluckingImg}
                    visible={visible}
                    setVisible={setVisible}
                    handlePress={handlePress}
                    handleSaveImages={handleSaveImages}
                    workerCode={workerCode}
                    setWorkerCode={setWorkerCode}
                    worker={worker}
                    setWorker={setWorker}
                    workerCount={workerCount}
                    findWorker={findWorker}
                    manualWorkerSelect={manualWorkerSelect}
                    loading={loading}
                />
            </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingBottom: 30 },
});
