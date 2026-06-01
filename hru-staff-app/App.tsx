import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import MainRoute from './src/routes';
import Orientation from 'react-native-orientation-locker';
import './global.css';
import {
    displayNotification,
    notificationPermission,
    registerTopic,
    requestUserPermission,
} from './src/utils/notification';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            // refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchInterval: 10 * 60 * 1000,
            retry: 2, // Retry failed requests twice
        },
    },
});

export default function App() {
    useEffect(() => {
        Orientation.lockToPortrait();
        registerTopic('Alerts');
        notificationPermission();
        requestUserPermission();
        displayNotification();

        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="transparent"
                        barStyle="dark-content" // or 'dark-content' depending on your text color preference
                    />
                    <MainRoute />
                </SafeAreaView>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
