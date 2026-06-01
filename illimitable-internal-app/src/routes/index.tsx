import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import {Image, ImageSourcePropType} from 'react-native';
import {bottomTabIcons} from '../constants/bottomTabIcons';
import {memo, useEffect, useState} from 'react';
import MyAttendanceScreen from '../screens/MyAttendanceScreen';
import SplashScreen from '../screens/SplashScreen';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from '../screens/NoInternetScreen';
import MyLeaveScreen from '../screens/MyLeaveScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import LateScreen from '../screens/LateScreen';
import ApplyForLeaveScreen from '../screens/ApplyForLeaveScreen';
import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface Props {
    name: ImageSourcePropType;
    size: number;
    color: string;
}

interface TabBarIconsProps {
    size: number;
    color: string;
}

const TabBarIcons = memo(({name, size, color}: Props) => {
    return (
        <Image
            source={name}
            style={{
                height: size,
                width: size,
                tintColor: color,
            }}
        />
    );
});

const TabBar = (props: any) => <CustomTabBar {...props} />;
const DashboardIcon = ({color, size}: TabBarIconsProps) => <TabBarIcons name={bottomTabIcons.home} color={color} size={size} />;
const MyAttendanceIcon = ({color, size}: TabBarIconsProps) => <TabBarIcons name={bottomTabIcons.myAttendance} color={color} size={size} />;
const LateIcon = ({color, size}: TabBarIconsProps) => <TabBarIcons name={bottomTabIcons.late} color={color} size={size} />;
const LeaveIcon = ({color, size}: TabBarIconsProps) => <TabBarIcons name={bottomTabIcons.leave} color={color} size={size} />;
const AnnouncementIcon = ({color, size}: TabBarIconsProps) => <TabBarIcons name={bottomTabIcons.announcement} color={color} size={size} />;

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            tabBar={TabBar}
            screenOptions={{
                headerShown: false,
                animation: 'shift',
            }}>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: DashboardIcon,
                }}
            />

            {/* ATTENDANCE TAB */}
            <Tab.Screen
                name="My Attendance"
                component={MyAttendanceScreen}
                options={{
                    tabBarIcon: MyAttendanceIcon,
                }}
            />
            {/* <Tab.Screen
                name="Testing"
                component={TestingScreen}
                options={{
                    tabBarIcon: ({color, size}) => <TabBarIcons name={bottomTabIcons.myAttendance} color={color} size={size} />,
                }}
            /> */}

            {/* LATE ARRIVAL TAB */}
            <Tab.Screen
                name="Late"
                component={LateScreen}
                options={{
                    tabBarIcon: LateIcon,
                }}
            />

            {/* LEAVE TAB */}
            <Tab.Screen
                name="Leave"
                component={MyLeaveScreen} //scrren to be changed
                options={{
                    tabBarIcon: LeaveIcon,
                }}
            />

            {/* ANNOUNCEMENT TAB */}
            <Tab.Screen
                name="Announcement"
                component={AnnouncementScreen}
                options={{
                    tabBarIcon: AnnouncementIcon,
                }}
            />
        </Tab.Navigator>
    );
};

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false, animation: 'none'}} />
            <Stack.Screen name="Home" component={BottomTabNavigator} options={{headerShown: false, animation: 'none'}} />
            <Stack.Screen
                name="ApplyForLeave"
                component={ApplyForLeaveScreen}
                options={{
                    headerShown: false,
                    animation: 'fade_from_bottom', // Removes dimming effect
                }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false, animation: 'fade_from_bottom'}} />
        </Stack.Navigator>
    );
};

export default function MainRoute() {
    const [isNoInternet, setIsNoInternet] = useState(false);

    // User Net connection checking event -------------->
    useEffect(() => {
        // Initial network check and token validation
        const initializeApp = async () => {
            try {
                const netState = await NetInfo.fetch();
                if (!netState.isConnected) {
                    setIsNoInternet(true);
                } else {
                    setIsNoInternet(false);
                    // Only validate if user is supposed to be authenticated
                }
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };

        initializeApp();

        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(state => {
            // console.log('Network state changed:', state.isConnected);
            if (!state.isConnected) {
                setIsNoInternet(true);
            } else {
                setIsNoInternet(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (isNoInternet) {
        return <NoInternetScreen setIsNoInternet={setIsNoInternet} />;
    }

    return (
        <NavigationContainer>
            <AppStack />
        </NavigationContainer>
    );
}
