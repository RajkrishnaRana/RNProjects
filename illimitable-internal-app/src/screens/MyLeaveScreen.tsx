import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, RefreshControl} from 'react-native';
import CustomTabHeader from '../components/CustomTabHeader';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import HistoryScreen from './LeaveScreen/HistoryScreen';
import ApprovalsScreen from './LeaveScreen/ApprovalsScreen';
import {useAuthStore} from '../store/authStore';
import {postData} from '../utils/apiHelper';
import {CircularProgress, SmallCircularProgress} from '../components/CircleComponents';
import SegmentedControl from '../components/SegmentedControl';
import {useNavigation} from '../hooks/useNavigation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import Animated, {useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BUTTON_HEIGHT = 56; // your FAB size

const ListFooterComponent = () => {
    const {bottom} = useSafeAreaInsets();
    return <View style={{height: hp(2) + bottom}} />;
};

const option = [
    {
        name: 'History',
        index: 0,
    },
    {
        name: 'Approvals',
        index: 1,
    },
];

const MyLeaveScreen = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const {bottom} = useSafeAreaInsets();

    // ZUSTAND STATES --------------------------------------------->
    const {token, deviceId, logout} = useAuthStore();

    // LOADING STATES ---------------------------------------------->
    const [refreshing, setRefreshing] = useState(false);
    const [selectOption, setSelectOption] = useState(0);

    // FETCH API HANDLING ------------------------------->
    const fetchData = async () => {
        const initialPostData = {
            token: token,
            deviceId: deviceId,
        };

        const url = 'https://illimitable.in/app/mobile/my-leave-balance.json';
        const res = await postData(url, initialPostData, logout);

        return res?.doc;
    };

    const {data} = useQuery({
        queryKey: ['myLeaveBalance'],
        queryFn: fetchData,
        staleTime: 0,
    });

    // <-----------------------PULL DOWN TO REFRESH----------------------------->
    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            queryClient.refetchQueries({queryKey: ['myLeaveBalance']}),
            queryClient.refetchQueries({queryKey: ['leaveHistory']}),
            queryClient.refetchQueries({queryKey: ['leaveApprovals']}),
        ]);
        setRefreshing(false);
    };

    // ----- derived numbers (0 while loading) -----
    const totalLeaves = data?.totalLeaves ?? 0;
    const usedLeaves = data?.usedLeaves ?? 0;
    const totalLeft = totalLeaves - usedLeaves;
    const totalPct = totalLeaves === 0 ? 0 : (totalLeft / totalLeaves) * 100;

    const renderItem = () => (
        <>
            {/* 3 Circles view */}
            <View style={styles.mainCircleContainer}>
                {/* Casual Leaves */}
                <SmallCircularProgress
                    size={wp(15)}
                    maxCount={data?.leaveTypes[0]?.maxCount ?? 0}
                    days={data?.leaveTypes[0]?.days ?? 0}
                    color={data?.leaveTypes[0]?.name === 'Casual Leave' ? '#06D6A0' : '#FF9F1C'}
                    title={data?.leaveTypes[0]?.name ?? 'Casual Leave'}
                />

                {/* Leave Balance */}
                <CircularProgress
                    size={wp(46)}
                    strokeWidth={16}
                    percentage={totalPct}
                    color="#C183E3"
                    textValue={Number(totalLeaves)} // Send the max Value for the animation calculation
                    leaveBalanceOrNot
                    customTextStyle={styles.balanceNumber}
                    left={Number(totalLeft)}
                />

                {/* Sick Leaves */}
                <SmallCircularProgress
                    size={wp(15)}
                    maxCount={data?.leaveTypes[1]?.maxCount ?? 0}
                    days={data?.leaveTypes[1]?.days ?? 0}
                    color={data?.leaveTypes[1]?.name === 'Casual Leave' ? '#06D6A0' : '#FF9F1C'}
                    title={data?.leaveTypes[1]?.name ?? 'Sick Leave'}
                />
            </View>

            {/* Leave Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <View style={styles.statLabelContainer}>
                        {/* <View style={styles.statDot} /> */}
                        <Text style={styles.statLabel}>Total Leave</Text>
                    </View>
                    <Text style={styles.statValue}>{data?.totalLeaves}</Text>
                </View>
                <View style={styles.statItem}>
                    <View style={styles.statLabelContainer}>
                        <Text style={styles.statLabel}>Used Leave</Text>
                    </View>
                    <Text style={styles.statValue}>{data?.usedLeaves}</Text>
                </View>
            </View>

            {/* Tabs Toggle */}
            <SegmentedControl options={option} selectOptions={selectOption} onOptionPress={setSelectOption} />

            {/* History / Approvals */}
            <View style={{marginTop: hp(2)}}>{selectOption ? <ApprovalsScreen key="approvals" /> : <HistoryScreen key="history" />}</View>

            <View style={{height: hp(5)}} />
        </>
    );

    // Animated Event for plus button
    const lastY = useSharedValue(0);
    const btnScale = useSharedValue(1); // 1 = visible, 0 = hidden

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            'worklet';
            const y = e.contentOffset.y;
            const delta = y - lastY.value;
            lastY.value = y;

            /* 1.  Always show when we are very close to the top */
            if (y < 10) {
                btnScale.value = withSpring(1, {stiffness: 300, damping: 15});
                return;
            }

            /* 2.  Ignore tiny shakes while settling */
            if (Math.abs(delta) < 4) {
                return;
            }

            /* 3.  Normal up / down logic */
            if (delta > 4) {
                btnScale.value = withSpring(0, {stiffness: 300, damping: 15});
            } else if (delta < -4) {
                btnScale.value = withSpring(1, {stiffness: 300, damping: 15});
            }
        },
    });

    const fabStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: btnScale.value},
            {translateY: (1 - btnScale.value) * BUTTON_HEIGHT}, // slide away while shrinking
        ],
    }));

    return (
        <View style={styles.container}>
            <CustomTabHeader title="My Leave" />

            <Animated.FlatList
                data={[{key: 'static'}]} // FlatList requires data, so we pass a dummy static item
                renderItem={renderItem}
                keyExtractor={item => item.key}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                stickyHeaderIndices={[2]} // Keep the tabsContainer sticky
                contentContainerStyle={[styles.scrollViewStyle]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={ListFooterComponent}
            />

            {/* Floating Action Button with Animated Opacity */}
            <Animated.View style={[styles.fab, fabStyle, {top: hp(82) - bottom}]}>
                <TouchableOpacity style={styles.fabButton} onPress={() => navigation.push('ApplyForLeave')} activeOpacity={0.7}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    loader: {marginTop: hp(5)},
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewStyle: {
        flexGrow: 1,
        paddingHorizontal: wp(5),
        // paddingBottom: hp(4),
        // backgroundColor: 'yellow',
    },
    mainCircleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginVertical: hp(1.5),
    },
    balanceNumber: {
        fontSize: wp(10),
        fontWeight: 'bold',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: hp(1),
    },
    statItem: {
        alignItems: 'center',
    },
    statLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: Colors.GREY,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    fab: {
        position: 'absolute',
        width: wp(16),
        height: wp(16),
        alignItems: 'center',
        justifyContent: 'center',
        right: wp(6),
        backgroundColor: Colors.LIGHT_BLUE,
        borderRadius: wp(10),
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    },
    fabIcon: {
        fontSize: wp(8),
        color: 'white',
    },
    fabButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyLeaveScreen;
