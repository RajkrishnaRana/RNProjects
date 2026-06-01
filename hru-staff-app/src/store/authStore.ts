import {create} from 'zustand';
import {MMKV} from 'react-native-mmkv';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';

type UserData = {
    appointments: AppointmentData[];
    auth_Token: string;
    email: string;
    hruId: string;
    name: string;
    mobileNo: string;
    profile_pic: string;
};

type LoginData = {
    phone_no: string;
    password: string;
};

type AuthStoreState = {
    loginData: LoginData | null;
    token: string | null;
    isAuthenticated: boolean;
    userData: UserData | null;
    isRememberMe: boolean;
    phone_no: string | undefined;
    password: string | undefined;
    login: (data: any) => void;
    logout: () => void;
    setLoginData: (data: LoginData) => void;
    setIsRememberMe: (data: boolean) => void;
    setPhnPass: (data: LoginData) => void;
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

export const useAuthStore = create<AuthStoreState>()(
    persist(
        set => ({
            loginData: null,
            token: null,
            isAuthenticated: false,
            userData: null,
            isRememberMe: false,
            phone_no: undefined,
            password: undefined,
            login: data => {
                set({
                    token: data.auth_token,
                    isAuthenticated: true,
                    userData: data,
                    isRememberMe: true,
                });
            },
            logout: () => {
                set({isAuthenticated: false, userData: null});
            },
            setLoginData: data => {
                set({
                    loginData: data,
                });
            },
            setIsRememberMe: data => {
                set({
                    isRememberMe: data,
                });
            },
            setPhnPass: variables => {
                set({
                    phone_no: variables.phone_no,
                    password: variables.password,
                });
            },
        }),
        {
            name: 'loginData',
            storage: createJSONStorage(() => zustandStorage),
        },
    ),
);
