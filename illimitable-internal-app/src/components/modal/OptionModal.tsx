import {StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import BigButton from '../buttons/BigButton';
// import BigButton from '../../BigButton';

interface Props {
    isModalVisible: boolean;
    approveButtonEnable?: boolean;
    deleteButtonEnable?: boolean;
    dialogueText?: string;
    setModalVisible: (value: boolean) => void;
    functionCall1?: () => void;
    functionCall2?: () => void;
    functionCall3?: () => void;
}

export default function OptionModal({
    dialogueText,
    isModalVisible,
    setModalVisible,
    approveButtonEnable = false,
    deleteButtonEnable = false,
    functionCall1, //APPROVE FUNCTION
    functionCall2, // DELETE FUNCTION
    functionCall3,
}: Props) {
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // APPROVE FUNCTION----------------------------------
    const onPress1 = async () => {
        functionCall1 && functionCall1();
        setModalVisible(false);
    };
    // DELETE FUNCTION----------------------------------
    const onPress2 = async () => {
        functionCall2 && functionCall2();
        setModalVisible(false);
    };

    return (
        <Modal visible={isModalVisible} transparent>
            <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={styles.modalStyle}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        {/* <LottieView
                            autoPlay
                            loop={false}
                            source={require('../../assets/LottieFiles/delete.json')}
                            style={{width: wp(20), height: wp(20)}}
                        /> */}

                        <Text style={styles.deleteModalText}>{dialogueText || 'Choose an option !'}</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: hp(2),
                                gap: wp(2),
                            }}>
                            <BigButton
                                animationTypeIn="FadeIn"
                                animationTypeOut="FadeOut"
                                title="Cancel"
                                onPress={() => setModalVisible(false)}
                                linearGradientColorArray={[Colors.GREY, Colors.GREY]}
                                customMarginTop={{marginTop: 0}}
                                customStyle={[styles.deleteModalButton]}
                                customTextStyle={{fontSize: wp(4)}}
                            />
                            {deleteButtonEnable && (
                                <BigButton
                                    animationTypeIn="FadeIn"
                                    animationTypeOut="FadeOut"
                                    title="Delete"
                                    onPress={onPress2}
                                    linearGradientColorArray={['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.5)']}
                                    customMarginTop={{marginTop: 0}}
                                    customStyle={[styles.deleteModalButton]}
                                    customTextStyle={{fontSize: wp(4)}}
                                />
                            )}
                            {approveButtonEnable && (
                                <BigButton
                                    animationTypeIn="FadeIn"
                                    animationTypeOut="FadeOut"
                                    title="Approve"
                                    onPress={onPress1}
                                    linearGradientColorArray={[Colors.GREEN, Colors.GREEN]}
                                    customMarginTop={{marginTop: 0}}
                                    customStyle={[styles.deleteModalButton]}
                                    customTextStyle={{fontSize: wp(4)}}
                                />
                            )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginHorizontal: wp(10),
        padding: wp(5),
        alignItems: 'center',
    },
    deleteModalText: {
        textAlign: 'center',
        color: Colors.GREY,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    deleteModalButton: {
        width: wp(25),
        height: hp(6),
        borderRadius: wp(10),
    },
});
