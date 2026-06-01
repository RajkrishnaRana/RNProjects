import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CheckTime} from './cards/ClockCard';
import Animated, {FadeInDown} from 'react-native-reanimated';

interface Props {
    imgSrc: ImageSourcePropType;
    title: string;
    time: CheckTime | null;
}

export default function TimeRecord({imgSrc, title, time}: Props) {
    const finalTime = time?.showTime;

    return (
        <Animated.View style={styles.container} entering={FadeInDown.springify()}>
            <Image source={imgSrc} style={styles.img} />
            <Text style={{color: Colors.PRIMARY, fontWeight: 'bold'}}>{finalTime ? finalTime : '-- : --'}</Text>
            <Text style={{color: Colors.GREY}}>{title}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    img: {
        height: wp(9),
        width: wp(9),
        tintColor: Colors.PRIMARY,
        marginBottom: hp(0.5),
    },
});
