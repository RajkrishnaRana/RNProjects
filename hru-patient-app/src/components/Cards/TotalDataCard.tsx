import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ImageSourcePropType} from 'react-native';

interface TotalDataCardProps {
  title: string;
  imgSrc: ImageSourcePropType;
  thisMonthDesc: string;
  totalDesc: string;
}

export default function TotalDataCard({
  title,
  imgSrc,
  thisMonthDesc,
  totalDesc,
}: TotalDataCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image
          source={imgSrc}
          style={{height: wp(8), width: wp(8)}}
          tintColor={colors.darkBlue}
        />
        <Text style={styles.header}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: hp(0.5),
        }}>
        <Text style={styles.detailText}>{thisMonthDesc}</Text>
        <Text style={styles.detailText}>{totalDesc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blueWhite,
    borderRadius: wp(5),
    elevation: 3,
    padding: wp(3),
    width: wp(45),
  },
  bodyContainer: {
    flexDirection: 'row',
    gap: wp(3),
    alignItems: 'center',
  },
  header: {
    fontSize: wp(3.7),
    fontWeight: 'bold',
    color: colors.primary,
  },
  detailText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: colors.darkBlue,
  },
});
