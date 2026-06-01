import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';

interface Props {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UnderConstructionModal({isVisible, setIsVisible}: Props) {
    return (
        <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)} animationIn={'fadeInUp'} animationOut={'fadeOutDown'}>
            <View style={styles.container}>
                <Image source={require('../../assets/icons/coding.png')} style={styles.img} />
                <Text style={styles.text}>The Page is Under Development</Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: wp(3),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
    },
    img: {
        width: wp(20),
        height: wp(20),
        alignSelf: 'center',
        marginBottom: hp(2),
    },
    text: {
        textAlign: 'center',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
});
