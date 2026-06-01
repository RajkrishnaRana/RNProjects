import { StyleSheet, Text, View } from 'react-native';
import StackHeader from '../components/Headers/StackHeader';
import { LegendList } from '@legendapp/list';
import { PendingOfflineData, usePendingOfflineDataScreen } from '../hooks/screenHooks/usePendingOfflineDataScreen';
import { OfflineDataCard } from '../components/Cards/OfflineDataCard';
import { colors } from '../common/colors';
import { hp } from '../utils/dimesion';

export const ListEmptyComponent = () => {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.loadingText}>No Records found</Text>
        </View>
    );
};

export const PendingOfflineDataScreen = () => {
    const { offlineData } = usePendingOfflineDataScreen();
    return (
        <>
            <StackHeader title="Pending Offline Data" description="Record attendance time activities" />

            <View style={styles.container}>
                <LegendList
                    data={offlineData}
                    renderItem={({ item }: { item: PendingOfflineData }) => <OfflineDataCard item={item} />}
                    keyExtractor={(item, index) => item.transactionId?.toString() || index.toString()}
                    recycleItems
                    style={styles.list}
                    ListEmptyComponent={ListEmptyComponent}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        height: hp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.grey,
        marginHorizontal: 10,
    },
    list: { flex: 1, width: '100%' },
});
