import {StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {memo, useState, useRef} from 'react';
import Modal from 'react-native-modal';
import dayjs, {Dayjs} from 'dayjs';
import DateTimePicker, {DateType, useDefaultStyles} from 'react-native-ui-datepicker';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IconFeather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import {isTab} from '../../utils/isTab';

interface DatePickerModalProps {
    isRequired?: boolean;
    customLabel?: string;
    customLabelStyle?: StyleProp<TextStyle>;
    date: DateType;
    setDate: React.Dispatch<React.SetStateAction<DateType>>;
    customStyle?: StyleProp<ViewStyle>;
    minimumDate?: DateType;
    maxDate?: DateType;
}

const TEMPLATE = 'DD/MM/YYYY';

const formatDateWithTemplate = (raw: string, prevValue: string): string => {
    // If input is empty, return empty string
    if (!raw) {
        return '';
    }

    // Count digits in the current input
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const prevDigits = prevValue.replace(/\D/g, '');

    // If deleting (fewer digits than before), return raw input to allow natural backspace behavior
    if (digits.length <= prevDigits.length) {
        return raw;
    }

    // If typing forward, format with '/' after day (2 digits) and month (4 digits)
    let result = '';

    for (let i = 0; i < digits.length; i++) {
        result += digits[i];
        if (i === 1 && digits.length >= 2) {
            result += '/'; // Add '/' after DD
        } else if (i === 3 && digits.length >= 4) {
            result += '/'; // Add '/' after MM
        }
    }

    return result;
};

function DatePickerModal({
    isRequired = false,
    date,
    setDate,
    customLabel,
    customLabelStyle,
    minimumDate,
    customStyle,
    maxDate = dayjs(),
}: DatePickerModalProps) {
    const defaultStyle = useDefaultStyles('light');
    const [isVisible, setIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState<string>(date && dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : '');

    const handleTextChange = (text: string) => {
        // Validate input to allow only digits and '/'
        if (!/^[0-9/]*$/.test(text)) {
            Toast.show('Only Nubers are allowed', Toast.SHORT);
            return; // Ignore input containing invalid characters
        }

        const formatted = formatDateWithTemplate(text, inputValue);
        setInputValue(formatted);

        // Validate if the input matches DD/MM/YYYY format
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
            let [day, month, year] = formatted.split('/').map(Number);

            // Create a dayjs object with the input
            let parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true);

            // If the date is after maxDate (today), set to maxDate
            if (maxDate && parsed.isAfter(maxDate)) {
                parsed = dayjs(maxDate);
                day = parsed.date();
                month = parsed.month() + 1; // dayjs months are 0-based
                year = parsed.year();
            } else {
                // Adjust month if greater than 12
                if (month > 12) {
                    month = 12;
                }

                // Recreate parsed date with adjusted month
                parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true);

                // Adjust day if invalid for the given month/year
                if (!parsed.isValid() || day > parsed.daysInMonth()) {
                    day = parsed.daysInMonth();
                    parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true);
                }

                // Adjust year if before minimumDate
                if (minimumDate && parsed.isBefore(minimumDate)) {
                    year = dayjs(minimumDate).year();
                    parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true);
                    // Recheck day validity for the new year
                    if (day > parsed.daysInMonth()) {
                        day = parsed.daysInMonth();
                        parsed = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true);
                    }
                }
            }

            // Update inputValue and date state with the adjusted valid date
            const adjustedFormatted = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
            setInputValue(adjustedFormatted);
            setDate(parsed);
        } else {
            setDate(null); // Reset date if format is incomplete
        }
    };

    return (
        <>
            <View style={[{width: wp(40)}, customStyle]}>
                {customLabel !== ' ' && (
                    <Text style={[styles.label, customLabelStyle]}>
                        {customLabel || 'D.O.B'} {isRequired && <Text style={{color: colors.red}}>*</Text>}
                    </Text>
                )}
                <View style={styles.dobContainer}>
                    <TextInput
                        style={[styles.input2, {flex: 1}]}
                        value={inputValue}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor={colors.darkGrey}
                        keyboardType="number-pad"
                        maxLength={10}
                        onChangeText={handleTextChange}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setIsVisible(!isVisible);
                        }}
                        style={styles.iconContainer}>
                        <IconFeather name="calendar" size={isTab ? wp(3) : wp(4.2)} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal isVisible={isVisible} animationIn={'fadeInUp'} animationOut={'fadeOutDown'} onBackdropPress={() => setIsVisible(false)}>
                <View style={styles.modalContent}>
                    <DateTimePicker
                        mode="single"
                        minDate={minimumDate}
                        maxDate={maxDate ? maxDate : null}
                        date={date || dayjs()}
                        onChange={params => {
                            const newDate = dayjs(params.date, 'YYYY-MM-DD');
                            setDate(newDate);
                            setInputValue(newDate.format('DD/MM/YYYY'));
                            setIsVisible(false);
                        }}
                        styles={{
                            ...defaultStyle,
                            button_prev: {
                                boxShadow: colors.primaryShadowColor,
                                padding: wp(3),
                                borderRadius: wp(10),
                                marginLeft: wp(4),
                            },
                            button_prev_image: {
                                tintColor: colors.primary,
                            },
                            button_next: {
                                boxShadow: colors.primaryShadowColor,
                                padding: wp(3),
                                borderRadius: wp(10),
                                marginRight: wp(4),
                            },
                            button_next_image: {
                                tintColor: colors.primary,
                            },
                            month_selector_label: {
                                color: colors.black,
                            },
                            year_selector_label: {
                                color: colors.black,
                            },
                            day_cell: {
                                padding: wp(1),
                                color: colors.black,
                            },
                            day_label: {
                                color: colors.black,
                            },
                        }}
                    />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: isTab ? wp(2) : wp(3),
        marginBottom: 5,
        color: colors.black,
    },
    dobContainer: {
        height: isTab ? hp(4) : hp(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: isTab ? wp(0.2) : wp(0.3),
        borderColor: colors.grey,
        borderRadius: 15,
        paddingHorizontal: wp(2),
    },
    input2: {
        fontSize: isTab ? wp(2.5) : wp(4),
        color: colors.black,
    },
    iconContainer: {
        padding: wp(1),
    },
    modalContent: {
        height: 'auto',
        backgroundColor: colors.white,
        paddingVertical: wp(2),
        borderRadius: wp(5),
        paddingHorizontal: wp(3),
    },
});

export default memo(DatePickerModal);
