import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {shortDayName} from '../constants/dayMonth';
import {useAuthStore} from '../store/authStore';
import {postData} from '../api';
import Toast from 'react-native-simple-toast';
import {useQuery} from '@tanstack/react-query';
import AlarmComponent from './AlarmComponent';
import {medsIntakeStorage} from '../utils/MMKVStorage';
import {isTab} from '../utils/isTab';

export interface CalendarDateType {
    date: string;
    isSelected: boolean;
    isCurrentMonth: boolean;
    isToday: boolean;
    startTime: number | null;
    endTime: number | null;
}

interface Props {
    setSelectedDate: React.Dispatch<React.SetStateAction<CalendarDateType | undefined>>;
    url: string;
    type?: 'Intake' | 'Refill';
}

export default function CustomCalendar({setSelectedDate, url, type}: Props) {
    // GLOBAL STATES --------------------------------->
    const {token, userData} = useAuthStore();

    // LOCAL STATES ----------------------------->
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [monthDates, setMonthDates] = useState<CalendarDateType[]>([]);
    // const [medsPresent, setMedsPresent] = useState<Record<string, boolean>>({});

    //Data fetching ----------------------------->
    const {
        isPending,
        error,
        data: medsPresent,
        refetch,
    } = useQuery({
        queryKey: ['medsPresent' + type], // Unique query key with dynamic dependencies
        queryFn: async () => {
            const {startTime, endTime} = getMonthRange(currentYear, currentMonth);

            const payload = {
                token: token,
                start: Number(startTime),
                end: Number(endTime),
            };

            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT); // Show toast on error
                throw new Error(res.msg); // Throw error for React Query to catch
            }

            let medicineDates: Record<string, boolean> = {};
            let alarmRecords: any = {};
            const medsData = type === 'Intake' ? res?.date_wise_medicine : res.docs;

            medsData.forEach((i: any) => {
                if (i._id >= startTime && i._id <= endTime) {
                    medicineDates[new Date(i._id).getDate() as number] = true;

                    const dateTimestamp = i._id; // Given date timestamp
                    const records = i.records; // Array of records

                    const alarmRecordsTime = records.map((record: any) => {
                        const reminderTime = new Date(remainderTime(record)).getTime(); // Convert reminder time to ms
                        const finalReminderTime = dateTimestamp + reminderTime; // Sum both values
                        return {finalReminderTime, ...record};
                    });

                    alarmRecords[new Date(i._id).getDate() as number] = alarmRecordsTime;
                }
            });

            console.log({medsData, alarmRecords});

            return {medicineDates, alarmRecords}; // Return processed data
        },
    });

    useEffect(() => {
        setMonthDates(getMonthDates(currentYear, currentMonth));
        refetch();
    }, [currentYear, currentMonth]);

    function getMonthDates(year: number, month: number) {
        const dates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const currMonth = new Date().getMonth();
        const today = new Date().getDate();

        const obj = {
            date: '',
            isSelected: false,
            isCurrentMonth: false,
            isToday: false,
            startTime: null,
            endTime: null,
        };

        // Add empty slots for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            dates.push({...obj});
        }

        // Add actual dates
        for (let i = 1; i <= daysInMonth; i++) {
            const startTime = new Date(year, month, i, 0, 0, 0, 0).getTime(); // Midnight
            const endTime = new Date(year, month, i, 23, 59, 59, 999).getTime(); // End of the day

            dates.push({
                ...obj,
                date: i.toString(),
                isToday: currMonth === month && i === today,
                isCurrentMonth: currMonth === month,
                isSelected: currMonth === month && i === today,
                startTime: startTime,
                endTime: endTime,
            });

            if (currMonth === month && i === today) {
                setSelectedDate({
                    ...obj,
                    date: i.toString(),
                    isToday: currMonth === month && i === today,
                    isCurrentMonth: currMonth === month,
                    isSelected: true,
                    startTime: startTime,
                    endTime: endTime,
                });
            }
        }

        if (dates.length < 42) {
            // Add empty slots for days after the last day of the month
            const daysToAdd = dates.length > 35 ? 42 - dates.length : 35 - dates.length;

            for (let i = 0; i < daysToAdd; i++) {
                dates.push({...obj});
            }
        }

        return dates;
    }

    function increaseMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    function decreaseMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    function getSelectedDates(item: CalendarDateType) {
        // console.log(item);
        setSelectedDate(item);
        const updatedMonth = monthDates.map(i => {
            return {
                ...i,
                isSelected: i.date === item.date ? true : false,
            };
        });

        setMonthDates(updatedMonth);
    }

    // Function to calculate the first and last day of the month in ms
    function getMonthRange(year: number, month: number) {
        const startTime = new Date(year, month, 1, 0, 0, 0, 0).getTime();
        const endTime = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
        return {startTime, endTime};
    }

    function remainderTime(item: any) {
        const storageKey = `user_${userData?.hruId}_medicine_${item._id}_time_${item.remainderTime}`;
        const storedTime = medsIntakeStorage.getString(storageKey);
        return storedTime ? storedTime : item?.remainderTime;
    }

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity style={styles.prevNextButton} onPress={decreaseMonth}>
                    <FontAwesome5Icon name="chevron-left" size={isTab ? wp(2.5) : wp(5)} color={colors.darkBlue} />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {new Date(currentYear, currentMonth).toLocaleString('default', {month: 'short'})} {currentYear}
                </Text>
                <TouchableOpacity style={styles.prevNextButton} onPress={increaseMonth}>
                    <FontAwesome5Icon name="chevron-right" size={isTab ? wp(2.5) : wp(5)} color={colors.darkBlue} />
                </TouchableOpacity>
            </View>
            <View style={styles.daysRow}>
                {shortDayName.map((item, index) => (
                    <Text key={index} style={styles.dayHeader}>
                        {item}
                    </Text>
                ))}
            </View>
            <View style={styles.calendarContainer}>
                {monthDates.map((item, index) => (
                    <View key={index} style={styles.calendarBlock}>
                        <TouchableOpacity
                            onPress={() => getSelectedDates(item)}
                            style={[
                                styles.dateStyle,
                                {
                                    borderWidth: item.isToday ? (isTab ? wp(0.2) : wp(0.5)) : 0,
                                    backgroundColor: item.isSelected ? colors.primary : colors.white,
                                },
                            ]}>
                            <Text
                                style={[
                                    styles.dayText,
                                    {
                                        color: item.isSelected ? colors.white : colors.black,
                                    },
                                ]}>
                                {item.date}
                            </Text>
                            {medsPresent?.medicineDates?.[item.date] && (
                                <View
                                    style={{
                                        width: isTab ? wp(0.5) : wp(1),
                                        height: isTab ? wp(0.5) : wp(1),
                                        borderRadius: wp(2),
                                        backgroundColor: item.isSelected ? colors.white : colors.primary,
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Call the reminder component */}
            {medsPresent?.alarmRecords && <AlarmComponent timings={medsPresent?.alarmRecords} type={type} />}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: hp(2),
        paddingHorizontal: wp(5),
    },
    prevNextButton: {
        height: isTab ? wp(5) : wp(8),
        width: isTab ? wp(5) : wp(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        color: colors.lightBlack,
    },
    daysRow: {
        flexDirection: 'row',
    },
    dayHeader: {
        width: wp(93 / 7),
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.darkGrey,
        fontSize: isTab ? wp(1.8) : wp(3.5),
    },
    calendarContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    calendarBlock: {
        height: isTab ? hp(4) : hp(4.5),
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(93 / 7),
        // backgroundColor: 'red',
    },
    dateStyle: {
        height: isTab ? wp(5) : wp(9),
        width: isTab ? wp(5) : wp(9),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.primary,
    },
    dayText: {
        color: colors.black,
        fontSize: isTab ? wp(2.2) : wp(3.5),
        fontWeight: 'bold',
    },
});
