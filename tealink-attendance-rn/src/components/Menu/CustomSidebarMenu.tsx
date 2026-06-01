import { Alert, StatusBar, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { colors } from '../../common/colors';
import GreenGradientBackground from '../Backgrounds/GreenGradientBackground';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';
import useSidebarMenu from '../../hooks/menuHooks/useSidebarMenu';
import MidButton from '../Buttons/MidButton';
import { wp } from '../../utils/dimesion';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { overFlowText } from '../../utils/textHelper';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutSession } from '../../store/slices/sessionSlice';
import Lucide from '@react-native-vector-icons/lucide';
import { stopOfflineWatcher } from '../../store/thunks/syncThunk';
import DrawerMenu from './DrawerMenu';
import { useNavigation } from '../../hooks/useNavigation';
import { saveLogInOut } from '../../services/mmkvServices';

export default function CustomSidebarMenu(props: DrawerContentComponentProps) {
    const { userData } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const { profileIcon, online } = useSidebarMenu();
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                onPress: () => {
                    saveLogInOut({ type: 'Log Out' });
                    dispatch(logoutSession());
                    dispatch(stopOfflineWatcher());
                },
            },
        ]);
    };

    const handleLogRecords = () => {
        navigation.push('LogRecord');
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeAreaContainer}>
            <DrawerContentScrollView contentContainerStyle={styles.container} {...props}>
                <GreenGradientBackground>
                    <View style={styles.header}>
                        <View style={styles.profileIconContainer}>
                            <Text style={styles.profileIconText}>{profileIcon}</Text>
                        </View>
                        <View style={{ width: wp(50) }}>
                            <Text style={styles.name}>{overFlowText(userData?.name || '', 20)}</Text>
                            <Text style={styles.email}>{overFlowText(userData?.email || '', 29)}</Text>
                        </View>
                    </View>

                    {userData?.companyName && (
                        <>
                            <View style={styles.breakline} />
                            <View style={styles.companyContainer}>
                                <View style={styles.companyIconContainer}>
                                    <Lucide name={'building-2'} color={colors.white} size={17} />
                                </View>
                                <View>
                                    <Text style={styles.appVersion}>Company Name : </Text>
                                    <Text style={styles.companyName}>{userData?.companyName}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.appDetailsContainer}>
                        <View>
                            <Text style={styles.appName}>TEAlink Attendance</Text>
                            <Text style={styles.appVersion}>Version: {DeviceInfo.getVersion()}</Text>
                        </View>
                        <View style={[styles.onlineOrOfflineContainer]}>
                            <View style={[styles.dot, { backgroundColor: online ? colors.lightGreen : colors.red }]} />
                            <Text style={[styles.onlineOrOffline, { color: online ? colors.lightGreen : colors.red }]}>
                                {online ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </GreenGradientBackground>

                <DrawerMenu name="Log Records" description="Your log-in and log-out records" handlePress={handleLogRecords} />
            </DrawerContentScrollView>

            {/* Logout Button */}
            <MidButton
                customIcon={<MaterialDesignIcons name="logout" size={20} color={colors.white} />}
                onPress={handleLogout}
                title="Logout"
                customStyle={styles.logoutButton}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: { flex: 1 },
    container: {
        flexGrow: 1,
        paddingStart: 0,
        paddingEnd: 0,
        paddingTop: 0,
    },
    header: {
        marginTop: (StatusBar.currentHeight ?? 0) + 20,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    profileIconContainer: {
        marginLeft: 10,
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: colors.transparentWhiteBackground,
        borderWidth: 1,
        borderColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
    },
    profileIconText: {
        fontSize: 15,
        color: colors.white,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 10,
        marginHorizontal: wp(3),
        borderRadius: 10,
        backgroundColor: colors.red,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    email: {
        fontSize: 12,
        color: colors.white,
    },
    breakline: {
        borderWidth: 0.2,
        borderColor: colors.white,
        marginHorizontal: 10,
        marginVertical: 15,
    },
    companyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 10,
    },
    companyIconContainer: {
        padding: 8,
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 10,
    },
    companyName: {
        fontSize: 12,
        color: colors.white,
        fontWeight: 'bold',
        maxWidth: wp(50),
    },
    appDetailsContainer: {
        marginVertical: 20,
        marginHorizontal: 10,
        borderWidth: 0.2,
        borderColor: colors.white,
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.white,
    },
    appVersion: {
        fontSize: 9,
        color: colors.white,
    },
    onlineOrOfflineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    dot: {
        height: 6,
        width: 6,
        borderRadius: 6,
    },
    onlineOrOffline: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});
