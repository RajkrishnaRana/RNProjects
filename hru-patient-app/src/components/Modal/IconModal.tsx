import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedbackBase,
} from 'react-native';
import React, {useState} from 'react';
// import Modal from 'react-native-modal';
import {colors} from '../../common/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function IconModal() {
  const [isVisible, setIsVisible] = useState(false);

  const handleInfoIconPress = () => {
    setIsVisible(!isVisible);
  };
  return (
    <>
      <TouchableOpacity onPress={handleInfoIconPress}>
        <Image
          source={require('../../assets/icons/info.png')}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        // animationIn={'fadeInUp'}
        // animationOut={'fadeOutDown'}
        // backdropColor={'#000'}
        // backdropOpacity={0.5}
        // onBackdropPress={() => {
        //     setIsVisible(!isVisible);
        // }}
        transparent>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <TouchableWithoutFeedbackBase>
            <View style={styles.modalContent}>
              <Text style={styles.text}>
                Doctor will be calling you on WhatsApp. Please make sure you
                have WhatsApp installed on your phone using the HRU registered
                number.
              </Text>
            </View>
          </TouchableWithoutFeedbackBase>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: wp(5),
    padding: wp(3),
    margin: wp(4),
  },
  text: {
    fontSize: wp(3),
    color: colors.grey,
    textAlign: 'center',
  },
});

export default IconModal;
