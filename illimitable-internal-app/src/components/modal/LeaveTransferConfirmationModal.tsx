import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import BigButton from '../buttons/BigButton';

interface Props {
    isVisible: boolean;
    toggleModal: () => void;
    handlePress: () => void;
    loading: boolean;
    count: number;
}

export default function LeaveTransferConfirmationModal({isVisible, toggleModal, handlePress, loading, count}: Props) {
    return (
        <Modal animationType="fade" visible={isVisible} onRequestClose={toggleModal} transparent>
            <TouchableOpacity onPress={toggleModal} style={styles.backdrop} activeOpacity={1}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalBodyStyle}>
                        <LottieView
                            source={require('../../assets/Lottie/yayyy.json')}
                            autoPlay
                            loop={false}
                            style={{
                                height: wp(30),
                                width: wp(60),
                                marginBottom: hp(1),
                            }}
                        />
                        <Text style={styles.text}>
                            Are you sure you want to transfer your <Text style={{color: Colors.PRIMARY, fontWeight: 'bold'}}>{count}</Text> casual
                            leave?{' '}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <BigButton
                                title="Yes"
                                onPress={handlePress}
                                customMarginTop={{marginTop: hp(1.5)}}
                                customStyle={styles.button}
                                customTextStyle={{fontSize: wp(4)}}
                                linearGradientColorArray={['red', '#871c14']}
                                loading={loading}
                            />
                            <BigButton
                                title="No"
                                onPress={toggleModal}
                                customMarginTop={{marginTop: hp(1.5)}}
                                customStyle={styles.button}
                                customTextStyle={{fontSize: wp(4)}}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject, // full screen
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // always on top
    },
    modalBodyStyle: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginHorizontal: wp(10),
        padding: wp(5),
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        color: Colors.GREY,
        fontSize: wp(4.5),
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: hp(0),
        gap: wp(5),
    },
    button: {
        width: wp(30),
        height: 'auto',
        paddingVertical: hp(1.2),
    },
});
