import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface WeeklyOffCardProps {
    item: DayData;
}

export default function WeeklyOffCard({item}: WeeklyOffCardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Weekend Off : {item?.date} {item?.dayOfWeek}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.TRANSPARENT_YELLO,
        borderRadius: 10,
        padding: 10,
        marginBottom: hp(0.5),
    },
    text: {
        textAlign: 'center',
        color: Colors.YELLOW,
        fontSize: wp(4),
    },
});
