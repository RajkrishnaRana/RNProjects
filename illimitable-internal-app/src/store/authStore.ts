import {create} from 'zustand';
import {MMKV} from 'react-native-mmkv';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import {useAttendanceStore} from './attendanceStore';
import {formatTimestampTo12Hour} from '../utils/timeFunctions';

// Create an instance of MMKV
export const storage = new MMKV({id: 'loginData', encryptionKey: 'hunter2'});

// Define the Zustand storage using MMKV
const zustandStorage: StateStorage = {
    setItem: (name, value) => {
        storage.set(name, value); // Store the value as a string
    },
    getItem: name => {
        const value = storage.getString(name);
        return value !== undefined ? value : null; // Return null if the value is not found
    },
    removeItem: name => {
        storage.delete(name); // Remove the item from storage
    },
};

interface LeaveType {
    _id: string;
    name: string;
}

interface Duration {
    hours: number;
    minutes: number;
}

interface AuthResponseDataType {
    name: string;
    email: string;
    code: string;
    token: string;
    leaveTypes: LeaveType[];
    loginExists: boolean;
    logoutExists: boolean;
    loginTime: number;
    logoutTime: number;
    duration: Duration;
}

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    tokens: string[];
    setTokens: (newToken: string) => void;
    name: string | null;
    email: string | null;
    userData: any;
    deviceId: string | null;
    setDeviceId: (id: string) => void;
    login: (data: AuthResponseDataType) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isAuthenticated: false,
            token: null,
            tokens: [],
            setTokens: newToken =>
                set(state => ({
                    tokens: [...state.tokens, newToken], // Appending the new token
                })),
            email: null,
            name: null,
            userData: null,
            deviceId: null,
            setDeviceId: id => set({deviceId: id}),
            login: data => {
                if (data?.loginExists) {
                    useAttendanceStore.setState({
                        checkInTime: {
                            showTime: formatTimestampTo12Hour(data.loginTime),
                            exactTime: data.loginTime,
                        },
                    });
                }

                if (data?.logoutExists) {
                    useAttendanceStore.setState({
                        checkOutTime: {
                            showTime: formatTimestampTo12Hour(data.logoutTime),
                            exactTime: data.logoutTime,
                        },
                        totalTime: {
                            showTime: `${data.duration.hours} : ${data.duration.minutes}`,
                            exactTime: data.logoutTime - data.loginTime,
                        },
                    });
                }

                set({
                    isAuthenticated: true,
                    userData: data,
                    token: data?.token,
                    name: data?.name,
                    email: data?.email,
                });
            },
            logout: () => {
                set({
                    isAuthenticated: false,
                    userData: null,
                    deviceId: null,
                    name: null,
                });

                useAttendanceStore.setState({
                    checkInTime: null,
                    checkOutTime: null,
                    totalTime: null,
                });
            },
        }),
        {
            name: 'loginData', // Unique name for the storage
            storage: createJSONStorage(() => zustandStorage), // Use the MMKV storage
        },
    ),
);
