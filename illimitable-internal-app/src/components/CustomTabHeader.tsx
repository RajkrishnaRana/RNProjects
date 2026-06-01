import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function CustomTabHeader({title}: {title: string}) {
    return (
        <LinearGradient
            colors={[Colors.PRIMARY, Colors.PRIMARY, Colors.LIGHT_BLUE]}
            style={styles.container}>
            <View style={styles.bodyContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        borderBottomLeftRadius: wp(8),
        borderBottomRightRadius: wp(8),
    },
    bodyContainer: {
        paddingTop: hp(0.5),
        paddingBottom: hp(2),
        paddingHorizontal: wp(5),
    },
    title: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: Colors.WHITE,
        textAlign: 'center',
    },
});
