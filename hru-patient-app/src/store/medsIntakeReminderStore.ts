import {create} from 'zustand';

interface MedsIntakeReminderStates {
    showModal: boolean;
    setShowModal: (val: boolean) => void;
}

export const useMedsIntakeReminderStore = create<MedsIntakeReminderStates>(set => ({
    showModal: false,
    setShowModal: val => set({showModal: val}),
}));
