import {requestNotifications} from 'react-native-permissions';
import {AuthorizationStatus} from '@react-native-firebase/messaging';
import {getMessaging, requestPermission, getToken, onMessage, subscribeToTopic} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, AndroidBadgeIconType, AndroidColor} from '@notifee/react-native';
import {Platform} from 'react-native';
import {useNotificationStore} from '../store/notificationStore';
import {getUniqueId} from 'react-native-device-info';
import {postData} from '../utils/apiHelper';
import Toast from 'react-native-toast-message';

const setNotificationDetails = async (token: string) => {
    try {
        const FCMToken = useNotificationStore.getState().FCMToken;
        const id = await getUniqueId();

        const payload = {
            token: token,
            fcmToken: FCMToken,
            deviceId: id,
        };
        // console.log(payload);

        const url = 'https://illimitable.in/app/mobile/save-fcm-token.json';
        console.log('FCM payload ------------->', payload);
        const res = await postData(url, payload);

        if (!res.status) {
            Toast.show({
                type: 'error',
                text1: `${res.msg}`,
                visibilityTime: 4000,
            });
            return;
        }

        console.log('FCM Token set successfully', res);
    } catch (error) {
        console.error(error);
        Toast.show({
            type: 'error',
            text1: 'Error setting FCM token to the server',
            visibilityTime: 4000,
        });
    }
};

const requestUserPermission = async () => {
    const messaging = getMessaging(); // Use the modular API
    const authStatus = await requestPermission(messaging);
    const setFCMToken = useNotificationStore.getState().setFCMToken;

    const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        const token = await getToken(messaging);
        console.log('FCM Token:', token);
        setFCMToken(token);
    }
};

const notificationPermission = async () => {
    try {
        // await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(status => {
        //     if (status === 'granted') {
        //     }
        // });

        await requestNotifications(['alert', 'sound']).then(({status}) => {
            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: 'Notification permission not granted',
                    visibilityTime: 4000,
                });
            }
        });
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

const timeOnly = (str: string) => str.split(', ')[1];

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

        // If data service message coming, then perform data operation
        if (remoteMessage?.data?.statusCheck === 'true') {
            const {attendence, logInTime, logOutTime} = remoteMessage.data;
            const nowHour = new Date().getHours();
            const isAM = nowHour < 12;

            let body = '';

            if (attendence === 'true') {
                body = isAM
                    ? logInTime
                        ? `Good 👍,You are already checked-in at ${timeOnly(logInTime as string)}`
                        : 'Please check-in when you arrive.'
                    : logOutTime
                    ? `You are already checked-out at ${timeOnly(logOutTime as string)} 🎉`
                    : 'Please check-out when you leave.';
            } else {
                body = isAM ? 'You are not logged in today, please log in.' : 'You are not logged in today, please log in and then check-out.';
            }

            const channelId = await notifee.createChannel({
                id: 'attendance',
                name: 'Attendance',
                sound: 'default',
                vibration: true,
                vibrationPattern: [300, 500],
                importance: AndroidImportance.HIGH,
            });

            await notifee.displayNotification({
                title: 'Attendance reminder',
                body,
                android: {channelId, importance: AndroidImportance.HIGH, pressAction: {id: 'default'}},
                ios: {sound: 'default', foregroundPresentationOptions: {alert: true, badge: true, sound: true}},
            });

            return;
        }

        // Display notification if only the notification payload is available
        if (remoteMessage?.notification || remoteMessage?.data?.type) {
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
                title: (remoteMessage?.notification?.title as string) || (remoteMessage?.data?.type as string),
                body: (remoteMessage?.notification?.body as string) || (remoteMessage?.data?.msg as string),
                android: {
                    channelId,
                    badgeIconType: AndroidBadgeIconType.LARGE,
                    importance: AndroidImportance.HIGH,
                    color: AndroidColor.YELLOW,
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    // iOS-specific configurations
                    sound: 'default', // Play the default iOS notification sound
                    foregroundPresentationOptions: {
                        alert: true, // Show the alert in the foreground
                        badge: true, // Update the badge in the foreground
                        sound: true, // Play the sound in the foreground
                    },
                    categoryId: 'alerts', // Optional: Use for interactive notifications (e.g., actions)
                },
            });
        }
    });
};

export {setNotificationDetails, requestUserPermission, notificationPermission, registerTopic, displayNotification};
