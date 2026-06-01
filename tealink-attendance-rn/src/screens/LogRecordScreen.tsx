import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import StackHeader from '../components/Headers/StackHeader';
import { LegendList } from '@legendapp/list';
import { ListEmptyComponent } from './PendingOfflineDataScreen';
import { getLogInOuts, LogInOutEntry } from '../services/mmkvServices';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../common/colors';

const LogRecordItem = ({ item }: { item: LogInOutEntry }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.type}</Text>
            <Text style={styles.itemDescription}>{item.timestamp}</Text>
        </View>
    );
};

export default function LogRecordScreen() {
    const [logs, setLogs] = useState<LogInOutEntry[]>([]);
    useFocusEffect(
        useCallback(() => {
            setLogs(getLogInOuts());
        }, []),
    );

    return (
        <>
            <StackHeader title="Log Records" description="Show Log-in and Log-out time activities" />

            <View style={styles.container}>
                <LegendList
                    data={logs}
                    renderItem={({ item }: { item: LogInOutEntry }) => <LogRecordItem item={item} />}
                    keyExtractor={item => item.id}
                    recycleItems
                    style={styles.list}
                    ListEmptyComponent={ListEmptyComponent}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: { flex: 1, width: '100%' },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.white,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
    },
    itemDescription: {
        fontSize: 12,
        color: colors.black,
    },
});
