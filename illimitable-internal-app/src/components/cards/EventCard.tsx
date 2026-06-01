import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EventCardSmallAnimation from '../lottieComponent/EventCardSmallAnimation';
import {Colors} from '../../common/colors';

export default function EventCard({event}: {event: any}) {
    return (
        <View style={styles.eventItem}>
            <View
                style={{
                    width: wp(60),
                }}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{event.date}</Text>
                    {event.holiday && (
                        <View style={styles.holidayBadge}>
                            <Text style={styles.holidayText}>Holiday</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.eventName}>{event.name}</Text>
            </View>

            <EventCardSmallAnimation data={event} />
        </View>
    );
}

const styles = StyleSheet.create({
    eventItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: wp(0.3),
        borderColor: Colors.LIGHT_BLUE,
        marginBottom: hp(1.5),
        padding: wp(2.5),
        backgroundColor: '#f9f9f9',
        borderRadius: wp(3),
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: wp(4),
        color: '#666',
        marginRight: 8,
    },
    holidayBadge: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.2),
        borderRadius: wp(3.5),
    },
    holidayText: {
        color: 'white',
        fontSize: wp(3.5),
        fontWeight: '500',
    },
    eventName: {
        fontSize: wp(4),
        fontWeight: '600',
        color: '#333',
    },
});
