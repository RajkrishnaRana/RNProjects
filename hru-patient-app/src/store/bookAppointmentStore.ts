import {create} from 'zustand';

type BookAppointmentStates = {
    doctorDetails: any;
    setDoctorDetails: (val: any) => void;
};

export const useBookAppointmentStore = create<BookAppointmentStates>(set => ({
    doctorDetails: null,
    setDoctorDetails: val => {
        set({doctorDetails: val});
    },
}));
