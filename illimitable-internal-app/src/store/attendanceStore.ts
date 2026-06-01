import {create} from 'zustand';
import {MMKV} from 'react-native-mmkv';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';

// Create an instance of MMKV
const storage = new MMKV({id: 'attendanceData', encryptionKey: 'hunter2'});

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

// type AuthResponseDataType = {
//     code: string;
//     email: string;
//     name: string;
//     token: string;
//     deviceId: string;
// };

export type CheckTime = {
    showTime: string;
    exactTime: number;
};

// type totalTimeProps = {
//     showTime: string;
//     exactTime: Date;
// };

type AuthState = {
    checkInTime: CheckTime | null;
    checkOutTime: CheckTime | null;
    totalTime: CheckTime | null;
    setCheckInTime: (data: CheckTime | null) => void;
    setCheckOutTime: (data: CheckTime | null) => void;
    setTotalTime: (data: CheckTime | null) => void;
};

export const useAttendanceStore = create<AuthState>()(
    persist(
        set => ({
            checkInTime: null,
            checkOutTime: null,
            totalTime: null,
            setCheckInTime: data => set({checkInTime: data}),
            setCheckOutTime: data => set({checkOutTime: data}),
            setTotalTime: data => set({totalTime: data}),
        }),
        {
            name: 'attendanceData', // Unique name for the storage
            storage: createJSONStorage(() => zustandStorage), // Use the MMKV storage
        },
    ),
);
