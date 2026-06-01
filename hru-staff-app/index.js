/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import notifee, {
    AndroidImportance,
    AndroidBadgeIconType,
    AndroidColor,
    EventType,
} from '@notifee/react-native';
import {dataNotificationHandler} from './src/utils/notification';

const messaging = getMessaging(); // Initialize messaging instance

setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    if (!remoteMessage) {
        console.error('No remote message received');
        return;
    }

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
            title: remoteMessage?.data?.title,
            body: remoteMessage?.data?.msg,
            android: {
                channelId,
                largeIcon: 'large_icon',
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
            remoteMessage?.data?.command,
            remoteMessage?.data?.url,
            remoteMessage?.data?._id,
            remoteMessage?.data?.permission,
        );
    }
});

// Notifee background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
    // console.log('Notifee background event:', type, detail);

    if (type === EventType.DISMISSED) {
        console.log('Notification was dismissed');
    } else if (type === EventType.PRESS) {
        console.log('Notification was pressed');
    }
});

AppRegistry.registerComponent(appName, () => App);
