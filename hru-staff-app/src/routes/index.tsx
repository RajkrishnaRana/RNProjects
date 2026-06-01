import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard';
import Login from '../screens/Login';
import {useAuthStore} from '../store/authStore';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import StackAppBar from '../components/StackAppBar';
import TestDetailsScreen from '../screens/TestDetailsScreen';
import BackgroundService from 'react-native-background-actions';
import {startCaptureLocationTask} from '../utils/foregroundTask';
import {useNavigation} from '../hooks/useNavigation';
import SplashScreen from '../screens/SplashScreen';
import SplashScreen2 from '../screens/SplashScreen2';
import {postData} from '../api';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from '../screens/NoInternetScreen';
import BASE_URL from '../config';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    const navigation = useNavigation();

    // SIDE EFFECTS -------------------------------->
    // This is for background task re running when app is restarting
    useEffect(() => {
        if (!BackgroundService.isRunning()) {
            startCaptureLocationTask();
        } else {
            console.log('Task is already running, skipping start.');
        }
    }, []);

    // useEffect(() => {
    //     const handleDeepLink = event => {
    //         const url = event.url; // Capture the deep link URL
    //         console.log('Received URL:', url);
    //         // You can navigate to specific pages based on the URL here
    //         const route = url.split('/')[3]; // Extract route from the URL

    //         console.log({route});
    //         navigation.push(route);
    //     };

    //     // Add the listener
    //     Linking.addEventListener('url', handleDeepLink);

    //     // Handle the initial URL when the app is first opened via a deep link
    //     Linking.getInitialURL().then(url => {
    //         if (url) {
    //             handleDeepLink({url});
    //         }
    //     });

    //     // Cleanup the listener when the component unmounts
    //     return () => {
    //         Linking.removeAllListeners('url');
    //     };
    // }, []);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Order Report List"
                component={Dashboard}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Order Details"
                component={OrderDetailsScreen}
                options={{header: () => <StackAppBar title="Order Details" />}}
            />
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    header: () => <StackAppBar title="Search ..." />,
                }}
            />
            <Stack.Screen
                name="LabDetails"
                component={TestDetailsScreen}
                options={{
                    header: () => <StackAppBar title="Test Details" />,
                }}
            />
        </Stack.Navigator>
    );
};

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Dashboard" component={Login} />
        </Stack.Navigator>
    );
};

export default function MainRoute() {
    const {isAuthenticated, logout, token} = useAuthStore();
    const [isLoading, setLoading] = useState(true);
    const [isNoInternert, setIsNoInternert] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}/hru/staffApp/validate-token.json`;
            const res = await postData(url, {token: token});

            // Toast2.show(`Token : ${token}`, Toast.SHORT);

            if (res.tokenExpired === true && token !== null) {
                // Toast.show('Token Expired got true', Toast.LONG);
                logout(); // Logout if token is invalid
            }

            // if (res.status === false) {
            //     Toast.show('Token is null or empty string', Toast.LONG);
            // }

            if (res.status) {
                // Toast.show('Token is valid', Toast.LONG);
            }
        } catch (error) {
            if (
                error instanceof TypeError &&
                error.message === 'Network request failed'
            ) {
                setIsNoInternert(true);
            } else {
                console.error('Token validation error:', error);
                Toast.show('Token validation error', Toast.LONG);

                // Toast.show(`${error}`, Toast.LONG);
            }
        } finally {
            setTimeout(() => {
                setLoading(false); // Hide splash screen after validation
            }, 700); // Optional delay for splash effect
        }
    };

    useEffect(() => {
        const checkInternet = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                setIsNoInternert(true);
            } else {
                setIsNoInternert(false);
                fetchData();
            }
        });
        return () => {
            checkInternet();
        };
    }, []);

    if (isNoInternert) return <NoInternetScreen />;

    if (isLoading) return <SplashScreen2 />;

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
