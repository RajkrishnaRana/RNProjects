import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import Toast from 'react-native-simple-toast';

export default function PopularCategories() {
    return (
        <View style={{marginTop: hp(2)}}>
            <Text style={styles.header}>PopularCategories</Text>
            <Image
                source={require('../assets/images/popularCategories.png')}
                style={{marginVertical: hp(2), height: wp(110), width: wp(80)}}
            />
            <TouchableOpacity
                style={{marginTop: hp(1), alignItems: 'center'}}
                onPress={() => {
                    Toast.show('Page is in development', Toast.SHORT);
                }}>
                <Text style={styles.link}>View all</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: wp(5),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    link: {
        fontSize: wp(3.8),
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        color: colors.primary,
    },
});
