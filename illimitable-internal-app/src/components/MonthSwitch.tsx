import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';

interface MonthSwitchProps {
    showmonth: {
        showDate: string;
        exactDate: Date;
    };
    prevMonth: () => void;
    nextMonth: () => void;
}

export default function MonthSwitch({showmonth, prevMonth, nextMonth}: MonthSwitchProps) {
    const isCurrentMonth = showmonth.exactDate.getMonth() === new Date().getMonth();
    const variableOpacity = isCurrentMonth ? 0.3 : 1;

    return (
        <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.arrowContainer} onPress={prevMonth}>
                <Image source={require('../assets/icons/left-arrow.png')} style={styles.img} />
            </TouchableOpacity>
            <View style={styles.dateTextContainer}>
                <Text style={styles.dateText}>{showmonth.showDate}</Text>
                <Image source={require('../assets/icons/calendar.png')} style={styles.img} tintColor={Colors.LIGHT_BLUE} />
            </View>

            <TouchableOpacity onPress={nextMonth} style={[styles.arrowContainer, {opacity: variableOpacity}]} disabled={isCurrentMonth}>
                <Image source={require('../assets/icons/right-arrow.png')} style={styles.img} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: 'row',
        width: wp(80),
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    dateTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateText: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: Colors.LIGHT_BLUE,
    },
    img: {height: wp(4), width: wp(4), tintColor: Colors.LIGHT_BLUE},
});
