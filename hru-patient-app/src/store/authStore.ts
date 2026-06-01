import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import {queryClient} from '../../App';

type AuthResponseDataType = {
    hruId: string;
    name: string;
    profile_pic: string;
    email: string;
    mobileNo: string;
    dob: string;
    auth_token: string;
};

// Create an instance of MMKV
const storage = new MMKV({id: 'loginData', encryptionKey: 'hunter2'});

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

type AuthState = {
    isAuthenticated: boolean;
    isRememberMe: boolean;
    token: string | null;
    userData: any;
    updatedUserData: {name: string; imgLink: string} | null;
    phone_no: string;
    password: string;
    isBooking: boolean;
    login: (data: AuthResponseDataType, rememberMe: boolean) => void;
    logout: () => void;
    setPhnPass: (variables: {phone_no: string; password: string}) => void;
    setIsBooking: (isBooking: boolean) => void;
    setUpdatedUserData: (name: string, imglink: string) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isAuthenticated: false,
            token: null,
            userData: null,
            isRememberMe: false,
            phone_no: '',
            password: '',
            updatedUserData: null,
            isBooking: false,
            login: (data, rememberMe) => {
                queryClient.clear();
                set({
                    isAuthenticated: true,
                    userData: data,
                    token: data.auth_token,
                    isRememberMe: rememberMe,
                    updatedUserData: {name: data.name, imgLink: data.profile_pic},
                });
            },
            logout: () => {
                queryClient.clear();
                set({
                    isAuthenticated: false,
                    token: null,
                    userData: null,
                    isRememberMe: false,
                    updatedUserData: null,
                });
            },
            setPhnPass: variables => {
                set({
                    phone_no: variables.phone_no,
                    password: variables.password,
                });
            },
            setIsBooking: isBooking => set({isBooking: isBooking}),
            setUpdatedUserData: (name, imgLink) => set({updatedUserData: {name, imgLink}}),
        }),
        {
            name: 'loginData',
            storage: createJSONStorage(() => zustandStorage), // Use the MMKV storage
            partialize: state => {
                // Only persist isAuthenticated and userData if rememberMe is true
                return state.isRememberMe ? state : {};
            },
        }
    )
);
