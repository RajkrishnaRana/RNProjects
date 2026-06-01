jest.mock('react-native-reanimated', () => ({
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn(),
    withTiming: jest.fn(),
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn() },
}));

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn(),
}));

jest.mock('@nozbe/watermelondb', () => ({
    Q: {
        where: jest.fn(),
        gte: jest.fn(),
        lt: jest.fn(),
        sortBy: jest.fn(),
        asc: 'asc',
        desc: 'desc',
    },
}));

const mockPush = jest.fn();
jest.mock('../useNavigation', () => ({
    useNavigation: () => ({
        push: mockPush,
    }),
}));

const mockShowToast = jest.fn();
jest.mock('react-native-toast-message', () => ({
    __esModule: true,
    default: {
        show: mockShowToast,
    },
    show: mockShowToast,
}));

const mockDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../typedReduxHooks', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

jest.mock('../../services/databaseServices', () => ({
    __esModule: true,
    default: {
        getTotalWorkersCount: jest.fn(async () => 10),
    },
}));

jest.mock('../../store/thunks/syncThunk', () => ({
    __esModule: true,
    triggerSync: jest.fn(() => ({ type: 'sync/mock' })),
}));

const mockSubscribe = jest.fn(() => ({ unsubscribe: jest.fn() }));
const mockQuery = jest.fn(() => ({
    observe: () => ({ subscribe: mockSubscribe }),
    fetch: jest.fn(async () => []),
}));

jest.mock('../../..', () => ({
    database: {
        collections: {
            get: jest.fn(() => ({
                query: mockQuery,
            })),
        },
    },
}));

import React from 'react';
import { render, act } from '@testing-library/react-native';
import useDashboard from './useDashboard';

describe('useDashboard - handleLongSyncBarPress', () => {
    let hookResult: ReturnType<typeof useDashboard> | null = null;

    const HookProbe = () => {
        hookResult = useDashboard();
        return null;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        hookResult = null;
        const toastModule = require('react-native-toast-message');
        if (toastModule?.default) {
            toastModule.default.show = mockShowToast;
        }
    });

    it('shows timezone mismatch toast and does not navigate when authenticationTime is in the future', () => {
        jest.spyOn(Date, 'now').mockReturnValue(1000);

        const mockState = {
            worker: { totalWorkerAttendance: 0 },
            auth: { batchSameAsDevice: false, deviceName: 'device-1', authenticationTime: 2000 },
            sync: { isSyncing: false },
        };
        mockUseAppSelector.mockImplementation((selector: any) => selector(mockState));

        render(<HookProbe />);
        act(() => {
            hookResult?.handleLongSyncBarPress();
        });

        expect(mockShowToast).toHaveBeenCalledWith({
            type: 'error',
            text1: 'Timezone mismatched',
            text2: 'Please fix your device timezone',
        });
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('navigates to PendingOfflineData when authenticationTime is valid/past', () => {
        jest.spyOn(Date, 'now').mockReturnValue(3000);

        const mockState = {
            worker: { totalWorkerAttendance: 0 },
            auth: { batchSameAsDevice: false, deviceName: 'device-1', authenticationTime: 1000 },
            sync: { isSyncing: false },
        };
        mockUseAppSelector.mockImplementation((selector: any) => selector(mockState));

        render(<HookProbe />);
        act(() => {
            hookResult?.handleLongSyncBarPress();
        });

        expect(mockPush).toHaveBeenCalledWith('PendingOfflineData');
        expect(mockShowToast).not.toHaveBeenCalled();
    });
});
