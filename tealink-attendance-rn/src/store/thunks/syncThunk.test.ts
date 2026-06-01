const mockToastShow = jest.fn();
jest.mock('react-native-toast-message', () => ({
    __esModule: true,
    default: { show: mockToastShow },
}));

const mockSyncData = jest.fn();
const mockUpdateSyncMaster = jest.fn();
jest.mock('../../services/databaseServices', () => ({
    __esModule: true,
    default: {
        syncData: (...args: any[]) => mockSyncData(...args),
        updateSyncMaster: (...args: any[]) => mockUpdateSyncMaster(...args),
    },
}));

jest.mock('moment-timezone', () => ({
    __esModule: true,
    default: () => ({
        format: () => '1 Jan 1:00 am',
    }),
}));

let observeCountHandler: ((count: number) => void) | null = null;
const mockWatcherUnsubscribe = jest.fn();
const mockSubscribe = jest.fn(({ next }) => {
    observeCountHandler = next;
    return { unsubscribe: mockWatcherUnsubscribe };
});

jest.mock('../../..', () => ({
    database: {
        collections: {
            get: jest.fn(() => ({
                query: jest.fn(() => ({
                    observeCount: jest.fn(() => ({
                        subscribe: mockSubscribe,
                    })),
                })),
            })),
        },
    },
}));

let netInfoHandler: ((state: { isConnected: boolean; isInternetReachable: boolean }) => void) | null = null;
const mockNetUnsubscribe = jest.fn();
jest.mock('@react-native-community/netinfo', () => ({
    __esModule: true,
    default: {
        addEventListener: jest.fn((cb: any) => {
            netInfoHandler = cb;
            return mockNetUnsubscribe;
        }),
    },
}));

import { triggerSync, startOfflineWatcher, stopOfflineWatcher } from './syncThunk';
import { setPendingCount, setSyncPercentage, setSyncing } from '../slices/syncSlice';

describe('syncThunk logic', () => {
    beforeEach(() => {
        const toastModule = require('react-native-toast-message');
        if (toastModule?.default) {
            toastModule.default.show = mockToastShow;
        }
    });

    afterEach(() => {
        // Reset module-level watcher refs in thunk
        stopOfflineWatcher()(
            () => {},
            () => ({} as any),
        );
        observeCountHandler = null;
        netInfoHandler = null;
        jest.clearAllMocks();
    });

    it('updates sync percentage from watcher counts (0 -> 50 -> 100)', () => {
        const actions: any[] = [];
        const state = {
            sync: { pendingCount: 0, isSyncing: false },
            network: { online: false },
            auth: { baseURL: 'https://base.url' },
        };

        const getState = () => state as any;
        const dispatch: any = (action: any) => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }
            actions.push(action);
            if (action.type === setPendingCount.type) {
                state.sync.pendingCount = action.payload;
            }
            return action;
        };

        startOfflineWatcher()(dispatch, getState);
        expect(observeCountHandler).toBeTruthy();
        expect(netInfoHandler).toBeTruthy();

        observeCountHandler?.(10);
        observeCountHandler?.(5);
        observeCountHandler?.(0);

        const percentagePayloads = actions.filter(a => a.type === setSyncPercentage.type).map(a => a.payload);
        expect(percentagePayloads).toEqual([0, 50, 100]);
    });

    it('dispatches 100% and success toast when triggerSync gets "No Data"', async () => {
        const actions: any[] = [];
        mockSyncData.mockResolvedValueOnce({ status: true, msg: 'No Data' });

        const state = {
            sync: { isSyncing: false, pendingCount: 0 },
            network: { online: true },
            auth: { baseURL: 'https://base.url' },
        };

        const getState = () => state as any;
        const dispatch: any = (action: any) => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }
            actions.push(action);
            return action;
        };

        await triggerSync(false)(dispatch, getState, undefined as any);

        expect(mockSyncData).toHaveBeenCalledWith('https://base.url');
        expect(actions).toContainEqual(setSyncing(true));
        expect(actions).toContainEqual(setSyncPercentage(100));
        expect(actions).toContainEqual(setSyncing(false));
        expect(mockToastShow).toHaveBeenCalledWith({
            type: 'success',
            text1: 'All Data are already synced',
        });
    });
});
