import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import MainRoute from './src/routes';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Colors} from './src/common/colors';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {displayNotification, notificationPermission, registerTopic, requestUserPermission} from './src/services/notificationServices';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const MY_DEVICE_ID = 'f4f81fbde6fd0559';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnReconnect: true,
            retry: 2, // Retry failed requests twice
        },
    },
});

// 1. Create the config FOR TOAST ANDROID
const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    warning: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#EF8A19',
                borderLeftWidth: 7,
                width: '90%',
                height: 70,
                borderRightColor: '#EF8A19',
                borderRightWidth: 7,
            }}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
                fontSize: wp(3.5),
                fontWeight: '500',
            }}
            text2Style={{
                fontSize: wp(3),
            }}
        />
    ),
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: 'green',
                borderLeftWidth: 7,
                width: '90%',
                height: 70,
                borderRightColor: 'green',
                borderRightWidth: 7,
            }}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
                fontSize: wp(3.5),
                fontWeight: '500',
            }}
            text2Style={{
                fontSize: wp(3),
            }}
        />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props: any) => (
        <ErrorToast
            {...props}
            text1NumberOfLines={3}
            style={{
                borderLeftColor: 'red',
                borderLeftWidth: 7,
                width: '90%',
                height: 70,
                borderRightColor: 'red',
                borderRightWidth: 7,
            }}
            text1Style={{
                fontSize: wp(3.5),
                fontWeight: '500',
            }}
            text2Style={{
                fontSize: wp(3),
            }}
        />
    ),
};

export default function App() {
    useEffect(() => {
        registerTopic('Alerts');
        notificationPermission();
        requestUserPermission();
        displayNotification();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="transparent"
                        barStyle="light-content" // or 'dark-content' depending on your text color preference
                    />

                    <MainRoute />
                    <Toast config={toastConfig} />
                </SafeAreaView>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
});
