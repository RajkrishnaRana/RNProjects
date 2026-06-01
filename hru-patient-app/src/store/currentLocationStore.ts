import {create} from 'zustand';

type CurrentLocationType = {
    latitude: number;
    longitude: number;
    accuracy: number;
};

type NearestLocationType = {
    _id: string; // The unique ID in string format
    city: string; // The city name
    location: {
        type: string; // The type of the location (e.g., "Point")
        coordinates: [number, number]; // An array containing longitude and latitude as numbers
    };
    locationAddress: string; // The full address as a string
    locationRadius: string; // Radius as a string (possibly representing distance in some unit)
    locationRadiusForLab: number; // Radius as a number
};

interface Location {
    type: 'Point';
    coordinates: [number, number];
}

export interface LocationList {
    _id: string;
    city: string;
    companyId: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    location: Location;
    locationAddress: string;
    locationRadius: string;
    updatedAt: string;
    updatedBy: string;
    locationRadiusForLab: number;
}

interface CurrentLocationStates {
    currentLocation: CurrentLocationType | null;
    nearestLocation: NearestLocationType | null;
    locationList: LocationList[];
    locationModal: boolean;
    setCurrentLocation: (val: CurrentLocationType) => void;
    setNearestLocation: (val: NearestLocationType) => void;
    setLocationList: (val: LocationList[]) => void;
    setLocationModal: (val: boolean) => void;
}

export const useCurrentLocationStore = create<CurrentLocationStates>(set => ({
    currentLocation: null,
    nearestLocation: null,
    locationList: [],
    locationModal: false,
    setCurrentLocation: val => {
        set({currentLocation: val});
    },
    setNearestLocation: val => {
        set({nearestLocation: val});
    },
    setLocationList: val => {
        set({locationList: val});
    },
    setLocationModal: val => {
        set({locationModal: val});
    },
}));
