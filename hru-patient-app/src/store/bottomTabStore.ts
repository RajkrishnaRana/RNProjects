import { create } from 'zustand';
import { DrawerParamList } from '../types/routeTypes';

type bottomTabState = {
    tabs: { name: keyof DrawerParamList; isSelected: Boolean }[];
    selectedTabs: String;
    activeRoute: String;
    selectActiveTabs: (index: number) => void;
    setActiveRoute: (route: String) => void;
};

export const useBottomTabStore = create<bottomTabState>(set => ({
    tabs: [
        {
            name: 'DASHBOARD',
            isSelected: true,
        },
        {
            name: 'MY PROFILE',
            isSelected: false,
        },
        {
            name: 'ADDRESS BOOK',
            isSelected: false,
        },
        {
            name: 'FAMILY MEMBERS',
            isSelected: false,
        },
        {
            name: 'HEALTH VAULT',
            isSelected: false,
        },
        {
            name: 'APPOINTMENTS',
            isSelected: false,
        },
        {
            name: 'DISPUTES', //index 6
            isSelected: false,
        },
        {
            name: 'ORDERS', //index 7
            isSelected: false,
        },
        {
            name: 'BOOK APPOINTMENT',
            isSelected: false,
        },
        {
            name: 'REFERRAL POINTS',
            isSelected: false,
        },
        // {name: 'Log Out', isSelected: false},
        {
            name: 'MEDICINE INTAKE', // index 10
            isSelected: false,
        },
        {
            name: 'MEDICINE REFILL',
            isSelected: false,
        },
        {
            name: 'LAB APPOINTMENTS', // index 12
            isSelected: false,
        },
        {
            name: 'PHARMACY ORDERS', // index 13
            isSelected: false,
        },
    ],
    selectedTabs: 'DASHBOARD',
    activeRoute: 'DASHBOARD',
    selectActiveTabs: index => {
        set(state => ({
            tabs: state.tabs.map((item, i) => ({
                ...item,
                isSelected: i === index ? true : false,
            })),
            selectedTabs: state.tabs[index].name,
        }));
    },
    setActiveRoute: route => set(() => ({ activeRoute: route })),
}));
