import { ActivityIndicator, Text } from 'react-native';
import React from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { font } from '../../common/Font';
import { colors } from '../../common/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PageLoading = () => {
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOut}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.darkGreen} size={wp(15)} />
      {/* <LottieView
        height={wp(20)}
        width={wp(20)}
        source={require('../../../assets/Lottie/updatedLoadingLottie.json')}
        autoPlay
        loop
      /> */}
      {/* <Text
        style={{
          marginTop: '-16%',
          fontSize: 20,
          fontFamily: font.proximaNovaBold,
          color: colors.darkGrey,
        }}>
        {/* Loading ... 
      </Text> */}
    </Animated.View>
  );
};

export default PageLoading;
