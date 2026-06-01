import { create } from 'zustand';

type MedicineStoreTypes = {
    selectedMedicine: any;
    setSelectedMedicine: (val: any) => void;
};

export const useMedicineIntakeStore = create<MedicineStoreTypes>(set => ({
    selectedMedicine: '',

    setSelectedMedicine: val => {
        set({ selectedMedicine: val });
    },
}));
