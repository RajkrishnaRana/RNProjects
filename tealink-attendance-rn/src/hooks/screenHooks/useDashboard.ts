import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import { database } from '../../..';
import AttendanceMaster from '../../model/attendanceMaster';
import { Q } from '@nozbe/watermelondb';
import { setAttandanceRate, setBatchSameAsDeviceId, setTotalLeafPluckedToday, setTotalWorkerAttendance } from '../../store/slices/workerSlice';
import PluckedQuantityMaster from '../../model/pluckedQuantityMaster';
import { useAppDispatch, useAppSelector } from '../typedReduxHooks';
import databaseServices from '../../services/databaseServices';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, cancelAnimation } from 'react-native-reanimated';
import BatchMaster from '../../model/batchMaster';
import { triggerSync } from '../../store/thunks/syncThunk';
import { useNavigation } from '../useNavigation';
import Toast from 'react-native-toast-message';

const useDashboard = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { totalWorkerAttendance } = useAppSelector(state => state.worker);
    const { batchSameAsDevice, deviceName, authenticationTime } = useAppSelector(state => state.auth);
    const { isSyncing } = useAppSelector(state => state.sync);
    const { getTotalWorkersCount } = databaseServices;

    // ANIMATION VALUES --------------->
    const rotation = useSharedValue(0);

    // ANIMATED STYLES --------------->
    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    // FUNCTIONS ------------------->
    const updateLastSyncedDate = () => {
        dispatch(triggerSync(false));
    };

    const handleLongSyncBarPress = () => {
        if (authenticationTime && Date.now() < authenticationTime) {
            Toast.show({
                type: 'error',
                text1: 'Timezone mismatched',
                text2: 'Please fix your device timezone',
            });
            return;
        }
        navigation.push('PendingOfflineData');
    };

    const getBatchSameAsDeviceData = useCallback(async () => {
        const batchCollection = database.collections.get<BatchMaster>('batch_master');
        const allBatches = await batchCollection.query().fetch();
        const batchSameAsDeviceData = allBatches.find(batch => batch.batchId === deviceName);
        dispatch(setBatchSameAsDeviceId(batchSameAsDeviceData?.batchId));
    }, [deviceName, dispatch]);

    useEffect(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;
        // console.log({ startOfToday, endOfToday });
        console.log('batchSameAsDevice', batchSameAsDevice);

        if (batchSameAsDevice) getBatchSameAsDeviceData();

        const attendanceCollection = database.collections.get<AttendanceMaster>('attendance_master');
        const attendanceSub = attendanceCollection
            .query(
                Q.where('attendance_date', Q.gte(String(startOfToday))),
                Q.where('attendance_date', Q.lt(String(endOfToday))),
                Q.sortBy('attendance_time', Q.asc),
            ) // Between startOfToday and endOfToday and also sort by ascending order
            .observe()
            .subscribe({
                next: records => {
                    const uniqueWorkers = new Set(records.map(record => record.workerId));
                    dispatch(setTotalWorkerAttendance(uniqueWorkers.size));
                },
                error: error => {
                    console.error(error);
                },
            });

        const pluckedQuantityCollection = database.collections.get<PluckedQuantityMaster>('plucked_quantity_master');
        const pluckedQuantitySub = pluckedQuantityCollection
            .query(
                Q.where('record_date', Q.gte(String(startOfToday))),
                Q.where('record_date', Q.lt(String(endOfToday))),
                Q.sortBy('record_time', Q.desc),
            )
            .observe()
            .subscribe({
                next: records => {
                    const uniqueKeys = new Set();
                    const totalRecord = records.reduce((total, record) => {
                        // Keep one entry per worker + kamjari + weighment, matching print aggregation.
                        const key = `${record.workerId}__${record.kamjariId || ''}__${record.weighmentNumber}`;
                        if (!uniqueKeys.has(key)) {
                            uniqueKeys.add(key);
                            return total + (Number(record.recordQuantity) || 0);
                        }
                        return total;
                    }, 0);
                    dispatch(setTotalLeafPluckedToday(Number(totalRecord.toFixed(2))));
                },
                error: err => {
                    console.error('WatermelonDB pluckedQuantityMaster fetch error:', err);
                },
            });

        return () => {
            attendanceSub.unsubscribe();
            pluckedQuantitySub.unsubscribe();
        };
    }, [dispatch, batchSameAsDevice, getBatchSameAsDeviceData]);

    useEffect(() => {
        (async () => {
            const count = await getTotalWorkersCount();
            dispatch(setAttandanceRate(((totalWorkerAttendance / count) * 100).toFixed(2)));
        })();
    }, [getTotalWorkersCount, dispatch, totalWorkerAttendance]);

    // Handle Back Button Alert
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Exit App',
                    'Are you sure, you want to exit?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: () => BackHandler.exitApp(),
                        },
                    ],
                    { cancelable: false },
                );
                return true; // Prevent default back navigation
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove(); // Cleanup
        }, []),
    );

    // ROTATION ANIMATION EFFECT --------------->
    useEffect(() => {
        if (isSyncing) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 1000,
                    easing: Easing.linear,
                }),
                -1, // Infinite repeat
                false, // Don't reverse
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = withTiming(0, { duration: 200 });
        }
    }, [isSyncing, rotation]);

    return {
        updateLastSyncedDate,
        animatedIconStyle,
        handleLongSyncBarPress,
    };
};

export default useDashboard;
