import Toast from 'react-native-toast-message';
import { setPendingCount, setSyncing, setSyncPercentage } from '../slices/syncSlice';
import databaseServices from '../../services/databaseServices';
import { setLastSyncTime } from '../slices/authSlice';
import moment from 'moment-timezone';
import { AppDispatch, RootState } from '../index';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { database } from '../../..';
import NetInfo from '@react-native-community/netinfo';
import { setOnlineStatus } from '../slices/networkSlice';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

let offlineWatcherSubscription: any = null; // module-level — survives everything
let networkUnsubscribe: (() => void) | null = null;
let maxDataToUploadRef = 0;
let isBatchActive = false;

// ── Start watching offline_master (call once at app start) ────────────────────
export const startOfflineWatcher = () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (offlineWatcherSubscription) return;

    offlineWatcherSubscription = database.collections
        .get('offline_master')
        .query()
        .observeCount()
        .subscribe({
            next: (count: number) => {
                dispatch(setPendingCount(count));
                dispatch(handlePendingCountChange(count));
            },
            error: (err: any) => console.error('[SyncWatcher] observeCount error:', err),
        });

    // ── 2. Watch network state changes ────────────────────────────────────────
    networkUnsubscribe = NetInfo.addEventListener(state => {
        const isOnline = Boolean(state.isConnected && state.isInternetReachable);
        dispatch(setOnlineStatus(isOnline)); // keep Redux in sync

        if (isOnline) {
            // Network just came online — check if pending data exists
            const { pendingCount } = getState().sync;
            if (pendingCount > 0) {
                dispatch(triggerSync(true));
            }
        }
    });
};

// ── Stop watching (call on logout) ────────────────────────────────────────────
export const stopOfflineWatcher = () => () => {
    if (offlineWatcherSubscription) {
        offlineWatcherSubscription.unsubscribe();
        offlineWatcherSubscription = null;
    }

    // ── Also stop network watcher ─────────────────────────────────────────────
    if (networkUnsubscribe) {
        networkUnsubscribe();
        networkUnsubscribe = null;
    }

    maxDataToUploadRef = 0;
    isBatchActive = false;
};

// ── Handle count changes (percentage + auto-sync logic) ───────────────────────
const handlePendingCountChange = (count: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    console.log('Pending count changed-------', count);
    if (count === 0) {
        dispatch(setSyncPercentage(100));
        if (isBatchActive) {
            maxDataToUploadRef = 0;
            isBatchActive = false;
        }
        return;
    }

    // count > 0
    if (!isBatchActive) {
        isBatchActive = true;
        maxDataToUploadRef = count;
    } else if (count > maxDataToUploadRef) {
        maxDataToUploadRef = count;
    }

    const syncedCount = maxDataToUploadRef - count;
    const percentage = Math.round((syncedCount / maxDataToUploadRef) * 100);
    dispatch(setSyncPercentage(percentage));

    // Auto-sync if online
    const { online } = getState().network;
    if (online) {
        dispatch(triggerSync(true));
    }
};

// ── Trigger sync when network changes ────────────────────────────────────────────────────
export const triggerSync =
    (silent = false): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
        console.log('triggerSync');
        const { syncData, updateSyncMaster } = databaseServices;

        const { isSyncing } = getState().sync;
        const { online } = getState().network;
        const { baseURL } = getState().auth;

        if (isSyncing) {
            if (!silent) Toast.show({ type: 'success', text1: 'Sync Already in Progress' });
            return;
        }
        if (!online) {
            if (!silent) Toast.show({ type: 'error', text1: 'No Internet Connection' });
            return;
        }
        if (!baseURL) {
            if (!silent) Toast.show({ type: 'error', text1: 'No Base URL Available' });
            return;
        }

        try {
            dispatch(setSyncing(true));
            const data = await syncData(baseURL);
            // console.log('Sync data', data);

            if (!data.status) {
                throw new Error(data.msg);
            }

            // This condition is only for showing the success message when there is no data to sync
            if (data.msg === 'No Data') {
                dispatch(setSyncPercentage(100));
                Toast.show({
                    type: 'success',
                    text1: 'All Data are already synced',
                });
                return;
            }

            await updateSyncMaster();
            dispatch(setLastSyncTime(moment().format('D MMM h:mm a')));

            if (!silent)
                Toast.show({
                    type: 'success',
                    text1: 'Data Synced Successfully',
                    text2: 'Now all the stored data are send to the server',
                });
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: String(error.message),
            });
        } finally {
            dispatch(setSyncing(false));
        }
    };
