// MUST be at very top - before any imports
jest.mock('react-native-reanimated', () => {
    const { View, Pressable, ActivityIndicator } = require('react-native');
    return {
        View,
        Pressable,
        ActivityIndicator,
        createAnimatedComponent: (c: any) => c,
        LinearTransition: {
            springify: jest.fn().mockReturnThis(),
            damping: jest.fn().mockReturnThis(),
            stiffness: jest.fn().mockReturnThis(),
        },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
    };
});

jest.mock('@react-native-vector-icons/fontawesome6', () => ({ FontAwesome6: () => null }));
jest.mock('@react-native-vector-icons/fontawesome', () => ({ FontAwesome: () => null }));
jest.mock('@react-native-vector-icons/material-design-icons', () => ({ MaterialDesignIcons: () => null }));

jest.mock('../components/Backgrounds/BlurryImageBackground', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children }: any) => <View testID="blurry-bg">{children}</View>;
});

jest.mock('../components/Modals/QRCodeScanModal', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="qr-modal" />;
});

jest.mock('react-native-keyboard-controller', () => ({
    KeyboardAwareScrollView: ({ children }: any) => children,
}));

jest.mock('../components/TextField', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="text-field" />;
});

jest.mock('../components/CheckBox', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="checkbox" />;
});

jest.mock('../utils/isTab', () => false);

jest.mock('react-hook-form', () => ({
    Controller: ({ render }: any) =>
        render({
            field: {
                value: '',
                onChange: jest.fn(),
                onBlur: jest.fn(),
            },
        }),
}));

const mockUseLoginHook = jest.fn();
jest.mock('../hooks/authHooks/useLogin', () => ({
    useLogin: () => mockUseLoginHook(),
}));

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';

function mockUseLogin(overrides: Partial<any> = {}) {
    const handleSaveConfig = jest.fn();
    const handleLoginPress = jest.fn();

    mockUseLoginHook.mockReturnValue({
        control: {},
        loginControl: {},
        handleSaveConfig,
        handleLoginPress,
        errors: {},
        loginErrors: {},
        disableDownload: false,
        setDisableDownload: jest.fn(),
        configSaved: false,
        loading: { login: false, config: false, downloadWorkerImg: false, finalizingData: false },
        isQRCodeScan: false,
        setIsQRCodeScan: jest.fn(),
        onQRCodeScanned: jest.fn(),
        ...overrides,
    });

    return { handleSaveConfig, handleLoginPress };
}

describe('LoginScreen (login button)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows "Save Configuration" when config is not saved and calls handleSaveConfig on press', () => {
        const { handleSaveConfig } = mockUseLogin({ configSaved: false });
        render(<LoginScreen />);

        fireEvent.press(screen.getByText('Save Configuration'));
        expect(handleSaveConfig).toHaveBeenCalledTimes(1);
    });

    it('shows "Login" when config is saved and calls handleLoginPress on press', () => {
        const { handleLoginPress } = mockUseLogin({ configSaved: true });
        render(<LoginScreen />);

        fireEvent.press(screen.getByText('Login'));
        expect(handleLoginPress).toHaveBeenCalledTimes(1);
    });

    it('hides label while saving configuration (loading.config=true)', () => {
        mockUseLogin({ configSaved: false, loading: { login: false, config: true, downloadWorkerImg: false, finalizingData: false } });
        render(<LoginScreen />);

        expect(screen.queryByText('Save Configuration')).toBeNull();
    });

    it('hides label while logging in / downloading / finalizing (any login-related loading)', () => {
        mockUseLogin({ configSaved: true, loading: { login: true, config: false, downloadWorkerImg: false, finalizingData: false } });
        render(<LoginScreen />);
        expect(screen.queryByText('Login')).toBeNull();

        mockUseLogin({ configSaved: true, loading: { login: false, config: false, downloadWorkerImg: true, finalizingData: false } });
        render(<LoginScreen />);
        expect(screen.queryByText('Login')).toBeNull();

        mockUseLogin({ configSaved: true, loading: { login: false, config: false, downloadWorkerImg: false, finalizingData: true } });
        render(<LoginScreen />);
        expect(screen.queryByText('Login')).toBeNull();
    });
});
