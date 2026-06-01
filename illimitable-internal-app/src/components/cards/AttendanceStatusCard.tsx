import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, {FadeInDown} from 'react-native-reanimated';

const cardColors = {
    'No Issue': {bar: '#34c75b', body: 'rgba(52, 199, 91, 0.1)'},
    Absents: {bar: '#fabf0c', body: 'rgba(250, 191, 12, 0.1)'},
    'Late In': {bar: '#d40f19', body: 'rgba(212, 15, 25, 0.1)'},
    'Total Leaves': {bar: '#ba06d6', body: 'rgba(186, 6, 214, 0.1)'},
};

export default function AttendanceStatusCard({title, data}: {title: keyof typeof cardColors; data: number}) {
    return (
        <Animated.View
            style={[styles.container, {backgroundColor: cardColors[title].body, borderTopColor: cardColors[title].bar}]}
            entering={FadeInDown.springify()}>
            <Text style={[styles.data, {color: cardColors[title].bar}]}>{data}</Text>
            <Text style={[styles.title, {color: cardColors[title].bar}]}>{title}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: wp(39),
        borderRadius: 10,
        paddingVertical: hp(1.5),
        paddingLeft: wp(5),
        borderTopWidth: 3,
    },
    data: {
        fontSize: wp(5.5),
        fontWeight: 'bold',
    },
    title: {
        fontSize: wp(3.5),
    },
});
