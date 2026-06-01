import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import { Lucide } from '@react-native-vector-icons/lucide';
import LinearGradient from 'react-native-linear-gradient';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useAppSelector } from '../../hooks/typedReduxHooks';

export default function TodaysRecordSection() {
    const { totalWorkerAttendance, totalLeafPluckedToday, attendanceRate } = useAppSelector(state => state.worker);

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <LinearGradient colors={['#ff66a3', '#ff0066']} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} style={styles.iconContainer}>
                    <Lucide name="chart-column" size={25} color={colors.white} />
                </LinearGradient>
                <Text style={styles.summaryText}>Today's Summary</Text>
                <View style={styles.attendanceRateContainer}>
                    <MaterialDesignIcons name="chart-timeline-variant" size={12} color={colors.green} />
                    <Text style={styles.attendanceRateText}>{attendanceRate}% Attendance Rate</Text>
                </View>
            </View>

            {/* Details */}
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.detailValue}>
                        {totalLeafPluckedToday} <Text style={styles.unitText}>kg</Text>
                    </Text>
                    <Text style={styles.detailText}>Green leaf plucked today</Text>
                </View>
                <View>
                    <Text style={styles.detailValue}>{totalWorkerAttendance}</Text>
                    <Text style={styles.detailText}>Attendance taken today</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 8,
        backgroundColor: colors.white,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
    },
    chartContainer: { alignItems: 'center' },
    iconContainer: {
        height: 50,
        width: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        marginTop: 10,
    },
    attendanceRateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 7,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: 'rgba(128, 255, 128, 0.3)',
    },
    attendanceRateText: { color: colors.green, fontSize: 9.5 },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.green,
        textAlign: 'center',
    },
    detailText: {
        fontSize: 10,
        color: colors.darkGrey,
    },
    unitText: { fontSize: 12 },
});
