import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from '../screens/DashboardScreen';
import DynamicForm from '../screens/DynamicFormScreen';
import { useAppSelector } from '../hooks/typedReduxHooks';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import DrawerHeader from '../components/Headers/DrawerHeader';
import GeoFencingScreen from '../screens/GeoFencingScreen';
import LocationDistanceScreen from '../screens/LocationDistanceScreen';
import OfflineRibbon from '../components/OfflineRibbon';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerType: 'slide',
                drawerStyle: {
                    width: wp(60), // Set the width as a percentage of the screen width
                    // paddingTop: isIos() ? 0 : StatusBar.currentHeight ?? 0,
                },
            }}
            drawerContent={props => <CustomSidebarMenu {...props} />}
        >
            <Drawer.Screen name="Home" component={Dashboard} options={{ header: () => <DrawerHeader title="Dashboard" /> }} />
            <Drawer.Screen
                name="MeasureDistance"
                component={LocationDistanceScreen}
                options={{ header: () => <DrawerHeader title="Measure Distance" /> }}
            />
        </Drawer.Navigator>
    );
};

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Form" component={DynamicForm} options={{ headerShown: false }} />
            <Stack.Screen name="Geolocation" component={GeoFencingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default function MainRoute() {
    const [navigationState, setNavigationState] = useState(0);
    const { isAuthenticated } = useAppSelector(state => state.auth);

    return (
        <NavigationContainer
            onStateChange={() => {
                setNavigationState(prev => prev + 1);
            }}
        >
            {isAuthenticated ? <AppStack /> : <AuthStack />}
            <OfflineRibbon onNavigationChange={navigationState} />
        </NavigationContainer>
    );
}
