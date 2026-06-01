import {Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ProfileImage from '../components/ProfileImage';
import ClockCard from '../components/cards/ClockCard';
import LinearGradient from 'react-native-linear-gradient';
import AttendanceStatusCard from '../components/cards/AttendanceStatusCard';
import {useDashboard} from '../hooks/useDashboard';
import {SkaletonView} from 'react-native-skaleton-kit';
import {useNavigation} from '../hooks/useNavigation';
import EventCard from '../components/cards/EventCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BigButton from '../components/buttons/BigButton';
import {useAuthStore} from '../store/authStore';
import {GujuIcon} from '../components/GujuIcon';

const ANDROID_RIPPLE = {color: 'rgba(0, 0, 0, 0.3)', radius: wp(4), borderless: true, foreground: true};

export default function DashboardScreen() {
    const navigation = useNavigation();
    const {isLoading, attendanceSummary, data, eventLoading, isCurrentMonth, leftIconPress, rightIconPress, monthYear, gujuMode, setGujuMode} =
        useDashboard();
    const {bottom} = useSafeAreaInsets();
    const bottomPadding = {paddingBottom: bottom + hp(10)};
    const {logout} = useAuthStore();

    const variableOpacity = isCurrentMonth ? 0.3 : 1;

    const onPress = () => {
        logout();
        navigation.replace('Login');
    };

    return (
        <>
            <View style={{height: StatusBar.currentHeight, backgroundColor: Colors.PRIMARY}} />
            <ScrollView contentContainerStyle={[styles.contentContainerStyle, bottomPadding]} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={[Colors.PRIMARY, Colors.PRIMARY, Colors.WHITE]} style={styles.headerContainer}>
                    <ProfileImage setGujuMode={setGujuMode} />
                    {gujuMode && <GujuIcon />}
                </LinearGradient>

                <View style={{marginTop: hp(-13)}}>
                    <ClockCard gujuMode={gujuMode} />
                </View>

                {/* This month attendance summary */}
                <View style={styles.attendanceContainer}>
                    <View style={styles.attendanceHeader}>
                        <View>
                            <Text style={styles.headerText}>Attendance</Text>
                            <Text style={styles.headerDesc}>{monthYear}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.arrowContainer} android_ripple={ANDROID_RIPPLE} onPress={leftIconPress}>
                                <Image source={require('../assets/icons/left-arrow.png')} style={styles.img} />
                            </Pressable>
                            <Pressable
                                style={[styles.arrowContainer, {opacity: variableOpacity}]}
                                disabled={isCurrentMonth}
                                onPress={rightIconPress}
                                android_ripple={ANDROID_RIPPLE}>
                                <Image source={require('../assets/icons/right-arrow.png')} style={styles.img} />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.attendanceCardContainer}>
                        {isLoading ? (
                            <>
                                <SkaletonView viewHeight={hp(9)} viewWidth={wp(39)} style={styles.skeletonAttendanceCard} />
                                <SkaletonView viewHeight={hp(9)} viewWidth={wp(39)} style={styles.skeletonAttendanceCard} />
                            </>
                        ) : (
                            <>
                                <AttendanceStatusCard data={attendanceSummary.noIssue} title="No Issue" />
                                <AttendanceStatusCard data={attendanceSummary.absents} title="Absents" />
                            </>
                        )}
                    </View>
                    <View style={styles.attendanceCardContainer}>
                        {isLoading ? (
                            <>
                                <SkaletonView viewHeight={hp(9)} viewWidth={wp(39)} style={styles.skeletonAttendanceCard} />
                                <SkaletonView viewHeight={hp(9)} viewWidth={wp(39)} style={styles.skeletonAttendanceCard} />
                            </>
                        ) : (
                            <>
                                <AttendanceStatusCard data={attendanceSummary.lateIn} title="Late In" />
                                <AttendanceStatusCard data={attendanceSummary.totalLeaves} title="Total Leaves" />
                            </>
                        )}
                    </View>
                </View>

                {/* Today's Events */}
                {data?.length > 0 && (
                    <View style={styles.attendanceContainer}>
                        <View style={styles.eventHeader}>
                            <Text style={styles.headerText}>Today's Events</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Announcement')}>
                                <Text style={{fontSize: wp(3.5), color: Colors.PRIMARY}}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {eventLoading ? (
                            <SkaletonView viewHeight={hp(10)} viewWidth={'auto'} style={styles.skeletonEventCard} />
                        ) : (
                            <View style={{marginVertical: hp(3)}}>
                                {data?.map((d: {date: string; name: string; holiday: boolean}, index: number) => (
                                    <EventCard key={index} event={d} />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <BigButton title="Log Out" onPress={onPress} />
            </ScrollView>

            {/* Birthday Cheer Modal */}
            {/* <Modal visible={isCheering} transparent>
                <BirthdayCheer ref={cheerRef} name={data?.doc?.events[0]?.name} />
            </Modal> */}
        </>
    );
}

const styles = StyleSheet.create({
    contentContainerStyle: {flexGrow: 1, backgroundColor: Colors.WHITE},
    headerContainer: {
        height: hp(25),
    },
    attendanceContainer: {
        marginHorizontal: wp(9),
        marginTop: hp(4),
    },
    attendanceHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(4)},
    buttonContainer: {flexDirection: 'row', gap: 15, alignItems: 'center'},
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    eventHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    headerText: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    headerDesc: {
        fontSize: wp(3.5),
        color: Colors.GREY,
    },
    attendanceCardContainer: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2)},
    skeletonAttendanceCard: {
        borderRadius: 10,
    },
    skeletonEventCard: {borderRadius: 10, marginVertical: hp(3)},
    img: {height: wp(4), width: wp(4), tintColor: Colors.LIGHT_BLUE},
});
