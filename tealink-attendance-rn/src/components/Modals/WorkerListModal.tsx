import { StyleSheet } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import Modal from 'react-native-modal';
import { colors } from '../../common/colors';
import { hp, wp } from '../../utils/dimesion';
import WorkerMaster from '../../model/workerMaster';
import WorkerCard from '../Cards/WorkerCard';
import { LegendList } from '@legendapp/list';

interface Props {
    isModalVisible: boolean;
    workerList: WorkerMaster[];
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    setAnotherModalVisible: Dispatch<SetStateAction<boolean>>;
    setWorker: Dispatch<SetStateAction<WorkerMaster | undefined>>;
}

export default function WorkerListModal({ isModalVisible, workerList, setModalVisible, setAnotherModalVisible, setWorker }: Props) {
    const closeModal = () => setModalVisible(false);
    const yesPress = (worker: WorkerMaster) => {
        setWorker(worker);
        setModalVisible(false);
        setTimeout(() => setAnotherModalVisible(true), 200);
    };

    return (
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal} animationIn={'fadeInUp'} animationOut={'fadeOutDown'} style={styles.modal}>
            <LegendList
                data={workerList}
                renderItem={({ item }) => <WorkerCard item={item} forModal handlePress={() => yesPress(item)} />}
                keyExtractor={item => item.id}
                recycleItems
                style={styles.container}
                contentContainerStyle={styles.contentContainerStyle}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        paddingHorizontal: wp(2),
        paddingTop: hp(1),
        backgroundColor: colors.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        maxHeight: hp(60),
    },
    contentContainerStyle: {
        paddingBottom: 20,
        marginTop: 10,
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
