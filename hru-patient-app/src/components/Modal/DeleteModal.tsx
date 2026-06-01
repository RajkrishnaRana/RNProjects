import {StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import BigButton from '../BigButton';
import {isTab} from '../../utils/isTab';

interface Props {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    deleteFunction: () => void;
}

export default function DeleteModal({isModalVisible, setModalVisible, deleteFunction}: Props) {
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const onPress = async () => {
        deleteFunction();
        setModalVisible(false);
    };

    return (
        <Modal visible={isModalVisible} animationType="fade" transparent>
            <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={styles.modalStyle}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <LottieView
                            autoPlay
                            loop={false}
                            source={require('../../assets/LottieFiles/delete.json')}
                            style={{width: isTab ? wp(12) : wp(20), height: isTab ? wp(12) : wp(20)}}
                        />

                        <Text style={styles.deleteModalText}>Are you sure you want to delete?</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: hp(2),
                                gap: wp(4),
                            }}>
                            <BigButton
                                title="Cancel"
                                onPress={() => setModalVisible(false)}
                                customStyle={[styles.deleteModalButton]}
                                customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                            />
                            <BigButton
                                title="Delete"
                                onPress={onPress}
                                customStyle={[styles.deleteModalButton, {backgroundColor: colors.red}]}
                                customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                            />
                        </View>
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
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
    },
    deleteModalButton: {
        width: wp(30),
        marginTop: 0,
        borderRadius: wp(10),
    },
});
