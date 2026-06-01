import {AppState, AppStateStatus, Image, Modal, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigation} from '../hooks/useNavigation';
import {useAuthStore} from '../store/authStore';
import {useMedsIntakeStore} from '../store/medsIntakeStore';
import notifee, {EventType} from '@notifee/react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

export default function MedsIntakeHandler() {
    const navigation = useNavigation();
    const appState = useRef(AppState.currentState);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const {
        type,
        showModal,
        timeStamp,
        medicineName,
        medicineDosage,
        medicineUnit,
        notificationId,
        medicineId,
        medicineQuantity,
        setNotificationData,
        clearNotificationData,
    } = useMedsIntakeStore();

    const handleNotification = (notification: any, actionId: string, eventType: EventType) => {
        console.log('Handling notification:', {notificationData: notification?.data, actionId, eventType});

        if (
            notification?.data &&
            (actionId === 'medicine-intake' || actionId === 'full-screen' || eventType === EventType.TRIGGER_NOTIFICATION_CREATED)
        ) {
            const {type, timeStamp, medicineName, medicineDosage, medicineUnit, notificationId, screen, medicineId, medicineQuantity} =
                notification.data;
            if (timeStamp && medicineName && notificationId) {
                setNotificationData({
                    showModal: true,
                    timeStamp: timeStamp as string,
                    medicineName: medicineName as string,
                    medicineDosage: medicineDosage as string,
                    medicineUnit: medicineUnit as string,
                    notificationId: notificationId as string,
                    medicineId: medicineId as string,
                    type: type as 'Intake' | 'Refill' | null,
                    medicineQuantity: medicineQuantity as string,
                });
                Vibration.vibrate([500, 500, 500], true);
                if (isAuthenticated && screen === 'MEDICINE INTAKE' && medicineId) {
                    navigation.navigate('MEDICINE INTAKE', {medicineId: medicineId as string});
                } else if (isAuthenticated && screen === 'MEDICINE REFILL' && medicineId) {
                    navigation.navigate('MEDICINE REFILL', {medicineId: medicineId as string});
                } else if (!isAuthenticated) {
                    navigation.navigate('Login');
                }
            }
        }
    };

    // Handle initial notification (killed state)
    useEffect(() => {
        const checkInitialNotification = async () => {
            try {
                const initialNotification = await notifee.getInitialNotification();
                if (initialNotification && initialNotification.notification) {
                    console.log('Initial notification:', initialNotification);
                    const actionId = initialNotification.pressAction?.id || 'full-screen';
                    handleNotification(initialNotification.notification, actionId, EventType.PRESS);
                }
            } catch (error) {
                console.error('Error checking initial notification:', error);
            }
        };
        setTimeout(checkInitialNotification, 500);
    }, [navigation, isAuthenticated]);

    // Handle foreground and background notifications
    useEffect(() => {
        const unsubscribeForeground = notifee.onForegroundEvent(({type, detail}) => {
            console.log('Foreground event notifee:', {type, detail});
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
                const actionId = detail.pressAction?.id || 'full-screen';
                handleNotification(detail.notification, actionId, type);
            }
        });

        const unsubscribeBackground = notifee.onBackgroundEvent(async ({type, detail}) => {
            console.log('Background event notifee:', {type, detail});
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS || type == EventType.DELIVERED) {
                const actionId = detail.pressAction?.id || 'full-screen';
                console.log('Background notification pressed:', detail.notification?.data, 'Action ID:', actionId);
                handleNotification(detail.notification, actionId, type);
            }
        });

        // Handle app state changes
        // const handleAppStateChange = async (nextAppState: string) => {
        //     if (appState.current.match(/background|inactive/) && nextAppState === 'active') {
        //         console.log('App came to foreground - checking for notification intent');

        //         const initialNotification = await notifee.getInitialNotification();
        //         console.log('Initial notification:', initialNotification);
        //         if (initialNotification && initialNotification.notification) {
        //             const actionId = initialNotification.pressAction?.id || 'full-screen' || 'medicine-intake';
        //             handleNotification(initialNotification.notification, actionId, EventType.PRESS);
        //         }
        //     }

        //     appState.current = nextAppState as AppStateStatus;
        // };

        // const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            unsubscribeForeground();
            // subscription.remove();
        };
    }, [navigation, isAuthenticated]);

    const dismissAlarm = async () => {
        try {
            clearNotificationData();
            Vibration.cancel();
            if (notificationId) {
                await notifee.cancelNotification(notificationId);
                console.log(`Cleared notification with ID: ${notificationId}`);
            }
            await notifee.stopForegroundService();
        } catch (error) {
            console.error('Failed to dismiss alarm:', error);
        }
    };

    return (
        <Modal animationType="fade" transparent={true} visible={showModal} onRequestClose={dismissAlarm}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        source={require('../assets/images/pills.png')}
                        style={{
                            alignSelf: 'center',
                            height: wp(20),
                            width: wp(20),
                            marginBottom: hp(2),
                        }}
                    />
                    <Text style={[styles.modalTitle, {color: colors.darkBlue, fontSize: wp(4.5)}]}>{medicineName}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: hp(2)}}>
                        <Text style={styles.modalTitle}>{timeStamp?.split(',')[2]}</Text>
                        <Text style={styles.modalTitle}> - </Text>
                        <Text style={styles.modalTitle}>{type === 'Intake' ? `${medicineDosage} ${medicineUnit}` : `${medicineQuantity} unit`}</Text>
                    </View>
                    {type == 'Intake' ? (
                        <Text style={styles.modalMessage}>
                            It's {timeStamp}, time to take your medicine - {medicineName}
                        </Text>
                    ) : (
                        <Text style={styles.modalMessage}>
                            It's {timeStamp}, please refill your medicine - {medicineName}
                        </Text>
                    )}
                    <TouchableOpacity style={styles.dismissButton} onPress={dismissAlarm}>
                        <Text style={styles.dismissButtonText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp(1),
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: wp(3.5),
        color: '#666',
        marginBottom: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
    dismissButton: {
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        alignSelf: 'flex-end',
    },
    dismissButtonText: {
        color: '#fff',
        fontSize: wp(3.5),
        fontWeight: '600',
    },
});
