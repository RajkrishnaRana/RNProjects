import {Alert, Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {dayNames, monthNames} from '../../constants/dayMonth';
import CheckButton from '../buttons/CheckButton2';
import TimeRecord from '../TimeRecord';
import {recordTimeIcons} from '../../constants/bottomTabIcons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postData} from '../../utils/apiHelper';
import {useAuthStore} from '../../store/authStore';
import Geolocation from 'react-native-geolocation-service';
import {useAttendanceStore} from '../../store/attendanceStore';
import {requestLocationPermission} from '../../utils/permission';
import Toast from 'react-native-toast-message';
import {trigger} from 'react-native-haptic-feedback';
import dayjs from 'dayjs';
import {formatTimestampTo12Hour, toMs} from '../../utils/timeFunctions';
import {useNavigation} from '../../hooks/useNavigation';

export type CheckTime = {
    showTime: string;
    exactTime: number;
};

const getTimeStamp = () => {
    const now = new Date();

    // Create 10:59 AM reference
    const cutoff = new Date();
    cutoff.setHours(10, 59, 0, 0);

    if (now > cutoff) {
        // Return timestamp for 10:58 AM today
        const target = new Date();
        target.setHours(10, 58, 0, 0);
        return Math.floor(target.getTime() / 1000); // seconds
    } else {
        // Return current timestamp
        return Math.floor(now.getTime() / 1000); // seconds
    }
};

// Enhanced location retrieval with better error handling
const getAccurateLocation = (token: string | null, deviceId: string | null): Promise<any> => {
    return new Promise((resolve, reject) => {
        let watchId: number | null = null;
        let timeoutId: NodeJS.Timeout | null = null;
        let bestLocation: any = null;
        let locationUpdates = 0;
        const MAX_WAIT_TIME = 15000; // Increased to 15 seconds
        const DESIRED_ACCURACY = 20; // Relaxed from 5m to 20m
        const MIN_UPDATES = 1; // Minimum 1 updates before accepting

        // Cleanup function
        const cleanup = () => {
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
                watchId = null;
            }
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        // Timeout handler
        timeoutId = setTimeout(() => {
            console.log('Location timeout reached');
            cleanup();

            if (bestLocation) {
                console.log(`Returning best location with accuracy: ${bestLocation.location.accuracy}m`);
                resolve(bestLocation);
            } else {
                reject(new Error('LOCATION_TIMEOUT'));
            }
        }, MAX_WAIT_TIME);

        // Start watching for location updates
        watchId = Geolocation.watchPosition(
            position => {
                const {latitude, longitude, accuracy} = position.coords;
                locationUpdates++;

                console.log(`Location update ${locationUpdates}: Accuracy ${accuracy?.toFixed(2)}m`);

                // Update best location if this one is more accurate
                if (!bestLocation || (accuracy && accuracy < bestLocation.location.accuracy)) {
                    bestLocation = {
                        token: token,
                        deviceId: deviceId,
                        // deviceId: 'f4f81fbde6fd0559',
                        location: {latitude, longitude, accuracy: accuracy || 999},
                    };
                }

                // Resolve if we have good accuracy AND minimum updates
                if (accuracy && accuracy <= DESIRED_ACCURACY && locationUpdates >= MIN_UPDATES) {
                    console.log(`Good accuracy achieved: ${accuracy}m with ${locationUpdates} updates`);
                    cleanup();
                    resolve(bestLocation);
                }
                // Or if we have many updates with reasonable accuracy
                else if (locationUpdates >= 1 && accuracy && accuracy <= 50) {
                    console.log(`Sufficient updates with reasonable accuracy: ${accuracy}m`);
                    cleanup();
                    resolve(bestLocation);
                }
            },
            error => {
                console.error('Geolocation error:', error);
                cleanup();

                // Provide specific error messages based on error code
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        reject(new Error('PERMISSION_DENIED'));
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        reject(new Error('LOCATION_UNAVAILABLE'));
                        break;
                    case 3: // TIMEOUT
                        reject(new Error('LOCATION_TIMEOUT'));
                        break;
                    default:
                        reject(new Error('LOCATION_ERROR'));
                }
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0,
                interval: 1000, // Check every second
                fastestInterval: 1000,
                showLocationDialog: true, // Ask to enable GPS if disabled
                forceRequestLocation: true, // Force location request
            },
        );
    });
};

// Check if location services are enabled
const checkLocationServices = async (): Promise<boolean> => {
    return new Promise(resolve => {
        Geolocation.getCurrentPosition(
            () => resolve(true),
            error => {
                if (error.code === 2) {
                    // POSITION_UNAVAILABLE
                    resolve(false);
                } else {
                    resolve(true); // Other errors don't mean services are off
                }
            },
            {enableHighAccuracy: false, timeout: 5000, maximumAge: 0},
        );
    });
};

export default function ClockCard({gujuMode}: {gujuMode: boolean}) {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    // GLOBAL STATES ------------------------->
    const {token, deviceId, userData, logout} = useAuthStore();
    const {checkInTime, setCheckInTime, checkOutTime, setCheckOutTime, totalTime, setTotalTime} = useAttendanceStore();

    // LOCAL STATES ------------------------->
    const [currentTime, setCurrentTime] = useState(new Date());
    const [diffTime, setDiffTime] = useState<string | null>(null);

    // Refs to prevent memory leaks
    const isMounted = useRef(true);

    // console.log(userData);

    const formattedTime = dayjs().format('hh:mm A');
    const formattedDate = `${monthNames[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()} - ${
        dayNames[currentTime.getDay()]
    }`;

    const requestLocationWithGuidance = async (): Promise<boolean> => {
        try {
            // First check if location services are enabled
            const servicesEnabled = await checkLocationServices();
            if (!servicesEnabled) {
                Alert.alert(
                    'Location Services Disabled',
                    'Please enable Location Services in your device settings to use this feature.',
                    [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'Open Settings', onPress: () => Linking.openSettings()},
                    ],
                    {cancelable: false},
                );
                return false;
            }

            // Check permission
            const hasPermission = await requestLocationPermission();

            if (hasPermission) {
                return true;
            }

            // Show dialog if permission denied
            return new Promise(resolve => {
                Alert.alert(
                    'Location Permission Required',
                    'This app needs location access to record your check-in/check-out. Please grant permission in Settings.',
                    [
                        {text: 'Cancel', onPress: () => resolve(false)},
                        {
                            text: 'Open Settings',
                            onPress: () => {
                                Linking.openSettings();
                                resolve(false);
                            },
                        },
                    ],
                    {cancelable: false},
                );
            });
        } catch (error) {
            console.error('Permission check error:', error);
            return false;
        }
    };

    // Mutation for check in and out ------------------------------------->
    // const openSettings = () => {
    //     Linking.openSettings(); // cross-platform helper
    // };

    // Mutation for check in and out ------------------------------------->
    const url = 'https://illimitable.in/app/mobile/in-out.json';
    const mutation = useMutation({
        mutationFn: async () => {
            // Step 1: Request permission
            const hasPermission = await requestLocationWithGuidance();

            if (!hasPermission) {
                return Promise.reject(new Error('PERMISSION_DENIED'));
            }

            // Step 2: Get location with improved error handling
            try {
                const locationData = await getAccurateLocation(token, deviceId);
                const payload = {...locationData, timestamp: checkInTime || !gujuMode ? null : getTimeStamp()};

                // Step 3: Send data to server
                console.log({payload});
                const response = await postData(url, payload, logout);
                return response;
            } catch (error: any) {
                // Handle specific location errors
                if (error.message === 'LOCATION_TIMEOUT') {
                    throw new Error('Unable to get accurate location. Please try again in an open area.');
                } else if (error.message === 'PERMISSION_DENIED') {
                    throw new Error('Location permission denied. Please enable it in settings.');
                } else if (error.message === 'LOCATION_UNAVAILABLE') {
                    throw new Error('Location services are unavailable. Please enable GPS.');
                } else {
                    throw new Error('Failed to get your location. Please try again.');
                }
            }
        },
        onSuccess: data => {
            if (!isMounted.current) {
                return;
            }

            if (data?.status === false) {
                Toast.show({
                    type: 'error',
                    text1: data?.msg || 'Check-in/out failed',
                    visibilityTime: 4000,
                });
                return;
            }

            queryClient.invalidateQueries({queryKey: ['my-attendance-today']});
            console.log('Check-in/out success:', data);
            trigger('impactLight');
            Toast.show({
                type: 'success',
                text1: data?.msg || 'Success',
                visibilityTime: 4000,
            });

            if (!checkInTime) {
                setCheckInTime({
                    showTime: formattedTime,
                    exactTime: new Date().getTime(),
                });
            } else {
                setCheckOutTime({
                    showTime: formattedTime,
                    exactTime: new Date().getTime(),
                });
            }
        },
        onError: error => {
            if (!isMounted.current) {
                return;
            }

            console.error('Check-in/out error:', error);

            const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

            Toast.show({
                type: 'error',
                text1: errorMessage,
                text2: 'Please try again',
                visibilityTime: 5000,
            });
        },
    });

    // Check in user Status, is user logged in or not for today --------------->
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const statusURL = 'https://illimitable.in/app/mobile/user-status-check.json';
                const payload = {
                    userToken: token,
                };

                const res = await postData(statusURL, payload, logout);
                console.log('userStatus', res);
                if (!res.status) {
                    Toast.show({
                        type: 'error',
                        text1: `${res.msg}`,
                        visibilityTime: 4000,
                    });
                    navigation.replace('Login');
                    return;
                }

                if (!res?.doc?.attendence) {
                    Toast.show({
                        type: 'info',
                        text1: 'You are not logged in for today',
                        visibilityTime: 4000,
                    });

                    setCheckInTime(null);
                }

                // If logged in, then the local UI updated with the time
                if (res?.doc?.logInTime && !checkInTime) {
                    const logInTime = res?.doc?.logInTime;
                    const logInTimeMs = toMs(logInTime);
                    setCheckInTime({
                        showTime: formatTimestampTo12Hour(logInTimeMs),
                        exactTime: logInTimeMs,
                    });
                }

                // If logged out, then also the local UI updated with the time
                if (res?.doc?.logOutTime && !checkOutTime) {
                    const logOutTime = res?.doc?.logOutTime;
                    const logOutTimeMs = toMs(logOutTime);
                    setCheckOutTime({
                        showTime: formatTimestampTo12Hour(logOutTimeMs),
                        exactTime: logOutTimeMs,
                    });
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: `${'Error checking user status'}`,
                    visibilityTime: 3000,
                });
                console.error('Error checking user status:', error);
            }
        };

        checkUserStatus();
    }, [navigation, token, checkInTime, checkOutTime, logout, setCheckInTime, setCheckOutTime]);

    // LOCAL FUNCTION ---------------------------->
    const handleCheckButton = () => {
        if (totalTime) {
            Toast.show({
                type: 'warning',
                text1: 'You have already checked out for today',
                visibilityTime: 4000,
            });
            return;
        }

        mutation.mutate();
    };

    // CONFIRM WARNING ----------------------------------------------------------------------------------------------------
    const handleConfirm = () => {
        if (totalTime) {
            handleCheckButton();
            return;
        }

        Alert.alert(
            'Warning', // Title
            'Are you sure you want to check out for today?', // Message
            [
                {text: 'No', style: 'cancel'}, // Cancel button
                {
                    text: 'Yes',
                    onPress: () => {
                        handleCheckButton();
                    },
                },
            ],
        );
    };

    // const toggleModal = () => {
    //     setModalVisible(!isModalVisible);
    // };

    // SIDE EFFECTS --------------------------------->
    // For Clock Function
    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerId); // Cleanup interval on unmount
    }, []);

    // Calculate the workTime
    useEffect(() => {
        if (checkInTime && !totalTime) {
            const diffMs = Math.max(0, currentTime.getTime() - checkInTime.exactTime);

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setDiffTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        } else {
            setDiffTime(null);
        }
    }, [checkInTime, currentTime, totalTime]);

    // // Calculate total hrs
    useEffect(() => {
        if (checkInTime && checkOutTime) {
            const dTime = checkOutTime?.exactTime - checkInTime?.exactTime;

            const hours = Math.floor(dTime / (1000 * 60 * 60));
            const minutes = Math.floor((dTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((dTime % (1000 * 60)) / 1000);

            const showtime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            // console.log(showtime);

            setTotalTime({showTime: showtime, exactTime: new Date().getTime()});
            setDiffTime(null);
        }
    }, [checkInTime, checkOutTime, setTotalTime]);

    return (
        <View style={styles.container}>
            <Text style={styles.clockTime}>{totalTime ? totalTime.showTime : diffTime || formattedTime}</Text>
            <Text style={styles.date}>{formattedDate}</Text>

            <View style={styles.checkButtonContainer}>
                <CheckButton
                    onPress={userData?.loginExists || checkInTime ? handleConfirm : handleCheckButton}
                    title={totalTime ? 'Done' : userData?.loginExists || checkInTime ? 'Check Out' : 'Check In'}
                    isLoading={mutation.status === 'pending'}
                />

                <View style={styles.divider} />

                <View style={styles.recordContainer}>
                    <TimeRecord imgSrc={recordTimeIcons.clockIn} title="Check In" time={checkInTime} />
                    <TimeRecord imgSrc={recordTimeIcons.clockOut} title="Check Out" time={checkOutTime} />
                    <TimeRecord imgSrc={recordTimeIcons.check} title="Total Hrs" time={totalTime} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        borderRadius: wp(5),
        width: wp(85),
        alignSelf: 'center',
        paddingVertical: hp(2),
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.05)',
    },
    clockTime: {
        fontSize: wp(10),
        fontWeight: '600',
        color: Colors.BLACK,
        textAlign: 'center',
    },
    date: {
        fontSize: wp(4.2),
        fontWeight: '500',
        textAlign: 'center',
        color: Colors.GREY,
    },
    checkButtonContainer: {
        marginTop: hp(3),
    },
    divider: {
        borderWidth: 0.5,
        marginVertical: hp(3),
        borderColor: Colors.GREY,
        marginHorizontal: wp(10),
        borderStyle: 'dashed',
    },
    recordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});
