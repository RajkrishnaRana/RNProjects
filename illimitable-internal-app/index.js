/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {getMessaging, setBackgroundMessageHandler} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, AndroidBadgeIconType, AndroidColor, EventType} from '@notifee/react-native';

const messaging = getMessaging(); // Initialize messaging instance

const timeOnly = str => str.split(', ')[1];

setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

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
                    ? `Good 👍,You are already checked-in at ${timeOnly(logInTime)}`
                    : 'Please check-in when you arrive.'
                : logOutTime
                ? `You are already checked-out at ${timeOnly(logOutTime)} 🎉`
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

    // If data message coming, then perform data operation
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
            title: remoteMessage?.notification?.type || remoteMessage?.data?.type,
            body: remoteMessage?.notification?.body || remoteMessage?.data?.msg,
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
