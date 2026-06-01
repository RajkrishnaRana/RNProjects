// setupTests.js
/* eslint-env jest */

// ✅ REMOVED: import '@testing-library/react-native/extend-expect';
// Matchters are auto-registered in v13+

// 🔑 CRITICAL: Prevent native module errors in tests
jest.mock('react-native/Libraries/LogBox/LogBox');

// Prevent TurboModule errors for haptics in Jest
jest.mock('react-native-haptic-feedback', () => ({
    trigger: jest.fn(),
}));

jest.mock('react-native-zip-archive', () => ({
    unzip: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
    __esModule: true,
    default: {
        fs: {
            dirs: { CacheDir: '/tmp', DocumentDir: '/tmp' },
            exists: jest.fn(async () => true),
            mkdir: jest.fn(async () => {}),
            unlink: jest.fn(async () => {}),
            ls: jest.fn(async () => []),
            cp: jest.fn(async () => {}),
            stat: jest.fn(async () => ({ size: 0 })),
        },
        MediaCollection: {
            copyToMediaStore: jest.fn(async () => '/tmp/mock'),
        },
        config: () => ({
            fetch: jest.fn(async () => ({ respInfo: { status: 200 } })),
        }),
    },
}));

jest.mock('react-native-keyboard-controller', () => ({
    KeyboardAwareScrollView: ({ children }) => children,
    KeyboardProvider: ({ children }) => children,
}));

jest.mock('@react-native-ohos/react-native-image-zoom-viewer', () => () => null);

jest.mock('react-native-modal', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children }) => <View>{children}</View>;
});

jest.mock('react-native-permissions', () => ({
    PERMISSIONS: {},
    RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
        BLOCKED: 'blocked',
    },
    request: jest.fn(async () => 'granted'),
}));

jest.mock('react-native-sound', () => {
    return function Sound() {
        return {
            play: jest.fn(),
            release: jest.fn(),
            setVolume: jest.fn(),
        };
    };
});

jest.mock('@sentry/react-native', () => ({
    init: jest.fn(),
    wrap: app => app,
    mobileReplayIntegration: jest.fn(() => ({})),
    feedbackIntegration: jest.fn(() => ({})),
}));

jest.mock('react-native-gesture-handler', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        GestureHandlerRootView: ({ children }) => <View>{children}</View>,
    };
});
