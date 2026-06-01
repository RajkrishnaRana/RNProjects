import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {inDevelopmentMessage} from '../../utils/developmentProgress';

export default function HelpButton() {
  return (
    <View>
      <TouchableOpacity onPress={() => inDevelopmentMessage()}>
        <Image
          source={require('../../assets/icons/help.png')}
          style={{
            height: wp(7.5),
            width: wp(7.5),
            alignSelf: 'center',
            tintColor: colors.primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
