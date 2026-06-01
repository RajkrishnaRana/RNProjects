import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';

export default function MedsIntakeModal() {
    return (
        <Modal animationType="fade" transparent={true} visible={showModal} onRequestClose={dismissAlarm}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        source={require('../assets/images/pills.png')}
                        style={{
                            alignSelf: 'center',
                            height: wp(20),
                            width: wp(20),
                            marginBottom: wp(2),
                        }}
                    />
                    <Text style={styles.modalTitle}>Medicine Intake Reminder!</Text>
                    <Text style={styles.modalMessage}>
                        It's <Text style={styles.boldText}>{currentAlarm}</Text>, time to take your medicine -{' '}
                        <Text style={styles.boldText}>{medsName}</Text>
                    </Text>
                    <TouchableOpacity style={styles.dismissButton} onPress={dismissAlarm}>
                        <Text style={styles.dismissButtonText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp(0.5),
    },
    modalMessage: {
        fontSize: wp(3.8),
        color: '#666',
        marginBottom: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
    dismissButton: {
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingVertical: hp(1),
        paddingHorizontal: wp(7),
        alignSelf: 'flex-end',
    },
    dismissButtonText: {
        color: '#fff',
        fontSize: wp(3.5),
        fontWeight: '600',
    },
});
