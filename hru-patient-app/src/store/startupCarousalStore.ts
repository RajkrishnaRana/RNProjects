import {create} from 'zustand';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

// Create an instance of MMKV
const storage = new MMKV({id: 'startupCarousal'});

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

type StartupCarousalStates = {
    isFirstTimeAppOpen: boolean;
    setIsFirstTimeAppOpen: () => void;
};

// Zustand store with persistence
export const useStartupCarousalStore = create<StartupCarousalStates>()(
    persist(
        set => ({
            isFirstTimeAppOpen: true, // Initial state
            setIsFirstTimeAppOpen: () => set({isFirstTimeAppOpen: false}), // Action to update state
        }),
        {
            name: 'startupCarousal', // Unique name for the storage
            storage: createJSONStorage(() => zustandStorage), // Use the MMKV storage
        },
    ),
);
