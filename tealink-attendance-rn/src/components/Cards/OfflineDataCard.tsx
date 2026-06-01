import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { colors } from '../../common/colors';
import { PendingOfflineData } from '../../hooks/screenHooks/usePendingOfflineDataScreen';
import { hp, wp } from '../../utils/dimesion';
import { android_ripple_value } from '../../constants/screenOptions';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import WorkerIcon from '../Texts/WorkerIcon';
import { getValidTime } from '../../utils/dateHelper';
import databaseServices from '../../services/databaseServices';

interface Props {
    item: PendingOfflineData;
    onDelete?: (item: PendingOfflineData) => void; // Callback for delete action
    onSync?: (item: PendingOfflineData) => void; // Optional sync callback
}

const Row = ({ title, value }: { title: string; value: string }) => {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.colon}> : </Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

export const OfflineDataCard = ({ item }: Props) => {
    const { deleteSingleRecord } = databaseServices;
    // Render the right action (Delete button) when swiped
    const renderRightActions = () => {
        return (
            <Pressable
                style={[styles.deleteAction, { backgroundColor: colors.red }]}
                android_ripple={android_ripple_value}
                onPress={() => deleteSingleRecord(item.requestId)}
            >
                <MaterialIcons name="delete" size={24} color={colors.white} />
                <Text style={styles.actionText}>Delete</Text>
            </Pressable>
        );
    };

    // const renderLeftActions = () => {
    //     return (
    //         <Pressable
    //             style={[styles.syncAction, { backgroundColor: colors.green }]}
    //             android_ripple={android_ripple_value}
    //             onPress={() => onSync?.(item)}
    //         >
    //             <MaterialDesignIcons name="sync" size={24} color={colors.white} />
    //             <Text style={styles.actionText}>Sync</Text>
    //         </Pressable>
    //     );
    // };

    return (
        <Swipeable renderRightActions={renderRightActions} overshootLeft={false}>
            <View style={styles.container}>
                <View style={styles.bodyContainer}>
                    <WorkerIcon title={item.workerName} img={item.filePathSecond} customStyle={styles.img} />
                    <View>
                        <Text style={styles.name}>{item.workerName}</Text>
                        <Row title="Time" value={getValidTime(item.authenticationTime, item.recordTime)} />
                        {item.qtyCalculated && (
                            <View style={styles.pluckingContainer}>
                                <Row title="Weighment" value={item.weighment} />
                                <Row title="Plucking" value={`${item.qtyCalculated} kg`} />
                            </View>
                        )}
                        <Row title="Kamjari" value={item.kamjariName || 'N/A'} />
                        <Row title="Batch" value={item.batchName || 'N/A'} />
                        <Row title="Shift" value={item.shiftName || 'N/A'} />
                    </View>
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.black,
        width: wp(18),
    },
    colon: {
        fontSize: 12,
        fontWeight: 'bold',
        width: wp(5),
    },
    value: {
        fontSize: 12,
        color: colors.black,
        maxWidth: wp(46),
    },
    container: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    bodyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    name: {
        color: colors.darkGreen,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pluckingContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    img: {
        height: wp(15),
        width: wp(15),
        borderRadius: 50,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    button: {
        width: wp(20),
        height: hp(4),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(20),
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 10,
    },
    syncAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(20),
        marginVertical: 5,
        marginLeft: 10,
        borderRadius: 10,
    },
    actionText: {
        color: colors.white,
        fontSize: 12,
        marginTop: 4,
    },
});
