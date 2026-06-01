import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InOutDetiailModal from '../modal/InOutDetailModal';

interface AttendanceCardProps {
    item: DayData;
}

export default function AttendanceCard({item}: AttendanceCardProps) {
    const inOutPresent = item?.display.includes('-');
    let clockIn, clockOut;

    if (inOutPresent) {
        clockIn = item?.display.split('-')[0];
        clockOut = item?.display.split('-')[1];
    } else {
        clockIn = item?.display;
        clockOut = '--:--';
    }

    function calculateTimeDifference(display: string) {
        // Split the display string into startTime and endTime
        const [startTime, endTime] = display.split(' - ');

        // Get today's date in YYYY-MM-DD format
        const now = new Date();
        const todayDateString = now.toISOString().split('T')[0];

        // Convert time strings to 24-hour format
        const convertTo24Hour = (time: string) => {
            const [timePart, modifier] = time?.split(' ');
            let [hours, minutes] = timePart.split(':');
            if (modifier === 'pm' && hours !== '12') {
                hours = String(Number(hours) + 12);
            }
            if (modifier === 'am' && hours === '12') {
                hours = '00';
            }
            return `${hours}:${minutes}`;
        };

        const startTime24 = convertTo24Hour(startTime);
        const endTime24 = convertTo24Hour(endTime);

        // Create Date objects for start and end times
        const startDate = new Date(`${todayDateString}T${startTime24}:00`);
        const endDate = new Date(`${todayDateString}T${endTime24}:00`);

        // Calculate the difference in milliseconds
        let differenceInMilliseconds = endDate.getTime() - startDate.getTime();

        // If the end time is earlier than the start time, it means it goes past midnight
        if (differenceInMilliseconds < 0) {
            differenceInMilliseconds += 24 * 60 * 60 * 1000; // Add 24 hours
        }

        // Calculate total hours and remaining minutes
        const totalMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60; // Get remaining minutes

        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`; // Format as "hrs:min"
    }

    function remarksColor(data: string, issue: boolean) {
        if (data === 'WORKDAY') return issue ? Colors.RED : Colors.LIGHTGREEN;
        else if (data === 'ABSENT') return Colors.RED;
    }

    return (
        <>
            <View
                style={[
                    styles.container,
                    item?.hasIssue && {backgroundColor: Colors.TRANSPARENT_RED},
                ]}>
                <View style={styles.dayDateBox}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.day}>{item.dayOfWeek}</Text>
                </View>

                <View style={styles.timeContainer}>
                    <Image
                        source={require('../../assets/icons/time.png')}
                        style={[styles.img, {tintColor: Colors.GREEN}]}
                    />
                    <Text style={styles.time}>
                        {item?.type === 'WORKDAY' ? clockIn : '--:--'}
                    </Text>
                    <Text style={styles.subText}>Clock In</Text>
                </View>

                <View style={styles.timeContainer}>
                    <Image
                        source={require('../../assets/icons/time-out.png')}
                        style={[styles.img, {tintColor: Colors.YELLOW}]}
                    />
                    <Text style={styles.time}>
                        {item?.type === 'WORKDAY' ? clockOut : '--:--'}
                    </Text>
                    <Text style={styles.subText}>Clock Out</Text>
                </View>

                <View style={styles.timeContainer}>
                    <Image
                        source={require('../../assets/icons/time-check.png')}
                        style={[
                            {
                                height: wp(5.2),
                                width: wp(5.2),
                                marginBottom: hp(0.2),
                                tintColor: Colors.LIGHT_BLUE,
                            },
                        ]}
                    />
                    <Text style={styles.time}>
                        {item?.type === 'WORKDAY'
                            ? inOutPresent
                                ? calculateTimeDifference(item?.display)
                                : '--:--'
                            : '--:--'}
                    </Text>
                    <Text style={styles.subText}>Total Hrs</Text>
                </View>

                <View style={styles.remarksContainer}>
                    {item?.type !== 'WORKDAY' && (
                        <Text
                            style={[
                                styles.remarksText,
                                {
                                    color: remarksColor(
                                        item?.type,
                                        item?.hasIssue,
                                    ),
                                },
                            ]}>
                            {item?.type}
                        </Text>
                    )}

                    {item?.type === 'WORKDAY' && (
                        <InOutDetiailModal data={item} />
                    )}
                </View>
            </View>
            <View style={styles.breakLine} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        flexDirection: 'row',
        borderRadius: wp(2),
        alignItems: 'center',
    },
    dayDateBox: {
        borderWidth: wp(0.3),
        borderColor: Colors.GREY,
        paddingVertical: hp(0.5),
        width: wp(12),
        borderRadius: wp(2),
    },
    date: {
        color: Colors.LIGHT_BLUE,
        fontSize: wp(5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    day: {
        color: Colors.BLACK,
        fontSize: wp(4),
        textAlign: 'center',
    },
    breakLine: {
        borderWidth: hp(0.03),
        color: ' #e6e4df',
        marginVertical: hp(0.5),
        borderStyle: 'dashed',
    },
    timeContainer: {
        width: wp(19),
        alignItems: 'center',
    },
    img: {
        height: wp(5),
        width: wp(5),
        marginBottom: hp(0.2),
    },
    time: {
        fontSize: wp(3.2),
        color: Colors.BLACK,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: wp(3),
        color: Colors.GREY,
        textAlign: 'center',
    },
    remarksText: {
        fontSize: wp(3),
        color: Colors.GREY,
        fontWeight: 'bold',
    },
    remarksContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(0.5),
    },
});
