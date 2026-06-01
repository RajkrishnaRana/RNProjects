import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import HorizontalList from '../screens/HorizontalList';
import {isIos} from '../utils/platform';

const doctorCardData = [
    {imgSrc: require('../assets/images/advertise1.jpeg')},
    {imgSrc: require('../assets/images/advertise2.jpeg')},
    {imgSrc: require('../assets/images/advertise3.jpeg')},
];

export default function DashboardAdvertisement() {
    return (
        <View style={{marginVertical: hp(2)}}>
            <HorizontalList
                data={doctorCardData}
                renderItem={({item}) => (
                    <Image source={item.imgSrc} style={{height: wp(35), width: isIos() ? wp(92) : wp(85), marginRight: wp(3), borderRadius: wp(5)}} />
                )}
                autoScrollEnabled
            />
        </View>
    );
}

const styles = StyleSheet.create({});
