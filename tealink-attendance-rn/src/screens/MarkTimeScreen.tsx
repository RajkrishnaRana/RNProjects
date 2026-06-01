import React from 'react';
import StackHeader from '../components/Headers/StackHeader';
import WorkerIdentificationSection from '../components/Sections/WorkerIdentificationSection';
import WorkerLogged from '../components/Headers/WorkerLogged';
import useMarkTime from '../hooks/screenHooks/useMarkTime';
import { StyleSheet, View } from 'react-native';
import { hp, wp } from '../utils/dimesion';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function MarkTimeScreen() {
    const {
        firstImg,
        image,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        workerCode,
        setWorkerCode,
        worker,
        setWorker,
        workerCount,
        findWorker,
        manualWorkerSelect,
        loading,
    } = useMarkTime();

    return (
        <View style={styles.container}>
            <StackHeader title="Mark Time" description="Record attendance time activities" children={<WorkerLogged />} />

            <KeyboardAwareScrollView contentContainerStyle={styles.contentContainerStyle}>
                <WorkerIdentificationSection
                    firstImg={firstImg}
                    image={image}
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

                {/* <View style={styles.optionsContainer}>
                    <SettingToggleOptions
                        title="Enable Blinking"
                        description="Enable blinking detection during face recognition"
                        state={blinkingEnabled}
                        setState={setBlinkingEnabled}
                    />
                    <SettingToggleOptions
                        title="Enable Smile Detection"
                        description="Enable smile detection during face recognition"
                        state={smileDetectionEnabled}
                        setState={setSmileDetectionEnabled}
                    />
                </View> */}
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainerStyle: { flexGrow: 1, paddingBottom: hp(10) },
    optionsContainer: {
        gap: hp(1),
        paddingHorizontal: wp(5),
        marginTop: hp(2),
    },
});
