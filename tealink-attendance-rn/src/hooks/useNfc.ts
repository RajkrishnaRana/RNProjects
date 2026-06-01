import { useEffect, useState, useRef, useCallback } from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import nfcServices from '../services/nfcServices';
import { useNavigation } from './useNavigation';
import { Alert, AppState, AppStateStatus, Linking } from 'react-native';
import { nfcEventEmitter } from '../utils/nfcEventEmitter';

const useNfc = () => {
    const navigation = useNavigation();
    const [isListening, setIsListening] = useState(false);
    const [isNfcInitialized, setIsNfcInitialized] = useState(false);
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const shouldListenRef = useRef(true);
    const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize NFC and check status for is NFC enabled or not
    const initNFC = async () => {
        try {
            await NfcManager.start();
            setIsNfcInitialized(true);
            console.log('NFC initialized');

            // Check if NFC is enabled
            const enabled = await NfcManager.isEnabled();
            setIsNfcEnabled(enabled);

            if (!enabled) {
                Alert.alert('NFC is disabled', 'Please enable NFC to use nfc based attendance feature', [
                    { text: 'Cancel', onPress: () => {} },
                    {
                        text: 'Open Settings',
                        onPress: async () => {
                            await Linking.sendIntent('android.settings.NFC_SETTINGS');
                        },
                    },
                ]);
            }

            // This is recheck if the NFC is enabled or not
            const e = await NfcManager.isEnabled();
            setIsNfcEnabled(e);
        } catch (ex) {
            // console.warn('NFC init failed', ex);
            setIsNfcEnabled(false);
        }
    };

    const stopPassiveListening = useCallback(async () => {
        console.log('Stopping passive NFC listening...');
        shouldListenRef.current = false;
        setIsListening(false);

        try {
            // Remove event listener
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);

            // Unregister tag events
            await NfcManager.unregisterTagEvent();

            console.log('Passive NFC listening stopped');
        } catch (ex) {
            console.log('Error stopping passive listening:', ex);
        }

        // DON'T reset lastTagId here - this was causing the issue
        // setLastTagId(null);
    }, []);

    const checkNfcStatus = useCallback(async () => {
        try {
            const enabled = await NfcManager.isEnabled();
            const previousEnabled = isNfcEnabled;

            setIsNfcEnabled(enabled);
            // console.log('NFC status checked:', enabled);

            // If NFC state changed from disabled to enabled, restart listening
            if (!previousEnabled && enabled && !isListening) {
                console.log('NFC was re-enabled, restarting listening...');
                // Use setTimeout to ensure state is updated
                setTimeout(() => {
                    startPassiveListening();
                }, 100);
            }

            if (!enabled && isListening) {
                stopPassiveListening();
            }
        } catch (ex) {
            console.warn('NFC status check failed', ex);
            setIsNfcEnabled(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNfcEnabled, isListening, stopPassiveListening]);

    // Use useCallback to prevent recreation and closure issues
    const handleTagScanned = useCallback(
        async (tag: any) => {
            console.log('Processing tag:', tag);
            // Alert.alert('NFC Tag Detected', `Tag ID: ${tag.id}\n`, [{ text: 'OK' }]);

            // ✅ Broadcast to ALL listeners
            nfcEventEmitter.emitTag(tag);

            // HIT API respective to screen
            await nfcServices.routeHandle(tag?.ndefMessage[0], navigation);
        },
        [navigation],
    );

    const startPassiveListening = useCallback(async () => {
        if (isListening) return;

        // Check NFC status before starting
        const enabled = await NfcManager.isEnabled();
        setIsNfcEnabled(enabled);

        if (!isNfcEnabled) {
            console.log('Cannot start listening - NFC is disabled');
            return;
        }

        shouldListenRef.current = true;
        setIsListening(true);
        console.log('Starting passive NFC listening...');

        try {
            // Set up passive tag discovery listener
            NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagScanned);

            // Enable background tag discovery
            await NfcManager.registerTagEvent();

            console.log('Passive NFC listening active');
        } catch (ex) {
            console.warn('Failed to start passive listening:', ex);
            setIsListening(false);
        }
    }, [isListening, isNfcEnabled, handleTagScanned]);

    const cleanup = async () => {
        shouldListenRef.current = false;

        try {
            // Remove event listener
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);

            // Unregister tag events
            await NfcManager.unregisterTagEvent();

            console.log('NFC cleanup completed');
        } catch (ex) {
            console.log('Cleanup error:', ex);
        }
    };

    const handleLogout = useCallback(() => {
        console.log('User logged out');
    }, []);

    // Add function to manually reset lastTagId if needed
    const resetLastTagId = useCallback(() => {
        console.log('Last tag ID reset');
    }, []);

    // Start periodic NFC status checking
    const startStatusMonitoring = useCallback(() => {
        // Clear existing interval if any
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
        }

        // Check NFC status every 2 seconds
        statusCheckIntervalRef.current = setInterval(() => {
            checkNfcStatus();
        }, 2000);

        console.log('NFC status monitoring started');
    }, [checkNfcStatus]);

    const stopStatusMonitoring = useCallback(() => {
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
            console.log('NFC status monitoring stopped');
        }
    }, []);

    // Handle app state changes
    const handleAppStateChange = useCallback(
        (nextAppState: AppStateStatus) => {
            console.log('App state changed to:', nextAppState);

            if (nextAppState === 'active') {
                // App came to foreground, check NFC status
                checkNfcStatus();
                startStatusMonitoring();
            } else if (nextAppState === 'background' || nextAppState === 'inactive') {
                // App went to background, stop monitoring to save battery
                stopStatusMonitoring();
            }
        },
        [checkNfcStatus, startStatusMonitoring, stopStatusMonitoring],
    );

    // SIDE EFFECTS ---------------------------------------->
    // Initialize NFC
    useEffect(() => {
        initNFC();

        return () => {
            cleanup();
        };
    }, []);

    // Start/stop passive listening
    useEffect(() => {
        if (isNfcInitialized && isNfcEnabled && !isListening) {
            startPassiveListening();
        } else if (isNfcInitialized && !isNfcEnabled && isListening) {
            stopPassiveListening();
        }
    }, [isNfcInitialized, isNfcEnabled, isListening, startPassiveListening, stopPassiveListening]);

    // Monitor app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Start monitoring when component mounts
        startStatusMonitoring();

        return () => {
            subscription.remove();
            stopStatusMonitoring();
        };
    }, [handleAppStateChange, startStatusMonitoring, stopStatusMonitoring]);

    return {
        isNfcInitialized,
        isNfcEnabled,
        isListening,
        startPassiveListening,
        stopPassiveListening,
        handleLogout,
        handleTagScanned,
        resetLastTagId,
        checkNfcStatus,
    };
};

export default useNfc;
