import {create} from 'zustand';

interface GoogleAddressStates {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateName: {stateName: string; stateCode: number; abrv: string} | undefined;
    pinCode: string;
    mapLocation: {latitude: number; longitude: number};
    setCity: (city: string) => void;
    setStateName: (stateName: StateCodes | undefined) => void;
    setPinCode: (pinCode: string) => void;
    setAddressLineOne: (addressLineOne: string) => void;
    setAddressLineTwo: (addressLineTwo: string) => void;
    setMapLocation: (mapLocation: {
        latitude: number;
        longitude: number;
    }) => void;
    resetAddressStates: () => void;
}

export const useGoogleAddressStore = create<GoogleAddressStates>(set => ({
    addressLineOne: '',
    addressLineTwo: '',
    city: '',
    stateName: undefined,
    pinCode: '',
    mapLocation: {latitude: 0, longitude: 0},
    setCity: city => set({city: city}),
    setStateName: stateName => set({stateName: stateName}),
    setPinCode: pinCode => set({pinCode: pinCode}),
    setAddressLineOne: addressLineOne => set({addressLineOne: addressLineOne}),
    setAddressLineTwo: addressLineTwo => set({addressLineTwo: addressLineTwo}),
    setMapLocation: mapLocation => set({mapLocation: mapLocation}),

    resetAddressStates: () =>
        set({
            addressLineOne: '',
            addressLineTwo: '',
            city: '',
            stateName: undefined,
            pinCode: '',
            mapLocation: {latitude: 0, longitude: 0},
        }),
}));
