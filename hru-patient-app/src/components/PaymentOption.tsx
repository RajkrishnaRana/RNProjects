import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {useNavigation} from '../hooks/useNavigation';

interface PaymentOptionProps {
  imgSrc: ImageSourcePropType;
  title: string;
}

export default function PaymentOption({imgSrc, title}: PaymentOptionProps) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('PaymentSuccessfull')}>
      <Image source={imgSrc} style={{height: wp(7), width: wp(7)}} />
      <Text style={{fontSize: wp(4), color: colors.black, fontWeight: 'bold'}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    flexDirection: 'row',
    gap: wp(3),
    backgroundColor: colors.blueWhite,
    borderRadius: wp(5),
    height: hp(8),
    alignItems: 'center',
    elevation: 1,
    paddingHorizontal: wp(4),
  },
});
