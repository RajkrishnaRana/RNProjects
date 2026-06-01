import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import { wp } from '../../utils/dimesion';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { ConnectingStatus } from '../../hooks/screenHooks/useBluetoothScreen';
import Animated, { LinearTransition } from 'react-native-reanimated';

interface Props {
    currentWeight: number;
    identifyUser: number;
    connected: BluetoothDevice | null;
    isConnecting: ConnectingStatus;
}

export default function BluetoothMeterReadingCard({ currentWeight, identifyUser, connected, isConnecting }: Props) {
    return (
        <Animated.View style={styles.container} layout={LinearTransition}>
            <Text style={styles.currentReading}>Current Reading</Text>
            <Text style={styles.value}>
                {identifyUser ? identifyUser : currentWeight} <Text style={styles.unit}>KG</Text>
            </Text>
            <View style={styles.onlineOrOfflineContainer}>
                <View style={[styles.ball, { backgroundColor: isConnecting.status ? colors.red : colors.green }]} />
                <Text style={[styles.statusText, identifyUser > 0 && styles.finalWeight]}>
                    {isConnecting.status
                        ? `Disconnected, Trying to connect again... (${connected?.name})`
                        : identifyUser
                            ? `Measured Final Weight`
                            : `Live from Bluetooth Meter (${connected?.name})`}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginHorizontal: wp(3),
        shadowColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    currentReading: {
        fontSize: wp(3),
        color: colors.black,
    },
    value: {
        fontSize: wp(12),
        color: colors.green,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: wp(6),
        color: colors.black,
        fontWeight: 'bold',
    },
    onlineOrOfflineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
    },
    ball: {
        height: wp(1.5),
        width: wp(1.5),
        borderRadius: wp(5),
    },
    statusText: {
        fontSize: wp(3),
        color: colors.darkGrey,
        fontWeight: '400',
    },
    finalWeight: { color: colors.green, fontWeight: 'bold' },
});
