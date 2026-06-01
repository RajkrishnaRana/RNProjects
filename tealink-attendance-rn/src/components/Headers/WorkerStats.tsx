import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { wp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import databaseServices from '../../services/databaseServices';

function Box({ value, label, color }: { value: number; label: string; color: string }) {
    return (
        <View style={styles.boxContainer}>
            <Text style={[styles.boxValueText, { color: color }]}>{value}</Text>
            <Text style={styles.boxLabelText}>{label}</Text>
        </View>
    );
}

export default function WorkerStats() {
    const { totalWorkerAttendance } = useAppSelector(state => state.worker);
    const { getTotalWorkersCount } = databaseServices;

    const [workersCount, setWorkersCount] = React.useState(0);
    useEffect(() => {
        (async () => {
            const count = await getTotalWorkersCount();
            setWorkersCount(count);
        })();
    }, [getTotalWorkersCount]);

    return (
        <View style={styles.container}>
            <Box value={workersCount} label="Total" color={colors.white} />
            <Box value={totalWorkerAttendance} label="Present" color={colors.yellow} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
        marginBottom: 15,
    },
    boxContainer: {
        paddingVertical: 10,
        width: wp(20),
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: colors.white,
        gap: 1,
    },
    boxValueText: {
        fontSize: 16,
        fontWeight: '900',
        textAlign: 'center',
    },
    boxLabelText: {
        fontSize: 11,
        color: colors.white,
        textAlign: 'center',
    },
});
