import { StatusBar, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import MainRoute from './src/navigations/MainRoute';
import { PersistGate } from 'redux-persist/integration/react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { wp } from './src/utils/dimesion';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from '.';
import * as Sentry from '@sentry/react-native';
import isTab from './src/utils/isTab';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

Sentry.init({
    dsn: 'https://b07a131471f65a04178161437c153e50@o4510668029100032.ingest.us.sentry.io/4510668034670592',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnReconnect: true,
            retry: 2, // Retry failed requests twice
        },
    },
});

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={styles.successToast}
            text1Style={styles.successToastText}
            text2Style={styles.errorToastDesc}
            text2NumberOfLines={2}
        />
    ),
    error: (props: any) => <ErrorToast {...props} text1Style={styles.successToastText} text2Style={styles.errorToastDesc} text2NumberOfLines={2} />,
    warning: (props: any) => (
        <BaseToast
            {...props}
            style={styles.warningToast}
            contentContainerStyle={styles.contentContainer}
            text1Style={styles.successToastText}
            text2Style={styles.errorToastDesc}
            text2NumberOfLines={2}
        />
    ),
};

export default Sentry.wrap(function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <DatabaseProvider database={database}>
                <GestureHandlerRootView style={styles.container}>
                    <KeyboardProvider>
                        <Provider store={store}>
                            <PersistGate loading={null} persistor={persistor}>
                                <StatusBar animated={true} backgroundColor="transparent" translucent={true} hidden={false} barStyle="dark-content" />
                                <MainRoute />
                                <Toast config={toastConfig} visibilityTime={4000} />
                            </PersistGate>
                        </Provider>
                    </KeyboardProvider>
                </GestureHandlerRootView>
            </DatabaseProvider>
        </QueryClientProvider>
    );
});

const styles = StyleSheet.create({
    successToast: { borderLeftColor: 'green' },
    successToastText: {
        fontSize: isTab ? wp(2) : wp(3.7),
        fontWeight: '600',
    },
    errorToastDesc: {
        fontSize: isTab ? wp(1.5) : wp(3),
    },
    warningToast: {
        borderLeftColor: '#EF8A19',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
    },
    contentContainer: { paddingHorizontal: 15 },
    container: { flex: 1 },
});
