import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useState} from 'react';

export const useDatePicker = (setDate: (date: Date) => void) => {
    const [showPicker, setShowPicker] = useState(false);

    const onChangeDate = (event: DateTimePickerEvent, selectedTime: Date | undefined) => {
        const selectedDate = selectedTime;
        // console.log('selectedDate', selectedDate);
        if (event.type === 'set' && selectedDate) setDate(selectedDate);
        setShowPicker(false); // Update time state
    };

    return {
        showPicker,
        setShowPicker,
        onChangeDate,
    };
};
