import { StyleSheet, Text, View } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import Modal from 'react-native-modal';
import { colors } from '../../common/colors';
import SmallButton from '../Buttons/SmallButton';
import { hp, wp } from '../../utils/dimesion';
import { trigger } from 'react-native-haptic-feedback';
import WorkerMaster from '../../model/workerMaster';

interface Props {
    isModalVisible: boolean;
    worker: WorkerMaster | undefined;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    manualWorkerSelect: () => void;
}

export default function ManualWorkerModal({ isModalVisible, worker, setModalVisible, manualWorkerSelect }: Props) {
    const closeModal = () => setModalVisible(false);
    const yesPress = () => {
        manualWorkerSelect();
        trigger('impactMedium');
        setModalVisible(false);
    };

    return (
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal} animationIn={'fadeInUp'} animationOut={'fadeOutDown'}>
            <View style={styles.container}>
                <Text style={styles.header}>{worker?.workerName}</Text>
                <Text style={[styles.body, styles.bold]}>Id : {worker?.workerCode}  |  Book : {worker?.workerBookName}</Text>
                <Text style={styles.body}>Are you sure you want to log data for this worker?</Text>

                <View style={styles.buttonContainer}>
                    <SmallButton onPress={yesPress} title="Yes" />
                    <SmallButton onPress={closeModal} title="No" customTextStyle={{ color: colors.red }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
    },
    header: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    body: {
        fontSize: wp(4),
        color: colors.darkGrey,
        marginTop: 2,
    },
    bold: {
        fontWeight: 'bold',
        lineHeight: hp(3),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: wp(5),
    },
});
