import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDatePicker } from '../hooks/useDatePicker';

interface Props {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label: string;
    isNecessary?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export default function DatePicker({ date, setDate, label, isNecessary, minDate, maxDate }: Props) {
    const { showPicker, setShowPicker, onChangeDate } = useDatePicker(setDate);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <TouchableOpacity style={styles.timeContainer} onPress={() => setShowPicker(true)}>
                <Text style={styles.text}>{date ? date.toDateString() : '--/--/--'}</Text>
                {showPicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date" // Set the mode to 'time' for time picker
                        display="default" // Options: 'default', 'spinner', or 'clock'
                        onChange={onChangeDate}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: hp(0.5),
    },
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    text: {
        fontSize: wp(3.5),
        color: colors.black,
    },
    timeContainer: {
        backgroundColor: 'white',
        paddingVertical: hp(1.35),
        borderRadius: wp(2),
        elevation: 2,
        paddingLeft: wp(3),
    },
    titleText: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
});
