import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import { useAppSelector } from '../../hooks/typedReduxHooks';

export default function WorkerLogged() {
    const { totalWorkerAttendance } = useAppSelector(state => state.worker);

    return (
        <View style={styles.container}>
            <Text style={styles.number}>{totalWorkerAttendance}</Text>
            <Text style={styles.description}>Worker(s) Logged In Today</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 6,
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 9,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    number: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    description: {
        fontSize: 12,
        color: colors.white,
    },
});
