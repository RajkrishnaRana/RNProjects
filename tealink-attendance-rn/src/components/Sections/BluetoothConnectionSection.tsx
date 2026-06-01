import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import BluetoothStatusCard from '../Cards/BluetoothStatusCard';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { hp, wp } from '../../utils/dimesion';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '../../common/colors';
import Lucide from '@react-native-vector-icons/lucide';
import MidButton from '../Buttons/MidButton';
import Toast from 'react-native-toast-message';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { ConnectingStatus } from '../../hooks/screenHooks/useBluetoothScreen';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { android_ripple_value } from '../../constants/screenOptions';

interface Props {
    isBluetoothEnabled: boolean;
    paired: BluetoothDevice[];
    loadPairedDevices: () => Promise<void>;
    connect: (device: BluetoothDevice) => Promise<void>;
    isConnecting: ConnectingStatus;
}

export default function BluetoothConnectionSection({ isBluetoothEnabled, paired, loadPairedDevices, connect, isConnecting }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const settingPress = async () => {
        try {
            RNBluetoothClassic.openBluetoothSettings();
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Unable to open settings', text2: 'Please try again' });
        }
    };

    const onReload = async () => {
        setIsLoading(true);
        await loadPairedDevices();
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
    };

    return (
        <View style={styles.container}>
            {/* Bluetooth Connection Section */}
            <BluetoothStatusCard isBluetoothEnabled={isBluetoothEnabled} />

            {/* Paired Device Section */}
            {isBluetoothEnabled ? (
                <View style={styles.deviceContainer}>
                    <View style={styles.pairedDeviceHeader}>
                        <View style={styles.pairedDeviceText}>
                            <MaterialIcons name="bluetooth" size={wp(5)} color={colors.green} />
                            <Text style={styles.sectionHeader}>Paired Devices ({paired.length})</Text>
                        </View>
                        <View style={styles.pairedDeviceText}>
                            {isLoading && <Text style={styles.sectionHeader}>Loading ...</Text>}
                            <MaterialDesignIcons name="reload" size={wp(6)} color={colors.blue} onPress={onReload} />
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.listContainer}>
                        {paired.map((device, index) => (
                            <Pressable
                                key={index}
                                android_ripple={android_ripple_value}
                                style={styles.device}
                                onPress={() => connect(device)}
                            >
                                <View style={styles.pairedDeviceText}>
                                    <MaterialIcons name="bluetooth" size={wp(5)} color={colors.green} />
                                    <View>
                                        <Text style={styles.sectionHeader}>{device.name}</Text>
                                        {isConnecting.status && isConnecting.deviceId === device.address && (
                                            <Text style={styles.connectionStatus}>Connecting ...</Text>
                                        )}
                                    </View>
                                </View>

                                <Lucide name="chevron-right" size={wp(4)} color={colors.blue} />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={[styles.container, styles.bluetoothDisabled]}>
                    <Text style={styles.pairedDeviceText}>Bluetooth is not enabled</Text>
                </View>
            )}

            <View style={styles.tipCard}>
                <MaterialDesignIcons name="lightbulb-on" size={wp(6)} color={colors.orange} />
                <View>
                    <Text style={styles.tipHeader}>Need Help ?</Text>
                    <Text style={styles.tipDesc}>If your weighment meter is not paired with your phone, you can try the following:</Text>
                    <Text style={styles.tipDesc}>1. Open the settings on your phone from below .</Text>
                    <Text style={styles.tipDesc}>2. Scan the weighment meter and pair it.</Text>
                </View>
            </View>
            <MidButton
                customIcon={<Lucide name="settings" size={17} color={colors.blue} />}
                onPress={settingPress}
                title="Bluetooth Settings"
                customStyle={styles.button}
                customTextStyle={styles.buttonText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    deviceContainer: {
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        flex: 1,
    },
    pairedDeviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pairedDeviceText: {
        flexDirection: 'row',
        gap: wp(1),
        alignItems: 'center',
    },
    listContainer: {
        flexGrow: 1,
        paddingVertical: hp(1.5),
    },
    sectionHeader: {
        fontSize: wp(3.5),
        fontWeight: '600',
    },
    connectionStatus: {
        fontSize: wp(3),
        color: colors.grey,
    },
    device: {
        marginHorizontal: wp(3),
        marginVertical: hp(0.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(1),
        alignItems: 'center',
        padding: wp(3),
        borderRadius: 10,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    },
    tipCard: {
        borderWidth: 1,
        borderColor: colors.yellow,
        backgroundColor: colors.yellowTransparent,
        borderRadius: 10,
        padding: wp(3),
        flexDirection: 'row',
        gap: wp(2),
        marginHorizontal: wp(3),
        marginTop: hp(1),
    },
    tipHeader: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.brown,
        lineHeight: wp(6),
    },
    tipDesc: {
        fontSize: wp(3),
        color: colors.orange,
        maxWidth: wp(80),
        lineHeight: wp(4),
    },
    button: {
        backgroundColor: colors.white,
        borderColor: colors.blue,
        borderWidth: 1,
        marginHorizontal: wp(3),
        marginTop: hp(1),
        marginBottom: hp(2),
    },
    buttonText: {
        color: colors.blue,
        fontSize: wp(3.5),
    },
    bluetoothDisabled: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
