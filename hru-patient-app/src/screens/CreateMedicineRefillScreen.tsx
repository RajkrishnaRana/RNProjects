import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '../hooks/useNavigation';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DatePickerModal from '../components/Modal/DatePickerModal';
import BigButton from '../components/BigButton';
import { DateType } from 'react-native-ui-datepicker';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../App';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { useAuthStore } from '../store/authStore';
import dayjs from 'dayjs';
import { isTab } from '../utils/isTab';

export default function CreateMedicineRefillScreen({ route }: any) {
    const navigation = useNavigation();
    const { item, mode, queryKey } = route.params;

    // GLOBAL STATES ---------------------------->
    const { selectedMedicine, setSelectedMedicine } = useMedicineIntakeStore();
    const token = useAuthStore(s => s.token);

    // LOCAL STATES ----------------------------->
    const [quantity, setQuantity] = useState<string>('');
    const [time, setTime] = useState<Date>();
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [prescribedBy, setPrescribedBy] = useState('');
    const [dob, setDob] = useState<DateType>();
    const [loading, setLoading] = useState(false);

    // LOCAL FUNCTIONS ---------------------------->
    const isToday = (date: Date) => {
        const today = new Date();
        const receivedDate = new Date(date);
        return (
            receivedDate.getFullYear() === today.getFullYear() &&
            receivedDate.getMonth() === today.getMonth() &&
            receivedDate.getDate() === today.getDate()
        );
    };

    // function tommorowDate() {
    //     const today = new Date();
    //     today.setDate(today.getDate() + 1); // Add 1 day to today's date
    //     return today;
    // }

    const onChangeTime = (event: DateTimePickerEvent, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || new Date(); // Use the selected time or current value
        console.log('currentTime', currentTime.getTime());
        setTime(currentTime);
        setShowTimePicker(false); // Update time state
    };

    const transformToTimeOnly = (dateString: string) => {
        const date = new Date(dateString);

        // Create a new Date set to 1970-01-01
        const timeOnlyDate = new Date('1970-01-01T00:00:00.000Z');

        // Set the time components from the input date
        timeOnlyDate.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

        return timeOnlyDate.toISOString();
    };

    const transformTo1970 = () => {
        const currentDate = new Date(); // Current date: June 05, 2025, 03:57 PM IST (10:27 AM UTC)

        // Create a new Date set to 1970-01-01
        const timeOnlyDate = new Date('1970-01-01T00:00:00.000Z');

        // Set the time components from the current date
        timeOnlyDate.setUTCHours(
            currentDate.getUTCHours(),
            currentDate.getUTCMinutes(),
            currentDate.getUTCSeconds(),
            currentDate.getUTCMilliseconds(),
        );

        return timeOnlyDate.getTime();
    };

    const handlePost = async (payload: any) => {
        try {
            setLoading(true);
            const url = mode === 'edit' ? `${BASE_URL}/hru/Patientappapi/editmedicinerefill` : `/hru/Patientappapi/savemedicinerefill`;

            const res = await postData(url, payload);
            console.log('medsRefill api hit', res);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.LONG);
                throw new Error(res.msg);
            }

            if (res.status) {
                if (mode === 'edit') {
                    Toast.show('Medicine refill data updated successfully', Toast.LONG);
                } else {
                    Toast.show('Medicine refill data added successfully', Toast.LONG);
                }
                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
                queryClient.invalidateQueries({
                    queryKey: ['medsPresent' + 'Refill'],
                });

                navigation.goBack();
                setSelectedMedicine('');
            } else {
                Toast.show(res.msg, Toast.LONG);
            }
        } catch (error) {
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        // Handle form submission logic here
        console.log({
            selectedMedicine,
            quantity,
            time,
            prescribedBy,
            dob,
        });
        if (!selectedMedicine?.name) {
            Toast.show('Medicine name is required', Toast.LONG);
            return;
        }
        if (!quantity) {
            Toast.show('Quantity is required', Toast.LONG);
            return;
        }
        if (!time) {
            Toast.show('Time is required', Toast.SHORT);
            return;
        }
        if (!dob) {
            Toast.show('Date is required', Toast.SHORT);
            return;
        }
        if (isToday(dob as Date) && time.getTime() < transformTo1970()) {
            console.log('time', time.getTime(), transformTo1970());
            Toast.show('Time must be greater than current time', Toast.LONG);
            return;
        }
        if (!prescribedBy) {
            Toast.show('Prescribed By is required', Toast.LONG);
            return;
        } else {
            let payloadData;
            if (mode === 'edit') {
                if (selectedMedicine?._id) {
                    payloadData = {
                        token: token,
                        id: item?._id,
                        medicineName: selectedMedicine?.name,
                        medicineId: selectedMedicine?._id,
                        quantity: Number(quantity),
                        remainderTime: time?.toISOString(),
                        remainderDate: (dob as Date)?.toISOString(),
                        pescribedby: prescribedBy,
                    };
                } else {
                    payloadData = {
                        token: token,
                        id: item?._id,
                        medicineName: selectedMedicine?.name,
                        quantity: Number(quantity),
                        remainderTime: time?.toISOString(),
                        remainderDate: (dob as Date)?.toISOString(),
                        pescribedby: prescribedBy,
                    };
                }

                console.log('REfill edit data', payloadData);
            } else {
                if (selectedMedicine?._id) {
                    payloadData = {
                        token: token,
                        medicineName: selectedMedicine?.name,
                        medicineId: selectedMedicine?._id,
                        quantity: Number(quantity),
                        remainderTime: transformToTimeOnly(time?.toISOString()),
                        remainderDate: (dob as Date)?.toISOString(),
                        pescribedby: prescribedBy,
                    };
                } else {
                    payloadData = {
                        token: token,
                        medicineName: selectedMedicine?.name,
                        quantity: Number(quantity),
                        remainderTime: transformToTimeOnly(time?.toISOString()),
                        remainderDate: (dob as Date)?.toISOString(),
                        pescribedby: prescribedBy,
                    };
                }

                console.log('REfill add data', payloadData);
            }

            // API CALL ------------------
            handlePost(payloadData);
        }
    };

    // SIDE EFFECTS ------------------------------------------

    useEffect(() => {
        console.log('item updated', item);
        if (item) {
            console.log(item);

            setSelectedMedicine({ name: item?.medicineName });
            setQuantity(`${item.quantity}`);
            setTime(new Date(item.remainderTime));
            setDob(new Date(item.remainderDate));
            setPrescribedBy(item.pescribedby);
        }
    }, [item, setSelectedMedicine]);

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Medicine Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Medicine Name <Text style={{ color: colors.red }}>*</Text>
                    </Text>

                    <TouchableOpacity style={styles.searchBoxContainer} onPress={() => navigation.navigate('MedicineIntakeSearchScreen')}>
                        <Text
                            style={[
                                styles.searchBoxText,
                                {
                                    color: selectedMedicine?.name ? colors.darkBlue : colors.grey,
                                },
                            ]}
                        >
                            {selectedMedicine ? selectedMedicine?.name : 'Search Medicine Name'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Quantity and Time */}
                <View style={styles.rowHalf}>
                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Quantity <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <TextInput style={[styles.input]} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
                    </View>

                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Time <Text style={{ color: colors.red }}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.timeContainer} onPress={() => setShowTimePicker(true)}>
                            <Text style={styles.timeText}>{time ? time.toLocaleTimeString() : '-- : --'}</Text>
                            {showTimePicker && (
                                <RNDateTimePicker
                                    value={time || new Date()}
                                    mode="time" // Set the mode to 'time' for time picker
                                    display="default" // Options: 'default', 'spinner', or 'clock'
                                    onChange={onChangeTime}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Prescribed By */}
                <View style={styles.rowHalf}>
                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Prescribed By <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <TextInput style={[styles.input]} value={prescribedBy} onChangeText={setPrescribedBy} />
                    </View>
                </View>

                <DatePickerModal
                    isRequired
                    customLabel="Reminder Date"
                    customLabelStyle={styles.label}
                    date={dob}
                    setDate={setDob}
                    customStyle={styles.customDatePicker}
                    minimumDate={dayjs()}
                    maxDate={null}
                />

                <BigButton
                    title={mode === 'edit' ? 'Update' : 'Add'}
                    onPress={() => {
                        handleAdd();
                    }}
                    customStyle={{
                        marginVertical: hp(2),
                        marginHorizontal: wp(5),
                    }}
                    loading={loading}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: colors.backgroundColor },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(2),
    },
    searchBoxContainer: {
        backgroundColor: colors.blueWhite,
        borderRadius: wp(2.5),
        padding: isTab ? wp(2.5) : wp(3.5),
        flex: 1,
        flexDirection: 'row',
        borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        // elevation: 3,
    },
    searchBoxText: {
        fontSize: isTab ? wp(2.2) : wp(3.5),
        fontWeight: 'bold',
        color: colors.darkGrey,
    },
    inputGroup: {
        marginBottom: isTab ? hp(1) : hp(1.5),
        // flex: 1,
    },
    inputGroupHalf: {
        flex: 1,
        marginBottom: isTab ? hp(1) : hp(1.5),
    },
    row: {
        flexDirection: 'row',
    },
    rowHalf: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(5),
        // marginTop: hp(2.5),
    },
    label: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(2.2) : wp(4.2),
        color: '#6B6B6B',
        marginBottom: hp(1),
    },
    input: {
        borderWidth: wp(0.3),
        borderColor: colors.grey,
        borderRadius: wp(2),
        // padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: isTab ? wp(2.5) : wp(4.2),
        fontWeight: 'bold',
        color: colors.darkBlue,
        height: isTab ? hp(5) : hp(6),
        // width: wp(38),
        paddingHorizontal: wp(2),
    },
    inputNonEditable: {
        borderWidth: wp(0.5),
        borderColor: colors.darkGreen,
        borderRadius: wp(2),
        padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: isTab ? wp(2.5) : wp(4.2),
        color: colors.darkGreen,
        fontWeight: 'bold',
        opacity: 0.6,
    },
    title: {
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: hp(2),
        textAlign: 'center',
    },
    dropdown: {
        // width: wp(38),
        height: isTab ? hp(5) : hp(6),
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: wp(3),
        backgroundColor: colors.blueWhite,
    },
    addButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: isTab ? hp(1) : hp(1.5),
        borderRadius: wp(1),
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.white,
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
    },
    timeContainer: {
        borderWidth: wp(0.3),
        borderColor: colors.grey,
        borderRadius: wp(2.5),
        justifyContent: 'center',
        paddingVertical: isTab ? hp(1.2) : hp(1.5),
        paddingHorizontal: wp(3),
    },
    timeText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
    customDatePicker: { alignSelf: 'center' },
});
