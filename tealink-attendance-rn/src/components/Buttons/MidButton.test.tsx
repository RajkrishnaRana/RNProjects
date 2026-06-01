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

jest.mock('../../utils/dimesion', () => ({ wp: (n: number) => n * 2, hp: (n: number) => n * 2 }));
jest.mock('../../common/colors', () => ({ colors: { darkGreen: '#006400', white: '#fff' } }));
jest.mock('../../utils/isTab', () => false);
jest.mock('../../constants/screenOptions', () => ({ android_ripple_value: { color: '#fff3' } }));

import React from 'react';
import { View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import MidButton from './MidButton';

describe('MidButton', () => {
    const onPressMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders title when not loading', () => {
        render(<MidButton onPress={onPressMock} title="Submit" />);
        expect(screen.getByText('Submit')).toBeVisible();
    });

    it('shows loader when loading', () => {
        render(<MidButton onPress={onPressMock} title="Submit" loading />);
        expect(screen.queryByText('Submit')).toBeNull();
        // Loader exists (we can't query ActivityIndicator directly, but absence of text confirms state)
    });

    it('calls onPress when pressed (not loading)', () => {
        render(<MidButton onPress={onPressMock} title="Click" testID="mid-button" />);
        fireEvent.press(screen.getByTestId('mid-button'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('blocks onPress when loading', () => {
        render(<MidButton onPress={onPressMock} title="Click" loading testID="mid-button" />);
        fireEvent.press(screen.getByTestId('mid-button'));
        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('renders custom icon when provided', () => {
        render(<MidButton onPress={onPressMock} customIcon={<View testID="custom-icon" />} testID="mid-button" />);
        expect(screen.getByTestId('custom-icon')).toBeVisible();
    });
});
