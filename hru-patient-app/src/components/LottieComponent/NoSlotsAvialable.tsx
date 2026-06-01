import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

export default function NoSlotsAvialable({customText}: {customText?: string}) {
    return (
        <Animated.View style={styles.container}>
            <LottieView
                style={{height: 100, width: 100}}
                speed={2}
                source={require('../../assets/LottieFiles/noSlotsAvialable.json')}
                autoPlay
                loop
            />
            <Text style={styles.noDataAvailable}>
                {customText ? customText : 'No Slots Available for this Clinic'}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    noDataAvailable: {
        marginTop: hp(0.5),
        textAlign: 'center',
        color: colors.darkBlue,
        fontSize: wp(5),
        fontWeight: 'bold',
    },
});
