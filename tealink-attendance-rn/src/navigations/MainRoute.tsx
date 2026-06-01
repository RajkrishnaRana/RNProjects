import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomSidebarMenu from '../components/Menu/CustomSidebarMenu';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAppSelector } from '../hooks/typedReduxHooks';
import { wp } from '../utils/dimesion';
import ViewWorkersScreen from '../screens/ViewWorkersScreen';
import MarkTimeScreen from '../screens/MarkTimeScreen';
import PrintRecordsScreen from '../screens/PrintRecordsScreen';
import RecordPluckingDetailsScreen from '../screens/RecordPluckingDetailsScreen';
import RecordNonPluckingDetailsScreen from '../screens/RecordNonPluckingDetailsScreen';
import WorkerDetailsScreen from '../screens/WorkerDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { navigationRef } from '../services/navigationServices';
import FaceDetectionAndCaptureScreen from '../screens/Testing/FaceDetectionAndCaptureScreen';
import FaceDetectionModuleScreen from '../screens/FaceDetectionModuleScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import MarkOutTimeScreen from '../screens/MarkOutTimeScreen';
import BleLogsScreen from '../screens/BleLogsScreen';
import { AutoSyncWatcher } from '../components/Watcher/AutoSyncWatcher';
import { DatabaseCleaner } from '../components/DatabaseCleaner';
import { PendingOfflineDataScreen } from '../screens/PendingOfflineDataScreen';
import TimezoneWatcher from '../components/Watcher/TimezoneWatcher';
import LogRecordScreen from '../screens/LogRecordScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const drawerContent = (props: any) => <CustomSidebarMenu {...props} />;

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
                    width: wp(70), // Set the width as a percentage of the screen width
                    // paddingTop: isIos() ? 0 : StatusBar.currentHeight ?? 0,
                },
                headerShown: false,
            }}
            drawerContent={drawerContent}
        >
            <Drawer.Screen name="Home" component={DashboardScreen} />
        </Drawer.Navigator>
    );
};

const AppStack = () => {
    return (
        <>
            <TimezoneWatcher />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Drawer" component={DrawerNavigator} />
                <Stack.Screen name="View Workers" component={ViewWorkersScreen} />
                <Stack.Screen name="Plucking In Time" component={MarkTimeScreen} />
                <Stack.Screen name="Mark Out Time" component={MarkOutTimeScreen} />
                <Stack.Screen name="Record Plucking" component={RecordPluckingDetailsScreen} />
                <Stack.Screen name="Record Non Plucking" component={RecordNonPluckingDetailsScreen} />
                <Stack.Screen name="Print Records" component={PrintRecordsScreen} />
                <Stack.Screen name="Worker Profile" component={WorkerDetailsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Testing" component={FaceDetectionAndCaptureScreen} />
                <Stack.Screen name="FaceDetection" component={FaceDetectionModuleScreen} />
                <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
                <Stack.Screen name="BleLogs" component={BleLogsScreen} />
                <Stack.Screen name="PendingOfflineData" component={PendingOfflineDataScreen} />
                <Stack.Screen name="LogRecord" component={LogRecordScreen} />
            </Stack.Navigator>
        </>
    );
};

export default function MainRoute() {
    const { isAuthenticated } = useAppSelector(state => state.session);

    return (
        <>
            <DatabaseCleaner />
            <AutoSyncWatcher />
            <TimezoneWatcher />
            <NavigationContainer ref={navigationRef}>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>
        </>
    );
}
