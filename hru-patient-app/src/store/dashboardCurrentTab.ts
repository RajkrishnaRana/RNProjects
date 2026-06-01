import { create } from "zustand";

type currentTab = {
    selectedTab: string;
    setSelectedTab: (val: string) => void;
};

export const useCurrentTabDashboard = create<currentTab>(set=> ({
    selectedTab: 'doctor',
    setSelectedTab: val =>{
        set({selectedTab: val});
    }
}))