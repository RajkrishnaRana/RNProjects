import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import InOutDetiailModal from '../modal/InOutDetailModal';
import LateInOutDetailModal from '../modal/LateInOutDetailModal';

interface AttendanceCardProps {
    item: any;
    approveButton?: boolean;
}

export default function LateCard({item, approveButton = false}: AttendanceCardProps) {
    console.log(item);

    // const inOutPresent = item?.display.includes('-');
    let clockIn, clockOut;
    const extractedDate = item?.date.split(' ').slice(0, 3).join(' ');

    if (item?.display) {
        const timeRange = item.display.split(' - '); // Splitting the time range string
        clockIn = timeRange[0]; // Extracting clockIn
        clockOut = timeRange[1]; // Extracting clockOut
        console.log(clockIn, clockOut);
    } else {
        clockIn = ''; // Default value if no display is available
        clockOut = '';
    }

    return (
        <>
            <View style={[styles.container, item?.hasIssue && {backgroundColor: Colors.TRANSPARENT_RED}]}>
                {
                    <View style={styles.dayDateBox}>
                        <Text style={styles.date}>{extractedDate}</Text>
                        <Text style={styles.supervisor}>{item?.supervisor || item?.user}</Text>
                    </View>
                }

                {/* CLOCK IN */}
                <View style={styles.timeContainer}>
                    <Image
                        source={require('../../assets/icons/time.png')}
                        style={[
                            styles.img,
                            {
                                tintColor: item?.in?.delayedInTime ? Colors.RED : Colors.GREEN,
                            },
                        ]}
                    />
                    <Text style={styles.time}>{clockIn ? clockIn : '--:--'}</Text>
                    <Text style={styles.subText}>Clock In</Text>
                </View>

                {/* CLOCK OUT */}
                <View style={styles.timeContainer}>
                    <Image
                        source={require('../../assets/icons/time-out.png')}
                        style={[
                            styles.img,
                            {
                                tintColor: item?.out?.earlyOutTime ? Colors.RED : Colors.YELLOW,
                            },
                        ]}
                    />
                    <Text style={styles.time}>{clockOut ? clockOut : '--:--'}</Text>
                    <Text style={styles.subText}>Clock Out</Text>
                </View>

                {/* DETAIL BUTTON */}
                <View style={styles.remarksContainer}>{item?.hasIssue && <LateInOutDetailModal approveButton={approveButton} data={item} />}</View>
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
        // height: hp(8),
        width: wp(30),
        flexDirection: 'column',
        // justifyContent: '',
        // borderWidth: wp(0.3),
        // borderColor: Colors.GREY,
        // paddingVertical: hp(0.5),
        // backgroundColor: Colors.WHITE,
        // alignItems: 'center',
        // justifyContent: 'center',
        // borderRadius: wp(2),
    },
    date: {
        color: Colors.LIGHT_BLUE,
        fontSize: wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    supervisor: {
        // justifyContent: 'flex-end',
        // marginTop: hp(2),
        color: Colors.GREY,
        fontSize: wp(3.5),
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
