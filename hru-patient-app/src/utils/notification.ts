import { PERMISSIONS, request, requestNotifications } from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import { AuthorizationStatus, FirebaseMessagingTypes, getAPNSToken } from '@react-native-firebase/messaging';
import { getMessaging, requestPermission, getToken, onMessage, subscribeToTopic } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidBadgeIconType, AndroidColor } from '@notifee/react-native';
import { Platform } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { getUniqueId } from 'react-native-device-info';
import { postData } from '../api';
import { BASE_URL } from '../config';

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
            console.error('Error setting FCM token:', res);
            throw new Error(res.msg);
        }

        console.log('FCM Token set successfully', res);
    } catch (error) {
        console.error(error);
    }
};

const requestUserPermission = async () => {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const setFCMToken = useNotificationStore.getState().setFCMToken;

    const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        Toast.show('Notification permission not granted', Toast.SHORT);
        return;
    }

    // ✅ Now safe to get FCM token
    const token = await getToken(messaging);
    console.log('FCM Token:', token);
    setFCMToken(token);
};

const notificationPermission = async () => {
    try {
        // await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(status => {
        //     if (status === 'granted') {
        //     }
        // });

        await requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
            if (status !== 'granted') {
                Toast.show('Notification permission not granted', Toast.SHORT);
            }
        });
    } catch (error) {}
};

const waitForAPNSToken = async (): Promise<string | null> => {
    if (Platform.OS !== 'ios') return null;

    const messaging = getMessaging();
    let apnsToken = null;
    let attempts = 0;

    while (!apnsToken && attempts < 5) {
        apnsToken = await getAPNSToken(messaging);
        if (!apnsToken) {
            attempts++;
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
        }
    }

    if (!apnsToken) {
        console.warn('APNS token unavailable after retries');
    }

    return apnsToken;
};

const registerTopic = async (topic: string) => {
    try {
        // ✅ Wait for APNS token on iOS before subscribing
        if (Platform.OS === 'ios') {
            const apnsToken = await waitForAPNSToken();
            if (!apnsToken) {
                console.warn('Skipping topic subscription — no APNS token');
                return;
            }
        }

        const messaging = getMessaging();
        await subscribeToTopic(messaging, topic);
        console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
        console.error(`Error subscribing to topic "${topic}":`, error);
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

        console.log({ remoteMessage });
        if (!remoteMessage) {
            console.error('No remote message received');
            return;
        }

        // If data message coming, then perform data operation
        // if (remoteMessage?.data) {
        // }

        // Display notification if only the notification payload is available
        if (remoteMessage?.notification || remoteMessage?.data) {
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
                title: (remoteMessage?.notification?.title as string) || (remoteMessage?.data?.title as string),
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

export { setNotificationDetails, requestUserPermission, notificationPermission, registerTopic, displayNotification };
