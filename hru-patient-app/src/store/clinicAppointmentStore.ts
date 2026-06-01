import {create} from 'zustand';
import {
  generateClinicTimes,
  generateDates,
  getCurrentDate,
} from '../utils/dateCreation';

type datesType = {
  date: string;
  isoDate: string;
  isSelected: boolean;
};

type timeType = {
  time: string;
  isoTime: string;
  isSelected: boolean;
};

type ClinicAppointmentStates = {
  dates: datesType[];
  selectedDate: datesType;
  clinicTimes: timeType[];
  setDates: (index: number) => void;
  setTimings: (index: number) => void;
};

export const useClinicAppointmentStore = create<ClinicAppointmentStates>(
  set => ({
    dates: generateDates(1),
    selectedDate: {
      date: getCurrentDate(),
      isoDate: getCurrentDate(),
      isSelected: false,
    },
    clinicTimes: generateClinicTimes(10, 15),

    setDates: index =>
      set(state => {
        // Access the current dates state
        const updatedDates = state.dates.map((date, i) => {
          return {...date, isSelected: i === index}; // Set isSelected based on the index
        });
        // console.log(updatedDates);
        return {dates: updatedDates, selectedDate: updatedDates[index]}; // Update the state with the new dates array
      }),

    setTimings: index =>
      set(state => {
        const updatedTimes = state.clinicTimes.map((time, i) => {
          return {...time, isSelected: i === index};
        });
        // console.log(updatedTimes);
        return {clinicTimes: updatedTimes};
      }),
  }),
);
