import {useQueries} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {postData} from '../utils/apiHelper';
import {useEffect, useMemo, useRef, useState} from 'react';
import {BirthdayCheerRef} from '../components/BirthdayCheer';
import {todayOrNot} from '../utils/timeFunctions';
import dayjs from 'dayjs';
import {trigger} from 'react-native-haptic-feedback';

// const isTodayFromString = (dateStr: string): boolean => {
//     const cleaned = dateStr.replace(/(st|nd|rd|th)/, '');
//     const parsed = dayjs(cleaned, 'ddd, MMM D YYYY');
//     return parsed.isSame(dayjs(), 'day');
// };

export const useDashboard = () => {
    const {token, deviceId, userData} = useAuthStore();
    const cheerRef = useRef<BirthdayCheerRef>(null);

    const [isCheering, setIsCheering] = useState(false);
    const [showMonth, setShowMonth] = useState(new Date());
    const [monthYear, setMonthYear] = useState(dayjs(new Date()).format('MMMM YYYY'));
    const [gujuMode, setGujuMode] = useState(false);

    const isCurrentMonth = showMonth.getMonth() === new Date().getMonth();

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
        const res = await postData(url, payload);
        console.log('res', res);
        return res.docs ?? [];
    };

    async function fetchData() {
        try {
            const initialPostData = {
                token: token,
                deviceId: deviceId,
            };
            console.log(initialPostData);

            const url = 'https://illimitable.in/app/mobile/events-plus.json';
            const res = await postData(url, initialPostData);
            console.log(res.doc);

            const todayEvents = res.doc?.events?.filter((event: {date: string; name: string; holiday: boolean}) => todayOrNot(event));
            // console.log('todayEvents', todayEvents);

            return todayEvents ?? [];
        } catch (error) {
            console.log(error);
        }
    }

    const [{isLoading: eventLoading, data}, {data: attendanceData = [], isLoading}] = useQueries({
        queries: [
            {
                queryKey: ['today-events'],
                queryFn: fetchData,
            },
            {
                queryKey: ['my-attendance-today', showMonth],
                queryFn: () => fetchAttendance(showMonth),
                enabled: Boolean(token && deviceId),
                staleTime: 0,
            },
        ],
    });

    // FORMATTING ATTENDANCE DATA ----------------------------->
    const attendanceSummary = useMemo(() => {
        let totalLeaves = 0,
            lateIn = 0,
            absents = 0,
            noIssue = 0;

        for (let i = 0; i < attendanceData.length; i++) {
            if (attendanceData[i].type === 'LEAVE') {
                totalLeaves += 1;
            } else if (attendanceData[i].hasIssue && attendanceData[i]?.in?.lateArrival) {
                lateIn += 1;
            } else if (attendanceData[i].type === 'ABSENT') {
                absents += 1;
            } else if (attendanceData[i].type !== 'WEEKLY OFF') {
                noIssue += 1;
            }
        }

        return {
            totalLeaves,
            lateIn,
            absents,
            noIssue,
        };
    }, [attendanceData]);

    const leftIconPress = () => {
        const prevMonth = new Date(showMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setShowMonth(prevMonth);
        trigger('impactLight');
    };

    const rightIconPress = () => {
        const nextMonth = new Date(showMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setShowMonth(nextMonth);
        trigger('impactLight');
    };

    useEffect(() => {
        setMonthYear(dayjs(showMonth).format('MMMM, YYYY'));
    }, [showMonth]);

    // BIRTHDAY CELEBRATION ------------------------->
    useEffect(() => {
        const evt = data?.doc?.events?.[0];
        if (!evt) {
            return;
        }

        // 1. does the name contain “birthday” (case-insensitive)?
        const isBirthday = /birthday/i.test(evt.name);

        // 2. is the date today?
        const isToday = todayOrNot(evt);

        // console.log('isBirthday', isBirthday);
        // console.log('isToday', isToday, cleanDateStr);

        const userName = evt.name.replace(/'s?\s*Birthday$/i, '');
        console.log(userData.name, userName);

        if (isBirthday && isToday && userName === userData?.name) {
            cheerRef.current?.show();
            setIsCheering(true);
            const t = setTimeout(() => setIsCheering(false), 5000);
            return () => clearTimeout(t);
        }
    }, [data, userData?.name]);

    return {
        isLoading,
        attendanceSummary,
        eventLoading,
        data,
        cheerRef,
        isCheering,
        setIsCheering,
        isCurrentMonth,
        setShowMonth,
        showMonth,
        monthYear,
        leftIconPress,
        rightIconPress,
        gujuMode,
        setGujuMode,
    };
};
