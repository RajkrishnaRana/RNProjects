import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function LoginHeader() {
    return (
        <View style={{height: hp(20)}}>
            <Text>LoginHeader</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
