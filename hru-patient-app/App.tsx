import { StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import MainRoute from './src/routes/MainRoute';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-get-random-values';
import { displayNotification, notificationPermission, registerTopic, requestUserPermission } from './src/utils/notification';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnReconnect: true,
            retry: 2, // Retry failed requests twice
        },
    },
});

export default function App() {
    useEffect(() => {
        const initNotifications = async () => {
            await notificationPermission(); // ✅ wait for permission first
            await requestUserPermission(); // ✅ then get token
            await registerTopic('Alerts');
            displayNotification();
        };
        initNotifications();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <StatusBar
                    translucent={true}
                    backgroundColor="transparent"
                    barStyle="dark-content" // or 'dark-content' depending on your text color preference
                />
                <MainRoute />
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
