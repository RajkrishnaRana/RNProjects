import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../common/colors';
import { wp } from '../../utils/dimesion';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SettingToggleOptions from '../SettingToggleOptions';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

interface Props {
    isBluetoothEnabled: boolean;
}

export default function BluetoothStatusCard({ isBluetoothEnabled }: Props) {
    const [poweredOn, setPoweredOn] = useState(false);
    const onPress = async () => {
        if (!isBluetoothEnabled) {
            await RNBluetoothClassic.requestBluetoothEnabled();
            setPoweredOn(true);
        }
    };

    useEffect(() => {
        const bluetoothStateManage = async () => {
            if (isBluetoothEnabled) {
                setPoweredOn(true);
            } else {
                setPoweredOn(false);
            }
        }

        bluetoothStateManage();
    }, [isBluetoothEnabled]);

    return (
        <View style={styles.container}>
            <View style={styles.iconHolder}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="bluetooth" size={wp(6)} color={colors.white} />
                </View>
                <View>
                    <Text style={styles.heading}>Bluetooth Status</Text>
                    <Text style={styles.desc}>{isBluetoothEnabled ? 'Enabled' : 'Disabled'}</Text>
                </View>
            </View>

            <SettingToggleOptions state={poweredOn} setState={onPress} disable={isBluetoothEnabled} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: colors.blue,
        borderRadius: 10,
        padding: wp(4),
        backgroundColor: colors.blueTransparent,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: wp(3),
    },
    iconHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    iconContainer: {
        height: wp(12),
        width: wp(12),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
    heading: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.blue,
    },
    desc: {
        fontSize: wp(3),
        color: colors.black,
    },
});
