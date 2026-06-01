import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function Breakline() {
  return (
    <View
      style={{
        height: hp(0.1),
        backgroundColor: colors.grey,
        marginVertical: hp(2),
      }}
    />
  );
}

const styles = StyleSheet.create({});
