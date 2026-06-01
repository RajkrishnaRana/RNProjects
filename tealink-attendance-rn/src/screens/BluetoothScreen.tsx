import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import StackHeader from '../components/Headers/StackHeader';
import useBluetoothScreen from '../hooks/screenHooks/useBluetoothScreen';
import BluetoothConnectionSection from '../components/Sections/BluetoothConnectionSection';
import BluetoothWorkerProfileCard from '../components/Cards/BluetoothWorkerProfileCard';
import WeighmentCard from '../components/Cards/WeighmentCard';
import BluetoothMeterReadingCard from '../components/Cards/BluetoothMeterReadingCard';
import WorkerIdentificationSection from '../components/Sections/WorkerIdentificationSection';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import FlashOverlay from '../components/Flash';
import MidButton from '../components/Buttons/MidButton';
import { hp, wp } from '../utils/dimesion';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector } from '../hooks/typedReduxHooks';

type BluetoothScreenProps = RouteProp<RootStackParamList, 'Bluetooth'>;

export default function BluetoothScreen() {
    const { weighment, section, shift, batch, kamjari } = useRoute<BluetoothScreenProps>().params;
    const { flashEnabled, flashDuration, pluckingOneShot } = useAppSelector(state => state.setting);
    const {
        isBluetoothEnabled,
        connected,
        paired,
        currentWeight,
        connect,
        disconnect,
        loadPairedDevices,
        isConnecting,
        worker,
        setWorker,
        firstPluckingImg,
        pluckingImg,
        visible,
        setVisible,
        handlePress,
        handleSaveImages,
        workerCode,
        setWorkerCode,
        findWorker,
        manualWorkerSelect,
        identifyUser,
        pressIdentifyUser,
        goLive,
        loading,
        sendLocationData,
        isFlashing,
        setIsFlashing,
        pluckingCount,
    } = useBluetoothScreen(weighment, section, shift, batch, kamjari);

    return (
        <>
            <StackHeader
                title="Bluetooth"
                description={`Record Your Weighment ${weighment.id}`}
                customFunc={sendLocationData}
                customSecondFunc={disconnect}
            />

            <>
                {connected ? (
                    <KeyboardAwareScrollView style={styles.container}>
                        {/* Profile Section */}
                        <BluetoothWorkerProfileCard worker={worker} pluckingCount={pluckingCount} />

                        {/* Today's Record Section */}
                        {worker && <WeighmentCard weighment={weighment} worker={worker} />}

                        {/* Meter reading Section */}
                        <BluetoothMeterReadingCard
                            currentWeight={currentWeight}
                            identifyUser={identifyUser}
                            connected={connected}
                            isConnecting={isConnecting}
                        />

                        {identifyUser === 0 && <View style={styles.gap} />}

                        {pluckingImg && pluckingOneShot && <Image source={{ uri: pluckingImg?.base64 }} style={styles.faceImage} />}

                        {pluckingOneShot && identifyUser === 0 && (
                            <>
                                <MidButton
                                    title="Take Photo"
                                    onPress={handlePress}
                                    customStyle={[styles.identifyUserButton, { marginBottom: hp(-1.5) }]}
                                    customIcon={<Feather name="camera" size={wp(5)} color="white" />}
                                />
                            </>
                        )}

                        {/* Photo or Manual Reading section */}
                        {identifyUser === 0 && (
                            <MidButton
                                title="Identify User"
                                onPress={pressIdentifyUser}
                                customStyle={styles.identifyUserButton}
                                customIcon={<Feather name="user" size={wp(5)} color="white" />}
                            />
                        )}

                        {identifyUser > 0 && (
                            <WorkerIdentificationSection
                                firstImg={firstPluckingImg}
                                image={pluckingImg}
                                visible={visible}
                                setVisible={setVisible}
                                handlePress={handlePress}
                                handleSaveImages={handleSaveImages}
                                workerCode={workerCode}
                                setWorkerCode={setWorkerCode}
                                worker={worker}
                                setWorker={setWorker}
                                findWorker={findWorker}
                                manualWorkerSelect={manualWorkerSelect}
                                loading={loading}
                                disableWorkerImgSection={pluckingOneShot}
                            />
                        )}

                        {identifyUser > 0 && (
                            <MidButton
                                title="Go back to Live"
                                onPress={goLive}
                                customStyle={styles.identifyUserButton}
                                customIcon={<MaterialIcons name="bluetooth-searching" size={wp(5)} color="white" />}
                            />
                        )}

                        {/* For Flashing when the nfc detects */}
                        {flashEnabled && (
                            <FlashOverlay
                                isAnimationOn={isFlashing}
                                timing={flashDuration}
                                color="white"
                                onFlashComplete={() => setIsFlashing(false)}
                            />
                        )}
                    </KeyboardAwareScrollView>
                ) : (
                    <BluetoothConnectionSection
                        isBluetoothEnabled={isBluetoothEnabled}
                        paired={paired}
                        loadPairedDevices={loadPairedDevices}
                        connect={connect}
                        isConnecting={isConnecting}
                    />
                )}
            </>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flex: 1,
    },
    identifyUserButton: {
        marginHorizontal: wp(5),
        borderRadius: wp(5),
    },
    gap: {
        marginTop: hp(5),
    },
    faceImage: {
        height: hp(25),
        width: wp(30),
        borderRadius: 15,
        alignSelf: 'center',
    },
});
