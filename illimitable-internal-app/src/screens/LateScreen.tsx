import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomTabHeader from '../components/CustomTabHeader';
import {useAuthStore} from '../store/authStore';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import {postData} from '../utils/apiHelper';
import MonthSwitch from '../components/MonthSwitch';
import AttendanceCard from '../components/cards/AttendanceCard';
import WeeklyOffCard from '../components/cards/WeeklyOffCard';
import {MONTHS} from '../constants/dayMonth';
import {useFocusEffect} from '@react-navigation/native';
import LateCard from '../components/cards/LateCard';
import BrokerButton from '../components/segmentControl/BrokerButton';
import HistoryScreen from './LateScreen/HistoryScreen';
import ApprovalsScreen from './LateScreen/ApprovalsScreen';
import {isTab} from '../utils/isTab';
import SegmentedControl from '../components/SegmentedControl';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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

export default function LateScreen() {
    const {bottom} = useSafeAreaInsets();

    // LOCAL STATES ------------------------------------->
    const [showmonth, setShowMonth] = useState(createDateState(new Date()));
    const [loading, setLoading] = useState(false);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [selectOption, setSelectOption] = useState(0);

    // SIDE EFFECTS -------------------------------------->
    useFocusEffect(
        useCallback(() => {
            setReloadToggle(!reloadToggle);
        }, []), // Runs every time `showmonth.exactDate` changes
    );

    // LOCAL FUNCTION --------------------------------------->
    function createDateState(date: Date) {
        return {
            showDate: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
            exactDate: date,
        };
    }

    const prevMonth = () => {
        const newDate = new Date(showmonth.exactDate);
        newDate.setMonth(newDate.getMonth() - 1); // Move to the previous month

        // fetchData(newDate);
        setShowMonth(createDateState(newDate));
    };

    const nextMonth = () => {
        const newDate = new Date(showmonth.exactDate);
        newDate.setMonth(newDate.getMonth() + 1); // Move to the previous month

        // fetchData(newDate);
        setShowMonth(createDateState(newDate));
    };

    const renderItem = ({item}: any) => {
        return (
            <>
                {/* Tabs Toggle */}
                <SegmentedControl options={option} selectOptions={selectOption} onOptionPress={setSelectOption} />

                <View style={{height: hp(2)}} />

                {/* History / Approvals */}
                <View>
                    {selectOption ? (
                        <ApprovalsScreen key="approvals" showmonthDependency={showmonth} />
                    ) : (
                        <HistoryScreen key="history" showmonthDependency={showmonth} />
                    )}
                </View>

                <View style={{height: hp(5)}} />
            </>
        );
    };

    return (
        <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
            <CustomTabHeader title="Late Arrivals" />
            <MonthSwitch showmonth={showmonth} prevMonth={prevMonth} nextMonth={nextMonth} />

            {loading ? (
                <ActivityIndicator size={50} color={Colors.LIGHT_BLUE} style={styles.loader} />
            ) : (
                <FlatList
                    data={[{key: 'static'}]} // FlatList requires data, so we pass a dummy static item
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ListFooterComponent={() => <View style={{height: hp(10) + bottom}} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
