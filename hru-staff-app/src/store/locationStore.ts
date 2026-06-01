import {create} from 'zustand';
import {MMKV} from 'react-native-mmkv';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';

type LocationData = {
    latitude: number;
    longitude: number;
    timestamp: number;
};

type LocationStoreStates = {
    locations: LocationData[];
    setLocations: (data: LocationData) => void;
    clearLocations: () => void;
};

// Create an instance of MMKV
const storage = new MMKV({id: 'locationData', encryptionKey: 'hunter2'});

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

export const useLocationStore = create<LocationStoreStates>()(
    persist(
        set => ({
            locations: [],
            setLocations: data => {
                set(state => ({
                    locations: [...state.locations, data],
                }));
            },
            clearLocations: () => {
                set({
                    locations: [],
                });
            },
        }),
        {
            name: 'locationData',
            storage: createJSONStorage(() => zustandStorage),
        },
    ),
);
