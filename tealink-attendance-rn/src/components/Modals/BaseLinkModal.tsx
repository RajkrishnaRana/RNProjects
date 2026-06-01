import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { wp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import { useLogin } from '../../hooks/authHooks/useLogin';
import Modal from 'react-native-modal';

export default function BaseLinkModal() {
    const { openBaseLinkModal, modal } = useLogin();

    return (
        <>
            <TouchableOpacity style={styles.configContainer} onPress={openBaseLinkModal}>
                <FontAwesome6 name="gear" size={wp(3.5)} color={colors.green} iconStyle="solid" style={{ marginRight: wp(2) }} />
                <Text style={styles.configText}>Configuration</Text>
            </TouchableOpacity>

            <Modal isVisible={modal} onBackdropPress={openBaseLinkModal}>
                <View>
                    <Text>Modal</Text>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    configContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: wp(2),
        width: wp(60),
        backgroundColor: colors.white,
        borderRadius: 30,
    },
    configText: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
        textAlign: 'center',
    },
});
