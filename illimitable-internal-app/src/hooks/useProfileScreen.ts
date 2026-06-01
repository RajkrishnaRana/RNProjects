import {useQueries, useQueryClient} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {postData} from '../utils/apiHelper';
import {useCallback, useMemo, useState} from 'react';
import Toast from 'react-native-toast-message';
import {trigger} from 'react-native-haptic-feedback';

type LeaveType = 'Sick Leave' | 'Casual Leave';
interface EmployeeType {
    _id: string;
    firstName: string;
    isActive: boolean;
    lastName: string;
    name: string;
}

export const useProfileScreen = () => {
    const queryClient = useQueryClient();
    const {token, deviceId, logout, name} = useAuthStore();

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
    const [count, setCount] = useState(1);
    const [transferLoading, setTransferLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // LEAVE HISTORY API HANDLING FOR SUPERVISOR -------------------------------
    const fetchQuery = useCallback(async () => {
        const url = 'https://illimitable.in/app/mobile/my-leave-history.json';
        const initialPostData = {
            token: token,
            deviceId: deviceId,
        };

        const res = await postData(url, initialPostData, logout);
        console.log('superVisorData', res);
        return res?.docs ?? [];
    }, [token, deviceId, logout]);

    // LEAVE API HANDLING -------------------------------
    const leaveFetchData = async () => {
        const initialPostData = {
            token: token,
            deviceId: deviceId,
        };

        const url = 'https://illimitable.in/app/mobile/my-leave-balance.json';
        const res = await postData(url, initialPostData, logout);

        return res?.doc;
    };

    // EMPLOYEE LIST API HANDLING -------------------------------
    const fetchEmployeeList = async () => {
        const url = 'https://illimitable.in/app/mobile/get-employee-list.json';
        const res = await postData(url, {}, logout);

        const employeeList = res?.docs?.filter((doc: any) => name !== doc?.name);
        return employeeList ?? [];
    };

    const [
        {isLoading: superVisorDataLoading, error, data: superVisorData},
        {isLoading, error: leaveError, data: leaveData},
        {isLoading: employeeListLoading, error: employeeListError, data: employeeList},
    ] = useQueries({
        queries: [
            {
                queryKey: ['leaveHistory'],
                queryFn: fetchQuery,
            },
            {
                queryKey: ['myLeaveBalance'],
                queryFn: leaveFetchData,
                refetchOnMount: true,
            },
            {
                queryKey: ['employeeList'],
                queryFn: fetchEmployeeList,
            },
        ],
    });

    const leaveBalance = useMemo(() => {
        if (leaveData) {
            return {
                [leaveData?.leaveTypes[0]?.name as LeaveType]: leaveData?.leaveTypes[0]?.maxCount - leaveData?.leaveTypes[0]?.days,
                [leaveData?.leaveTypes[1]?.name as LeaveType]: leaveData?.leaveTypes[1]?.maxCount - leaveData?.leaveTypes[1]?.days,
            };
        }
    }, [leaveData]);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const toggleModal = () => {
        if (selectedEmployee === null) {
            Toast.show({
                type: 'warning',
                text1: 'Please Select a Employee',
                visibilityTime: 4000,
            });
            return;
        }

        setIsVisible(!isVisible);
    };

    const leaveTransfer = async () => {
        const payload = {
            token: token,
            leaveCount: count,
            transferUserId: selectedEmployee?._id,
        };
        console.log('payload', payload);

        try {
            setTransferLoading(true);
            const url = 'https://illimitable.in/app/mobile/casual-leave-transfer.json';
            const res = await postData(url, payload, logout);

            if (!res.status) {
                Toast.show({
                    type: 'error',
                    text1: `${res.msg}`,
                    visibilityTime: 4000,
                });
                return;
            }

            await queryClient.invalidateQueries({queryKey: ['myLeaveBalance']});
            trigger('impactLight');
            Toast.show({
                type: 'success',
                text1: `Your ${count} Leave Transfered Successfully`,
                visibilityTime: 6000,
            });
        } catch (err) {
            console.error(err);
            Toast.show({
                type: 'error',
                text1: 'Error in Transfering Leave',
                visibilityTime: 6000,
            });
        } finally {
            setTransferLoading(false);
            setIsVisible(false);
        }
    };

    return {
        superVisorDataLoading,
        error,
        superVisorData,
        isLoading,
        leaveError,
        leaveBalance,
        employeeListLoading,
        employeeListError,
        employeeList,
        selectedEmployee,
        setSelectedEmployee,
        count,
        increment,
        decrement,
        transferLoading,
        leaveTransfer,
        toggleModal,
        isVisible,
    };
};
