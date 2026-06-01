import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {inDevelopmentMessage} from '../../utils/developmentProgress';

export default function MoreOptions() {
  return (
    <View>
      <TouchableOpacity onPress={() => inDevelopmentMessage()}>
        <Image
          source={require('../../assets/icons/dots.png')}
          style={{
            height: wp(6.5),
            width: wp(6.5),
            alignSelf: 'center',
            tintColor: colors.primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
