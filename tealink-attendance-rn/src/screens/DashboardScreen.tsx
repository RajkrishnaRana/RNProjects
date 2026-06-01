import { ScrollView, StatusBar, StyleSheet, Text, Pressable, View } from 'react-native';
import React from 'react';
import useDashboard from '../hooks/screenHooks/useDashboard';
import { colors } from '../common/colors';
import { hp, wp } from '../utils/dimesion';
import { Lucide } from '@react-native-vector-icons/lucide';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '../hooks/useNavigation';
import GreenGradientBackground from '../components/Backgrounds/GreenGradientBackground';
import TodaysRecordSection from '../components/Sections/TodaysRecordSection';
import { android_ripple_value, screenOptions } from '../constants/screenOptions';
import ScreenOptionsCard from '../components/Cards/ScreenOptionsCard';
import useNfc from '../hooks/useNfc';
import { useAppSelector } from '../hooks/typedReduxHooks';
import Animated from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialDesignIcons);

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { showMarkOut, lastSyncTime } = useAppSelector(state => state.auth);
    const { syncPercentage } = useAppSelector(state => state.sync);
    const { updateLastSyncedDate, animatedIconStyle, handleLongSyncBarPress } = useDashboard();

    // For NFC operations througout the app
    useNfc();

    return (
        <>
            <GreenGradientBackground>
                <View style={styles.statusBarOverlay} />
                <StatusBar animated={true} backgroundColor="transparent" translucent={true} hidden={false} barStyle="light-content" />

                {/* Drawer Menu and Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.nameAndMenuContainer}>
                        <Pressable style={styles.menuIconContainer} onPress={() => navigation.openDrawer()} android_ripple={android_ripple_value}>
                            <Lucide name="menu" size={18} color={colors.white} />
                        </Pressable>
                        <View style={styles.headingTextContainer}>
                            <Text style={styles.headerText}>TEAlink Dashboard</Text>
                            <Text style={styles.subHeaderText}>Garden Management System</Text>
                        </View>
                    </View>

                    <Pressable style={styles.menuIconContainer} onPress={() => navigation.push('Settings')} android_ripple={android_ripple_value}>
                        <Lucide name="settings" size={17} color={colors.white} />
                    </Pressable>
                </View>

                <Pressable
                    style={[styles.menuIconContainer, styles.syncBar]}
                    onPress={updateLastSyncedDate}
                    onLongPress={handleLongSyncBarPress}
                    android_ripple={android_ripple_value}
                >
                    <View style={styles.syncBarLeft}>
                        <AnimatedIcon name="sync" size={20} color={colors.white} style={animatedIconStyle} />
                        <Text style={styles.syncText}>Last synced : {lastSyncTime || '-- -- --'}</Text>
                    </View>
                    <Text style={styles.syncPercentageText}>{syncPercentage} % </Text>
                </Pressable>
            </GreenGradientBackground>

            {/* Today's Record Section */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TodaysRecordSection />

                {/* Screen Options */}
                {screenOptions.map((option, index) => {
                    if (!showMarkOut && option.name === 'Mark Out Time') {
                        return null;
                    }

                    return <ScreenOptionsCard key={index} option={option} />;
                })}
            </ScrollView>

            {/* <Image
                source={{ uri: 'file:///data/user/0/in.tealink.garden/files/firstImg_1772437715706.jpg' }}
                style={{ height: 200, width: 200 }}
            /> */}
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        margin: 5,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    image: {
        width: 200,
        height: 200,
    },
    statusBarOverlay: { height: StatusBar.currentHeight ?? hp(5), backgroundColor: 'rgba(0,0,0,0.2)' },
    headerContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        alignItems: 'center',
    },
    nameAndMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuIconContainer: {
        padding: 6,
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 9,
    },
    headingTextContainer: { gap: 1 },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    subHeaderText: {
        fontSize: 10,
        color: colors.white,
    },
    syncBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between',
        marginHorizontal: wp(3.5),
        marginTop: 15,
        marginBottom: 20,
        padding: 8,
    },
    syncBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    syncText: {
        fontSize: 11,
        color: colors.white,
    },
    syncPercentageText: {
        fontSize: 11,
        color: colors.white,
        fontWeight: '700',
    },
    scrollContainer: { flexGrow: 1 },
});
