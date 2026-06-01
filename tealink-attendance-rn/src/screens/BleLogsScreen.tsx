import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, StatusBar } from 'react-native';
import { getLogs, clearLogs, LogEntry } from '../services/mmkvServices';
import { useFocusEffect } from '@react-navigation/native';

const BleLogsScreen = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const loadLogs = () => setLogs(getLogs());

    // Reload logs every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadLogs();
        }, []),
    );

    const handleClear = () => {
        clearLogs();
        setLogs([]);
    };

    const renderItem = ({ item }: { item: LogEntry }) => (
        <View style={[styles.card, item.parsedWeight === null && styles.cardFailed, item.caseMatched === 'fallback' && styles.cardFallback]}>
            {/* Header row */}
            <View style={styles.row}>
                <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                <Text style={[styles.badge, item.parsedWeight !== null ? styles.badgeOk : styles.badgeFail]}>{item.caseMatched}</Text>
            </View>

            {/* Weight */}
            <Text style={styles.weight}>⚖️ {item.parsedWeight !== null ? `${item.parsedWeight} kg` : 'null'}</Text>

            {/* Raw dump */}
            <Text style={styles.label}>RAW:</Text>
            <Text style={styles.raw}>{JSON.stringify(item.raw)}</Text>

            {/* Char codes */}
            <Text style={styles.label}>CHAR CODES:</Text>
            <Text style={styles.charCodes} numberOfLines={2}>
                {item.charCodes}
            </Text>

            {/* Length */}
            <Text style={styles.meta}>Length: {item.length}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <Text style={styles.title}>BLE Logs ({logs.length})</Text>
                <TouchableOpacity onPress={loadLogs} style={styles.btn}>
                    <Text style={styles.btnText}>↻ Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClear} style={[styles.btn, styles.btnRed]}>
                    <Text style={styles.btnText}>🗑 Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={logs}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={false} onRefresh={loadLogs} />}
                ListEmptyComponent={<Text style={styles.empty}>No logs yet. Connect a device.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f', paddingTop: StatusBar.currentHeight ?? 20 },
    toolbar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1a1a1a', gap: 8 },
    title: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 16 },
    btn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#2a2a2a', borderRadius: 6 },
    btnRed: { backgroundColor: '#5c1a1a' },
    btnText: { color: '#fff', fontSize: 13 },
    card: { margin: 8, padding: 12, backgroundColor: '#1e1e1e', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#00c853' },
    cardFailed: { borderLeftColor: '#ff1744' },
    cardFallback: { borderLeftColor: '#ff9100' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    timestamp: { color: '#888', fontSize: 12 },
    badge: { fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeOk: { backgroundColor: '#1b5e20', color: '#69f0ae' },
    badgeFail: { backgroundColor: '#b71c1c', color: '#ff8a80' },
    weight: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    label: { color: '#555', fontSize: 11, marginTop: 4 },
    raw: { color: '#69f0ae', fontSize: 12, fontFamily: 'monospace' },
    charCodes: { color: '#40c4ff', fontSize: 11, fontFamily: 'monospace' },
    meta: { color: '#555', fontSize: 11, marginTop: 4 },
    empty: { color: '#555', textAlign: 'center', marginTop: 40 },
});

export default BleLogsScreen;
