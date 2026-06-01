// __tests__/App.test.tsx
// 🔑 MUST BE FIRST - before ANY imports (Jest hoists these to top anyway)
jest.mock('react-native-reanimated', () => {
    const { View, Pressable } = require('react-native');
    return {
        View,
        Pressable,
        createAnimatedComponent: (c: any) => c,
        LinearTransition: { springify: jest.fn().mockReturnThis() },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
    };
});

// 🔑 CRITICAL FIX: Mock react-native-device-info BEFORE it's imported anywhere
jest.mock('react-native-device-info', () => ({
    isTablet: jest.fn().mockReturnValue(false),
    getUniqueId: jest.fn().mockReturnValue('test-device-id'),
    // Add other methods your app uses:
    getVersion: jest.fn().mockReturnValue('1.0.0'),
    getBrand: jest.fn().mockReturnValue('Apple'),
    getModel: jest.fn().mockReturnValue('iPhone'),
}));

// Mock store BEFORE importing App
jest.mock('../src/store', () => ({
    store: {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
        subscribe: jest.fn(),
        replaceReducer: jest.fn(),
    },
    persistor: {
        purge: jest.fn(),
        flush: jest.fn(),
        pause: jest.fn(),
        persist: jest.fn(),
        subscribe: jest.fn(() => jest.fn()),
        getState: jest.fn(() => ({ bootstrapped: true })),
    },
}));

// Mock navigation containers
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
        NavigationContainer: ({ children }: any) => children,
    };
});

jest.mock('@react-navigation/drawer', () => ({
    createDrawerNavigator: jest.fn().mockReturnValue({
        Navigator: ({ children }: any) => children,
        Screen: ({ children }: any) => children,
    }),
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn().mockReturnValue({
        Navigator: ({ children }: any) => children,
        Screen: ({ children }: any) => children,
    }),
}));

// Mock react-query provider
jest.mock('@tanstack/react-query', () => {
    const actual = jest.requireActual('@tanstack/react-query');
    return {
        ...actual,
        QueryClientProvider: ({ children }: any) => children,
        QueryClient: jest.fn().mockImplementation(() => ({
            prefetchQuery: jest.fn(),
        })),
    };
});

jest.mock('@nozbe/watermelondb/DatabaseProvider', () => ({
    __esModule: true,
    DatabaseProvider: ({ children }: any) => children,
}));

// Mock database layer to avoid WatermelonDB native/JSi init in Jest
jest.mock('../src/services/databaseServices', () => ({
    __esModule: true,
    default: {
        initializeDbFromLoginData: jest.fn(),
        getWorkerByWorkerId: jest.fn(),
        getWorkerByWorkerCode: jest.fn(),
        insertToAttendanceMaster: jest.fn(),
        getTotalWorkersCount: jest.fn(),
        insertToPluckedQuantityMaster: jest.fn(),
        exportDBFile: jest.fn(),
        insertToOfflineMaster: jest.fn(),
        insertToOfflineMasterForLocation: jest.fn(),
        insertWorkerImage: jest.fn(),
        insertToOfflineMasterForWorkerImage: jest.fn(),
        syncData: jest.fn(),
        updateSyncMaster: jest.fn(),
        clearDatabase: jest.fn(),
        deleteSingleRecord: jest.fn(),
    },
}));

// Mock sync thunk(s) to avoid importing WatermelonDB database from app entry
jest.mock('../src/store/thunks/syncThunk', () => ({
    __esModule: true,
    startOfflineWatcher: () => () => {},
    stopOfflineWatcher: () => () => {},
    triggerSync: () => async () => {},
}));

jest.mock('../src/hooks/screenHooks/useDashboard', () => ({
    __esModule: true,
    default: () => ({
        updateLastSyncedDate: jest.fn(),
        animatedIconStyle: {},
        handleLongSyncBarPress: jest.fn(),
    }),
}));

jest.mock('../src/hooks/useNfc', () => ({
    __esModule: true,
    default: () => ({
        supported: false,
        enabled: false,
        start: jest.fn(),
        stop: jest.fn(),
    }),
}));

jest.mock('../src/components/Modals/QRCodeScanModal', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../src/hooks/screenHooks/useViewWorkers', () => ({
    __esModule: true,
    default: () => ({
        workerList: [],
        loading: false,
        onRefresh: jest.fn(),
        onSearchChange: jest.fn(),
        selectedWorker: null,
        setSelectedWorker: jest.fn(),
    }),
}));

jest.mock('../src/navigations/MainRoute', () => ({
    __esModule: true,
    default: () => null,
}));

// Mock drawer layout
jest.mock('react-native-drawer-layout', () => {
    const { View } = require('react-native');
    return {
        default: View,
        DrawerGestureContext: { Provider: ({ children }: any) => children },
    };
});

// Mock linear gradient
jest.mock('react-native-linear-gradient', () => {
    const { View } = require('react-native');
    return {
        default: View,
    };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
    });
});
