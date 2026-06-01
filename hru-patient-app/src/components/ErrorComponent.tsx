import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default function ErrorComponent() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LottieView
                source={require('../assets/LottieFiles/noDataFound.json')}
                autoPlay
                loop
                style={{height: wp(40), width: wp(40)}}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
