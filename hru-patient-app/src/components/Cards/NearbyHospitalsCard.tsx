import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  nearbyHospitalsProps,
  specialitiesProps,
} from '../../screens/BookAppointmentScreen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';
import IconFontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export default function NearbyHospitalsCard({
  item,
}: {
  item: nearbyHospitalsProps;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.push('SpecialitiesBasedDoctors');
      }}>
      <Image
        source={item.imgSrc}
        style={{
          height: wp(35),
          width: wp(50),
          borderTopRightRadius: wp(2),
          borderTopLeftRadius: wp(2),
        }}
      />

      <Text style={styles.text}>{item.title}</Text>
      <View style={{flexDirection: 'row', gap: wp(1), alignItems: 'center'}}>
        <IconFontAwesome6 name="clock" size={wp(4)} color={colors.primary} />
        <Text style={styles.textBottom}>{item.timeDistance}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: wp(6),
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: wp(2),
    paddingBottom: wp(1),
    // elevation: 5,
    shadowColor: '#000',
    borderWidth: wp(0.2),
    borderColor: colors.lightGrey,
  },
  text: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    marginTop: hp(0.5),
    color: colors.black,
  },
  textBottom: {
    fontSize: wp(3),
    // fontWeight: 'b,
    color: colors.black,
  },
});
