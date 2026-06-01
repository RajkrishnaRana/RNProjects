import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import React from 'react';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {font} from '../../common/Font';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function EventCardSmallAnimation({data}) {
    console.log(data);
    let birthday = false;

    if (data?.name?.includes('Birthday')) {
        birthday = true;
    } else {
        birthday = false;
    }

    return (
        <Animated.View
            entering={FadeInDown}
            // exiting={FadeOut}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {/* <ActivityIndicator color={colors.darkGreen} size={wp(15)} /> */}
            {data?.holiday ? (
                <LottieView
                    height={wp(16)}
                    width={wp(16)}
                    source={require('../../assets/Lottie/holidayPop.json')}
                    // source={source}
                    autoPlay
                    // loop={false}
                />
            ) : birthday ? (
                <LottieView
                    height={wp(16)}
                    width={wp(16)}
                    source={require('../../assets/Lottie/birthdayCake.json')}
                    // source={source}
                    autoPlay
                    loop
                />
            ) : (
                <LottieView
                    height={wp(16)}
                    width={wp(16)}
                    source={require('../../assets/Lottie/holidayPop.json')}
                    // source={source}
                    autoPlay
                    loop={false}
                />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({});

{
    /* <Text
        style={{
          marginTop: '-16%',
          fontSize: 20,
          fontFamily: font.proximaNovaBold,
          color: colors.darkGrey,
        }}>
        {/* Loading ... 
      </Text> */
}
