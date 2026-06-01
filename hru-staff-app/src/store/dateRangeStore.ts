import moment, {Moment} from 'moment';
import {DateType} from 'react-native-ui-datepicker';
import {create} from 'zustand';

type DateRangeStoreState = {
    startDate: DateType;
    endDate: DateType;
    setDate: (startDate: DateType, endDate: DateType) => void;
};

export const useDateRangeStore = create<DateRangeStoreState>(set => ({
    startDate: moment().startOf('day').toDate() as DateType,
    endDate: moment().endOf('day').toDate() as DateType,
    setDate: (startDate, endDate) => {
        set({startDate: startDate, endDate: endDate});
    },
}));
