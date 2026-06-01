import { create } from 'zustand';
import { ApiResponse } from '../screens/ReferralPointsScreen';

type ReferralStoreStates = {
    referralApiData: ApiResponse | null,
    setReferralApiData: (val: ApiResponse) => void
};

export const useReferralStore = create<ReferralStoreStates>(set => ({
    referralApiData: null,

    setReferralApiData: val => {
        set({ referralApiData: val });
    },
}));
