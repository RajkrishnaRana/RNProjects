import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import SectionIconHeader from '../Headers/SectionIconHeader';
import { colors } from '../../common/colors';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { hp, wp } from '../../utils/dimesion';
import MidButton from '../Buttons/MidButton';
import ImageViewer from '@react-native-ohos/react-native-image-zoom-viewer';
import useWorkerIdentificationSection from '../../hooks/componentHooks/useWorkerIdentificationSection';
import ManualWorkerModal from '../Modals/ManualWorkerModal';
import WorkerMaster from '../../model/workerMaster';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import { android_ripple_value } from '../../constants/screenOptions';
import WorkerListModal from '../Modals/WorkerListModal';

interface Props {
    firstImg: any;
    image: any;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    handlePress: () => void;
    handleSaveImages: () => void;
    workerCode: string;
    setWorkerCode: Dispatch<SetStateAction<string>>;
    worker: WorkerMaster | undefined;
    workerCount?: number;
    findWorker: () => Promise<WorkerMaster[]>;
    manualWorkerSelect: () => void;
    loading?: boolean;
    disableWorkerImgSection?: boolean;
    setWorker: Dispatch<SetStateAction<WorkerMaster | undefined>>;
}

export default function WorkerIdentificationSection({
    image,
    visible,
    setVisible,
    handlePress,
    workerCode,
    setWorkerCode,
    worker,
    setWorker,
    workerCount,
    findWorker,
    manualWorkerSelect,
    loading,
    disableWorkerImgSection = false,
}: Props) {
    const { disableManualEntry } = useAppSelector(state => state.auth);
    const { isModalVisible, setModalVisible, handleManualWorkerSelect, workerList, isWorkerListModalVisible, setWorkerListModalVisible } =
        useWorkerIdentificationSection(findWorker);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <SectionIconHeader
                        customIconContainerColor={colors.lightBlue}
                        customIcon={<MaterialDesignIcons name="qrcode-edit" size={15} color={colors.blue} />}
                        title="Worker Identification"
                        description="Scan Your NFC card to mark attendance"
                        customTextColor={colors.black}
                        cutomDescriptionTextColor={colors.grey}
                    />
                    {workerCount !== undefined && (
                        <View style={styles.attendanceCountContainer}>
                            <Text style={styles.attendanceCount}>{workerCount}</Text>
                        </View>
                    )}
                </View>

                {!disableWorkerImgSection && (
                    <Pressable android_ripple={android_ripple_value} style={styles.workerAttendanceContainer} onPress={handlePress}>
                        {image ? (
                            <Pressable onPress={() => setVisible(true)} android_ripple={android_ripple_value}>
                                <Image source={{ uri: image.base64 }} style={styles.faceImage} />
                            </Pressable>
                        ) : (
                            <>
                                <View style={styles.workerIllustrationOutside}>
                                    <View style={styles.workerIllustrationInside}>
                                        <Image source={require('../../assets/icons/person.png')} style={styles.img} />
                                    </View>
                                </View>

                                <Text style={styles.workerIllustrationTitle}>Worker Identity</Text>
                                <Text style={styles.workerIllustrationDescription}>Touch to capture the worker image</Text>
                            </>
                        )}
                    </Pressable>
                )}

                {disableWorkerImgSection && <View style={styles.gap} />}

                {!disableManualEntry && (
                    <>
                        <Text style={styles.label}>Manually Select Worker : </Text>
                        <View style={styles.mannualWorkerContainer}>
                            <TextInput
                                placeholder="Worker Code / First Name"
                                placeholderTextColor={colors.grey}
                                value={workerCode}
                                onChangeText={setWorkerCode}
                                style={styles.textInput}
                            />
                            <MidButton
                                title="Select"
                                onPress={handleManualWorkerSelect}
                                customStyle={styles.button}
                                customTextStyle={styles.buttonText}
                                loading={loading}
                            />
                        </View>
                    </>
                )}
            </View>
            <Modal visible={visible} transparent={true} animationType="fade" style={StyleSheet.absoluteFill}>
                <ImageViewer imageUrls={[{ url: image?.base64 || '' }]} />
                <Pressable
                    android_ripple={{ color: colors.rippleBlack, borderless: false, radius: 200, foreground: true }}
                    onPress={() => setVisible(false)}
                    style={styles.closeButton}
                >
                    <MaterialDesignIcons name="close" size={20} color={colors.black} />
                </Pressable>
            </Modal>

            <WorkerListModal
                isModalVisible={isWorkerListModalVisible}
                setModalVisible={setWorkerListModalVisible}
                workerList={workerList}
                setWorker={setWorker}
                setAnotherModalVisible={setModalVisible}
            />

            <ManualWorkerModal
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                worker={worker}
                manualWorkerSelect={manualWorkerSelect}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 20,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    attendanceCountContainer: {
        height: 35,
        width: 35,
        borderRadius: 9,
        backgroundColor: colors.veryLightGreen,
        borderColor: colors.lightGreen,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attendanceCount: {
        color: colors.lightGreen,
        fontSize: 15,
        fontWeight: 'bold',
    },
    workerAttendanceContainer: {
        borderWidth: 0.5,
        borderColor: colors.darkGrey,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
        paddingTop: 10,
        paddingBottom: 10,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    workerIllustrationOutside: {
        height: 80,
        width: 80,
        borderRadius: 15,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '10deg' }],
        marginTop: 10,
        marginBottom: 5,
    },
    workerIllustrationInside: {
        height: 68,
        width: 68,
        borderRadius: 10,
        backgroundColor: colors.white,
        transform: [{ rotate: '-10deg' }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceImage: {
        height: hp(25),
        width: wp(30),
        borderRadius: 15,
    },
    img: {
        height: 45,
        width: 45,
    },
    workerIllustrationTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.black,
        marginTop: 15,
    },
    workerIllustrationDescription: {
        color: colors.darkGrey,
        fontSize: 12,
    },
    label: {
        fontSize: 12,
        color: colors.black,
        marginBottom: 5,
    },
    mannualWorkerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    textInput: {
        fontSize: 12,
        color: colors.black,
        borderWidth: 0.8,
        borderColor: colors.grey,
        backgroundColor: colors.offWhite,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: wp(55),
    },
    button: {
        width: wp(25),
        marginTop: 0,
        backgroundColor: colors.lightGreen,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 12,
    },
    closeButton: {
        position: 'absolute',
        right: wp(45),
        bottom: hp(5),
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
    },
    gap: {
        height: hp(2),
    },
});
