import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import CustomTabHeader from '../components/CustomTabHeader';
import {useAuthStore} from '../store/authStore';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import {postData} from '../utils/apiHelper';
import MonthSwitch from '../components/MonthSwitch';
import AttendanceCard from '../components/cards/AttendanceCard';
import WeeklyOffCard from '../components/cards/WeeklyOffCard';
import {MONTHS} from '../constants/dayMonth';
import {useQuery} from '@tanstack/react-query';
import {useRefetchOnFocus} from '../hooks/useRefetchOnWindowFocus';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ListFooterComponent = () => {
    const {bottom} = useSafeAreaInsets();
    return <View style={{height: hp(10) + bottom}} />;
};

export default function MyAttendanceScreen() {
    // GLOBAL STATES ------------------------------------>
    const {deviceId, token, logout} = useAuthStore();

    // LOCAL STATES ------------------------------------->
    const [showMonth, setShowMonth] = useState(createDateState(new Date()));

    // LOCAL FUNCTION --------------------------------------->
    function createDateState(date: Date) {
        return {
            showDate: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
            exactDate: date,
        };
    }

    const fetchAttendance = async (date: Date) => {
        const startDate = new Date(date);
        startDate.setDate(1);

        const endDate = new Date(date);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);

        const payload = {
            token,
            deviceId,
            env: 'Development',
            dateFrom: startDate.getTime(),
            dateTo: endDate.getTime(),
        };

        const url = 'https://illimitable.in/app/mobile/my-attendance.json';
        const res = await postData(url, payload, logout);
        return res.docs ?? [];
    };

    // API CALLS -------------------------------------------->
    const {data: attendanceData = [], isLoading} = useQuery({
        queryKey: ['my-attendance', showMonth.exactDate.getTime()],
        queryFn: () => fetchAttendance(showMonth.exactDate),
        enabled: Boolean(token && deviceId),
        staleTime: 1000 * 60 * 5, // 5 min
    });

    const prevMonth = () => {
        const newDate = new Date(showMonth.exactDate);
        newDate.setMonth(newDate.getMonth() - 1); // Move to the previous month
        setShowMonth(createDateState(newDate));
    };

    const nextMonth = () => {
        const newDate = new Date(showMonth.exactDate);
        newDate.setMonth(newDate.getMonth() + 1); // Move to the previous month
        setShowMonth(createDateState(newDate));
    };

    const renderItem = ({item}: any) => {
        if (item.type === 'WEEKLY OFF') {
            return <WeeklyOffCard item={item} />;
        }
        return <AttendanceCard item={item} />;
    };

    // Triggers refetch every time the screen is focused
    useRefetchOnFocus(['my-attendance']);

    return (
        <View style={styles.container}>
            <CustomTabHeader title="My Attendances" />
            <MonthSwitch showmonth={showMonth} prevMonth={prevMonth} nextMonth={nextMonth} />

            {isLoading ? (
                <ActivityIndicator size={50} color={Colors.LIGHT_BLUE} style={styles.loader} />
            ) : (
                <FlatList
                    data={attendanceData}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    keyExtractor={item => item?.dt}
                    ListFooterComponent={ListFooterComponent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.WHITE},
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flexGrow: 1,
        paddingHorizontal: wp(3),
        paddingTop: hp(1),
    },
});
