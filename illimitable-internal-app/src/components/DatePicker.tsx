import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDatePicker} from '../hooks/useDatePicker';
import IconFeather from 'react-native-vector-icons/Feather';
import dayjs from 'dayjs';

interface Props {
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    label?: string;
    isNecessary?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export default function DatePicker({date, setDate, label, isNecessary, minDate, maxDate}: Props) {
    const {showPicker, setShowPicker, onChangeDate} = useDatePicker(setDate);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <View style={styles.dobContainer}>
                    <Text style={styles.input2}>{dayjs(date).format('DD/MM/YYYY')}</Text>

                    <IconFeather name="calendar" size={wp(8.2)} color={Colors.LIGHT_BLUE} />
                </View>
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
        color: Colors.LIGHT_BLUE,
        fontWeight: '600',
    },
    text: {
        fontSize: wp(3.5),
        color: Colors.BLACK,
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
        color: Colors.LIGHT_BLUE,
        fontWeight: '600',
    },
    dobContainer: {
        height: hp(6.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: wp(0.5),
        borderColor: Colors.LIGHT_BLUE,
        borderRadius: wp(10),
        paddingHorizontal: wp(4),
        backgroundColor: 'white',
    },
    input2: {
        flex: 1,
        fontSize: wp(4),
        fontWeight: 'bold',
        color: Colors.LIGHT_BLUE,
    },
});
