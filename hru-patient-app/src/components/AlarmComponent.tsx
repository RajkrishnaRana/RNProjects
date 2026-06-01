import React, {useEffect} from 'react';
import notifee, {TimestampTrigger, TriggerType, AndroidImportance, AndroidStyle, AndroidVisibility} from '@notifee/react-native';
import moment from 'moment-timezone';

const AlarmComponent = ({timings, type}: any) => {
    // Create notification channel
    useEffect(() => {
        const createChannel = async () => {
            await notifee.createChannel({
                id: 'alarm-channel',
                name: 'Alarm Notifications',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: true,
                bypassDnd: true,
            });
        };
        createChannel();
    }, []);

    // Set alarms and handle notifications
    useEffect(() => {
        const setAlarms = async () => {
            try {
                // Get all scheduled notifications
                const scheduledNotifications = await notifee.getTriggerNotifications();

                // Filter and cancel notifications based on type
                const notificationsToCancel = scheduledNotifications.filter(notification => notification.notification.data?.type === type);

                for (const notification of notificationsToCancel) {
                    if (notification.notification.id) {
                        await notifee.cancelNotification(notification.notification.id);
                        console.log(`Cancelled notification with ID: ${notification.notification.id}`);
                    }
                }
            } catch (error) {
                console.error(`Error clearing ${type} notifications:`, error);
            }

            for (let key in timings) {
                for (let index = 0; index < timings[key].length; index++) {
                    const finalReminderTime = timings[key][index].finalReminderTime;
                    const time = finalReminderTime + 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
                    const timeStamp = moment.tz(time, 'Asia/Kolkata').format('Do MMM, YYYY, hh:mm A');

                    console.log('Alarm Timestamp', timeStamp, 'for medicine', timings[key][index].medicineName);

                    const now = Date.now();
                    if (time < now) {
                        console.warn(`Skipping notification for ${timeStamp}: Timestamp is in the past`);
                        continue;
                    }

                    const notificationId = `${timings[key][index]._id}_${time}`;

                    const trigger: TimestampTrigger = {
                        type: TriggerType.TIMESTAMP,
                        timestamp: time,
                    };

                    try {
                        await notifee.createTriggerNotification(
                            {
                                id: notificationId,
                                title: type == 'Intake' ? 'Medicine Intake Reminder' : 'Medicine Refill Reminder',
                                body: `It's ${timeStamp}, time to ${type == 'Intake' ? 'take' : 'refill'} your medicine - ${
                                    timings[key][index].medicineName
                                }`,
                                data: {
                                    type,
                                    timeStamp,
                                    medicineName: timings[key][index].medicineName,
                                    ...(type == 'Intake' && {medicineDosage: timings[key][index].dosage}),
                                    ...(type == 'Intake' && {medicineUnit: timings[key][index].unit}),
                                    ...(type == 'Refill' && {medicineQuantity: timings[key][index].quantity}),
                                    notificationId,
                                    deepLink: `myapp://${type == 'Intake' ? 'medicine-intake' : 'medicine-refill'}/${timings[key][index]._id}`,
                                    screen: type == 'Intake' ? 'MEDICINE INTAKE' : 'MEDICINE REFILL',
                                    medicineId: timings[key][index]._id,
                                },
                                android: {
                                    channelId: 'alarm-channel',
                                    importance: AndroidImportance.HIGH,
                                    sound: 'default',
                                    loopSound: type == 'Intake' ? true : false,
                                    vibrationPattern: [300, 500, 300, 500],
                                    visibility: AndroidVisibility.PUBLIC,
                                    style: {
                                        type: AndroidStyle.BIGTEXT,
                                        text: `It's ${timeStamp}, time to ${type == 'Intake' ? 'take' : 'refill'} your medicine - ${
                                            timings[key][index].medicineName
                                        }`,
                                    },
                                    ...(type === 'Intake'
                                        ? {
                                              fullScreenAction: {
                                                  id: 'medicine-intake',
                                                  // launchActivity: 'default',
                                                  launchActivityFlags: [2, 4],
                                                  mainComponent: 'AlarmScreen',
                                              },
                                          }
                                        : {}),
                                    autoCancel: false,
                                    timeoutAfter: undefined,
                                    pressAction: {
                                        id: 'medicine-intake',
                                        launchActivity: 'default',
                                    },
                                },
                                ios: {
                                    sound: 'default', // Use the default iOS notification sound
                                    // badges: 1, // Set a badge count on the app icon (optional, adjust as needed)
                                    foregroundPresentationOptions: {
                                        alert: true, // Show the notification banner in the foreground
                                        badge: true, // Update the badge in the foreground
                                        sound: true, // Play the sound in the foreground
                                    },
                                    categoryId: type === 'Intake' ? 'medicine-intake' : 'medicine-refill', // Category for interactive actions
                                    // Optional: Enable critical alerts for high-priority notifications (requires special entitlement)
                                    ...(type === 'Intake' && {
                                        critical: true,
                                        criticalVolume: 1.0, // Volume for critical alerts (0.0 to 1.0)
                                    }),
                                },
                            },
                            trigger
                        );
                        console.log(`Scheduled notification with ID: ${notificationId}`);
                    } catch (error) {
                        console.error(`Failed to schedule notification for ${timeStamp} (ID: ${notificationId}):`, error);
                    }
                }
            }

            try {
                const scheduledNotifications = await notifee.getTriggerNotificationIds();
                console.log('Scheduled Notification IDs:', scheduledNotifications);
            } catch (error) {
                console.error('Error fetching scheduled notifications:', error);
            }
        };

        if (timings) {
            setAlarms();
        }
    }, [timings]);

    return <></>;
};

export default AlarmComponent;
