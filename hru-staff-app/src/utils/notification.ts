import {
    check,
    PERMISSIONS,
    requestNotifications,
} from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import {AuthorizationStatus} from '@react-native-firebase/messaging';
import {
    getMessaging,
    requestPermission,
    getToken,
    onMessage,
    subscribeToTopic,
} from '@react-native-firebase/messaging';
import notifee, {
    AndroidImportance,
    AndroidBadgeIconType,
    AndroidColor,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import {postData} from '../api';
import {captureLocation} from './foregroundTask';
import NetInfo from '@react-native-community/netinfo';
import {useNotificationStore} from '../store/notificationStore';
import {getUniqueId} from 'react-native-device-info';
import {useAuthStore} from '../store/authStore';
import BASE_URL from '../config';

type commandProps = 'LOCATION' | 'INTERNET' | 'TIME' | 'PERMISSION' | undefined;

const setNotificationDetails = async (token: string) => {
    try {
        const FCMToken = useNotificationStore.getState().FCMToken;
        const id = await getUniqueId();

        const payload = {
            token: token,
            fcmToken: FCMToken,
            deviceId: id,
        };

        const url = `${BASE_URL}/hru/Patientappapi/savefcmtoken`;
        console.log('FCM payload ------------->', payload);
        const res = await postData(url, payload);

        if (!res.status) {
            Toast.show(res.msg, Toast.SHORT);
            throw new Error(res.msg);
        }

        console.log(res);
    } catch (error) {
        console.error(error);
    }
};

const requestUserPermission = async () => {
    const messaging = getMessaging(); // Use the modular API
    const authStatus = await requestPermission(messaging);
    const setFCMToken = useNotificationStore.getState().setFCMToken;

    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        const token = await getToken(messaging);
        console.log('FCM Token:', token);
        setFCMToken(token);
    }
};

const notificationPermission = async () => {
    try {
        await requestNotifications(['alert', 'sound']).then(
            ({status, settings}) => {
                if (status !== 'granted') {
                    Toast.show(
                        'Notification permission not granted',
                        Toast.SHORT,
                    );
                }
            },
        );
    } catch (error) {}
};

const registerTopic = async (topic: string) => {
    try {
        const messaging = getMessaging(); // Use getMessaging
        await subscribeToTopic(messaging, topic); // Replace namespaced API
    } catch (error) {
        console.error(`Error subscribing to topic "${topic}":`, error);
    }
};

const dataNotificationHandler = async (
    command: commandProps,
    url: string,
    _id: string,
    permission?: 'LOCATION' | 'STORAGE',
) => {
    try {
        const token = useAuthStore.getState().token;
        let payload: any = {};

        if (command === 'LOCATION') {
            const location = await captureLocation();
            if (location) {
                payload = {...location, token, _id, type: 'Location'};
            } else {
                throw new Error('Could not get an accurate location');
            }
        } else if (command === 'INTERNET') {
            const state = await NetInfo.fetch(); // ✅ Fetch network status instantly
            payload = {
                isConnected: state.isConnected,
                token,
                _id,
                type: 'Internet',
            };
        } else if (command === 'TIME') {
            const date = new Date();
            payload = {time: date.getTime(), token, _id, type: 'Time'};
        } else if (command === 'PERMISSION') {
            if (permission === 'LOCATION') {
                const fineLocationAccess =
                    (await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)) ===
                    'granted';
                const backgroundLocationAccess =
                    (await check(
                        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
                    )) === 'granted';

                payload = {
                    fineLocationAccess,
                    backgroundLocationAccess,
                    token,
                    _id,
                    type: 'Location Permission',
                };
            }

            if (permission === 'STORAGE') {
                const storageAccess =
                    (await check(
                        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                    )) === 'granted';
                payload = {
                    storageAccess,
                    token,
                    _id,
                    type: 'Storage Permission',
                };
            }
        }

        console.log('Payload:', payload);
        const res = await postData(url, {
            ...payload,
            currentTime: new Date().getTime(),
        });
        console.log('Server Response:', res);
    } catch (e) {
        console.error('Error in dataNotificationHandler:', e);
    }
};

const displayNotification = () => {
    const messaging = getMessaging(); // Initialize messaging instance

    console.log(messaging);
    onMessage(messaging, async remoteMessage => {
        if (Platform.OS === 'ios') {
            // Request permissions (required for iOS)
            await notifee.requestPermission();
        }

        console.log({remoteMessage});
        if (!remoteMessage) {
            console.error('No remote message received');
            return;
        }

        // Display notification if only the notification payload is available
        if (
            remoteMessage?.data?.type === 'Phlebotomist Assign' ||
            remoteMessage?.notification
        ) {
            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'Alerts',
                name: 'Alerts',
                sound: 'default',
                vibration: true,
                vibrationPattern: [300, 500],
                importance: AndroidImportance.HIGH,
            });

            // Display a notification
            await notifee.displayNotification({
                title: remoteMessage?.data?.title as string,
                body: remoteMessage?.data?.msg as string,
                android: {
                    channelId,
                    smallIcon: 'logo',
                    badgeIconType: AndroidBadgeIconType.LARGE,
                    importance: AndroidImportance.HIGH,
                    color: AndroidColor.YELLOW,
                    pressAction: {
                        id: 'default',
                    },
                },
            });
        }

        // If data message coming, then perform data operation
        if (
            remoteMessage?.data &&
            remoteMessage?.data?.type !== 'Phlebotomist Assign'
        ) {
            await dataNotificationHandler(
                remoteMessage?.data?.command as commandProps,
                remoteMessage?.data?.url as string,
                remoteMessage?.data?._id as string,
                remoteMessage?.data?.permission as 'LOCATION' | 'STORAGE',
            );
        }
    });
};

export {
    requestUserPermission,
    notificationPermission,
    registerTopic,
    displayNotification,
    dataNotificationHandler,
    setNotificationDetails,
};
