import { BackHandler, Platform, RefreshControl, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DashboardHeader from '../components/AppHeaders/DashboardHeader';
import YourRecords from '../components/YourRecords';
import DoctorSpecialistSection from '../components/DoctorSpecialistSection';
import LabsAndMedicines from '../components/LabsAndMedicines';
import DashboardAdvertisement from '../components/DashboardAdvertisement';
import { useAuthStore } from '../store/authStore';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import AppointmentHistory from '../components/AppointmentHistory';
import TabBarParent from '../components/TabBarParent';
import TopRatedDoctors from '../components/TopRatedDoctors';
import AppFeatures from '../components/AppFeatures';
import PatientOpenionCard from '../components/PatientOpinionCard';
import BackgroundGradient from '../components/BackgroundGradient';
import Toast from 'react-native-simple-toast';
import { captureLocation } from '../utils/fetchCurrentLocation';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { queryClient } from '../../App';
import { LegendList } from '@legendapp/list';
import DashboardType from '../components/DashboardType';
import { useCurrentTabDashboard } from '../store/dashboardCurrentTab';
import PharmacyMedOrder from '../components/PharmacyMedOrder';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { isIos } from '../utils/platform';

const AnimatedLegendList = Animated.createAnimatedComponent(LegendList);

export default function DashboardScreen() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const { setCurrentLocation, setNearestLocation } = useCurrentLocationStore();
    const { selectedTab } = useCurrentTabDashboard();

    const [isLoading, setLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);

    const isHeaderVisible = useSharedValue(1); // 1 = visible, 0 = hidden
    const lastY = useSharedValue(0); // previous scroll offset

    const handleRefresh = async () => {
        setRefreshLoading(true);
        await queryClient.invalidateQueries({
            queryKey: [['todayappointmentData'], ['mostSearchedSpecialitywol'], ['mostSearchedSpeciality'], ['appointmentHistory']],
        });
        setRefreshLoading(false);
    };

    // Define sections as list items with types
    const fetchLocation = useCallback(async () => {
        try {
            setLoading(true);
            const { location } = await captureLocation();
            setCurrentLocation(location);

            if (!location?.latitude || !location?.longitude) {
                return;
            }

            const payload = {
                userLocation: {
                    coordinates: [Number(location.longitude), Number(location.latitude)],
                    type: 'Point',
                },
            };

            const url = `${BASE_URL}/hru/Patientappapi/nearestLocation`;
            const res = await postData(url, payload);

            if (!res?.status) {
                Toast.show(res?.msg || 'Location fetch failed', Toast.SHORT);
                return;
            }

            if (res?.doc) {
                setNearestLocation(res.doc);
            }

            setLoading(false);
        } catch (error) {
            console.error('Location fetch error:', error);
            Toast.show('Failed to fetch location', Toast.SHORT);
        }
    }, [setCurrentLocation, setNearestLocation]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const sections = [
        { type: 'DashboardHeader', key: 'header' },
        { type: 'DashboardType', key: 'displayType' },
        ...(selectedTab === 'doctor'
            ? [
                { type: 'DoctorSpecialistSection', key: 'specialists' },
                ...(isAuthenticated ? [{ type: 'AppointmentHistory', key: 'history' }] : []),
                { type: 'TopRatedDoctors', key: 'doctors' },
                ...(isAuthenticated ? [{ type: 'YourRecords', key: 'records' }] : []),
            ]
            : selectedTab === 'lab'
                ? [...(isAuthenticated ? [{ type: 'LabsAndMedicines', key: 'labs' }] : [])]
                : [{ type: 'pharmacyMedOrder', key: 'pharmacy' }]),

        { type: 'AppFeatures', key: 'features' },
        { type: 'PatientOpenionCard', key: 'opinion' },
        { type: 'DashboardAdvertisement', key: 'ad' },
    ];

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            // case 'DashboardHeader':
            //     return <DashboardHeader isLoading={isLoading} />;
            // case 'DashboardType':
            //     return <DashboardType />;
            case 'YourRecords':
                return <YourRecords />;
            case 'DoctorSpecialistSection':
                return <DoctorSpecialistSection isLoading={isLoading} />;
            case 'AppointmentHistory':
                return <AppointmentHistory />;
            case 'LabsAndMedicines':
                return <LabsAndMedicines />;
            case 'pharmacyMedOrder':
                return <PharmacyMedOrder />;
            case 'TopRatedDoctors':
                return <TopRatedDoctors />;
            case 'AppFeatures':
                return <AppFeatures />;
            case 'PatientOpenionCard':
                return <PatientOpenionCard />;
            case 'DashboardAdvertisement':
                return <DashboardAdvertisement />;
            default:
                return null;
        }
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            'worklet';
            const y = event.contentOffset.y;
            const delta = y - lastY.value;
            lastY.value = y;

            // Always show header when at the top (or very close)
            if (y <= 20) {
                if (isHeaderVisible.value !== 1) {
                    isHeaderVisible.value = withTiming(1, { duration: 400 });
                }
                return;
            }

            // Ignore tiny scrolls to avoid flickering
            if (Math.abs(delta) < 2) return;

            if (delta > 0 && isHeaderVisible.value === 1) {
                // Scrolling down → hide header
                isHeaderVisible.value = withTiming(0, { duration: 400 });
            } else if (delta < 0 && isHeaderVisible.value === 0) {
                // Scrolling up → show header
                isHeaderVisible.value = withTiming(1, { duration: 400 });
            }
        },
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(isHeaderVisible.value, [0, 1], [-headerHeight, 0], Extrapolation.CLAMP);
        const opacity = interpolate(isHeaderVisible.value, [0, 1], [0, 1], Extrapolation.CLAMP);
        const scale = interpolate(isHeaderVisible.value, [0, 1], [0.9, 1], Extrapolation.CLAMP);
        return {
            opacity,
            transform: [{ translateY }, { scale }],
        };
    }, [headerHeight]);

    // Animated style for the list wrapper (to adjust padding)
    const listWrapperAnimatedStyle = useAnimatedStyle(() => {
        const paddingTop = interpolate(isHeaderVisible.value, [0, 1], [0, headerHeight], Extrapolation.CLAMP);
        return {
            paddingTop,
        };
    }, [headerHeight]);

    const onFixedHeaderLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        if (height !== fixedHeaderHeight) setFixedHeaderHeight(height);
    };

    const onHeaderLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        if (height !== headerHeight) setHeaderHeight(height);
    };

    const lastBackPressed = useRef(0);
    useFocusEffect(
        useCallback(() => {
            // Only handle on Android (iOS doesn't have hardware back button)
            if (Platform.OS !== 'android') return;

            const onBackPress = () => {
                const now = Date.now();
                const DOUBLE_PRESS_DELAY = 1000; // 1 second

                if (now - lastBackPressed.current < DOUBLE_PRESS_DELAY) {
                    console.log('DOUBLE_PRESS_DELAY', DOUBLE_PRESS_DELAY);

                    console.log('now - lastBackPressed.current', now - lastBackPressed.current);
                    BackHandler.exitApp();
                    return true;
                } else {
                    lastBackPressed.current = now;
                    ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
                    return true;
                }
            };
            // ✅ ADD EVENT LISTENER - This was commented out!
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // ✅ RETURN CLEANUP FUNCTION
            return () => {
                subscription.remove();
            };
        }, []),
    );

    return (
        <TabBarParent>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <BackgroundGradient customStyle={styles.container}>
                    <View style={styles.header} onLayout={onFixedHeaderLayout}>
                        <DashboardHeader isLoading={isLoading} />
                    </View>
                    <Animated.View
                        style={[styles.dashboardHeaderContainer, headerAnimatedStyle, { top: fixedHeaderHeight }]}
                        onLayout={onHeaderLayout}
                    >
                        <DashboardType />
                    </Animated.View>
                    <Animated.View style={[ isIos() ? listWrapperAnimatedStyle : "", { flex: 1 }]}>
                        <AnimatedLegendList
                            data={sections}
                            renderItem={renderItem}
                            keyExtractor={(item: any) => item.key}
                            onScroll={scrollHandler}
                            scrollEventThrottle={16}
                            contentContainerStyle={[styles.contentContainer, isIos() ? "" : {paddingTop: headerHeight}]}
                            refreshControl={<RefreshControl refreshing={refreshLoading} onRefresh={handleRefresh} />}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={0.9}
                            recycleItems
                        />
                    </Animated.View>
                </BackgroundGradient>
            </SafeAreaView>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgb(121, 190, 187)',
        // backgroundColor: 'red',
    },
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
    header: {
        paddingHorizontal: wp(3),
        paddingBottom: hp(0.5),
        position: 'relative',
        zIndex: 10,
        experimental_backgroundImage: isIos() ? "" :'linear-gradient(to left, rgb(228, 246, 245), rgb(243, 249, 249))',
    },
    dashboardHeaderContainer: {
        paddingHorizontal: wp(3),
        paddingBottom: hp(0.5),
        position: 'absolute',
        // top: hp(10),
        left: 0,
        right: 0,
        zIndex: 1, // Ensure it stays above the list
        // backgroundColor: 'rgb(121, 190, 187)',
        experimental_backgroundImage: isIos() ? "" :'linear-gradient(to left, rgb(228, 246, 245), rgb(243, 249, 249))',
    },
    contentContainer: {
        paddingHorizontal: wp(3),
        paddingBottom: hp(2), // Add padding to avoid overlap with OfflineRibbon
    },
});
