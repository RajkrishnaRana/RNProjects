import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import CustomDropdown from '../components/CustomDropdown';
import BigButton from '../components/BigButton';
import { useNavigation } from '../hooks/useNavigation';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import { postData } from '../api';
import { BASE_URL } from '../config';
import { queryClient } from '../../App';
import Toast from 'react-native-simple-toast';
import { useAuthStore } from '../store/authStore';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { medsIntakeStorage } from '../utils/MMKVStorage';
import { isTab } from '../utils/isTab';

export default function CreateMedicineItakeScreen({ route }: any) {
    // Destructure 'queryKey' from route.params
    const { queryKey } = route.params;
    const { item } = route.params;
    const { mode } = route.params;
    const navigation = useNavigation();

    // Dynamic Styles ------------------->
    const opacity = mode === 'edit' ? 0.6 : 1;

    // ZUSTAND STATES --------------------------------------
    const { selectedMedicine, setSelectedMedicine } = useMedicineIntakeStore();
    const { token, userData } = useAuthStore();

    // LOCAL STATES ------------------------------------------
    const [loading, setLoading] = useState(false);
    // const [medicineName, setMedicineName] = useState('');
    const [frequency, setFrequency] = useState<any>();
    const [consumptionTime, setConsumptionTime] = useState<any>();
    const [duration, setDuration] = useState('');
    const [time, setTime] = useState<any>();
    const [dosage, setDosage] = useState('');
    const [unit, setUnit] = useState<any>();
    const [additionalNote, setAdditionalNote] = useState('');
    const [reminderTime, setReminderTime] = useState(() => {
        if (item?.remainderTime) {
            const storageKey = `user_${userData?.hruId}_medicine_${item._id}_time_${item.remainderTime}`;
            const storedTime = medsIntakeStorage.getString(storageKey);
            return storedTime ? new Date(storedTime) : new Date(item?.remainderTime);
        }

        return new Date();
    });
    const [showTimePicker, setShowTimePicker] = useState(false);

    // SIDE EFFECTS ------------------------------------------
    useEffect(() => {
        // console.log('item updated edit mode', item);
        if (item) {
            // console.log('inside runnig');

            setSelectedMedicine({ name: item?.medicineName });
            setFrequency(item.frequency);
            setConsumptionTime(item.consumptionTime);
            setDuration(`${item.duration}`);
            setTime(item.time);
            setDosage(`${item.dosage}`);
            setUnit(item.unit);
            setAdditionalNote(item.additionalNote);
        }
    }, [item, setSelectedMedicine]);

    const frequencyData = [
        { label: '1-0-0', value: '1-0-0' },
        { label: '0-1-0', value: '0-1-0' },
        { label: '0-0-1', value: '0-0-1' },
        { label: '1-0-1', value: '1-0-1' },
        { label: '1-1-1', value: '1-1-1' },
        { label: '1-1-0', value: '1-1-0' },
        { label: '0-1-1', value: '0-1-1' },
        { label: '1 Times', value: '1 Times' },
        { label: '2 Times', value: '2 Times' },
        { label: '3 Times', value: '3 Times' },
        { label: '4 Times', value: '4 Times' },
        { label: '5 Times', value: '5 Times' },
        { label: '6 Times', value: '6 Times' },
        { label: 'SOS', value: 'SOS' },
        { label: 'Once A Week', value: 'Once A Week' },
        { label: 'Twice a Week', value: 'Twice a Week' },
        { label: 'Alt. Day', value: 'Alt. Day' },
        { label: 'Alt Week', value: 'Alt Week' },
    ];
    const consumptionTimeData = [
        { label: 'Before Food', value: 'Before Food' },
        { label: 'After Food', value: 'After Food' },
        { label: 'Empty Stomach', value: 'Empty Stomach' },
        { label: 'Bed Time', value: 'Bed Time' },
        { label: 'Any Time', value: 'Any Time' },
    ];
    const timeData = [
        { label: 'Day', value: 'Day' },
        { label: 'Week', value: 'Week' },
        { label: 'Month', value: 'Month' },
        { label: 'Year', value: 'Year' },
    ];
    const unitData = [
        { label: 'Tabs', value: 'Tabs' },
        { label: 'Caps', value: 'Caps' },
        { label: 'Inj', value: 'Inj' },
        { label: 'ML', value: 'ML' },
        { label: 'TS', value: 'TS' },
        { label: 'Drops', value: 'Drops' },
        { label: 'Puff', value: 'Puff' },
        { label: 'Local App', value: 'Local App' },
        { label: 'Vial', value: 'Vial' },
        { label: 'Sachet', value: 'Sachet' },
        { label: 'Rotacap', value: 'Rotacap' },
        { label: 'Ampule', value: 'Ampule' },
        { label: 'Unit', value: 'Unit' },
    ];

    const handlePost = async (payload: any) => {
        try {
            setLoading(true);
            const url = mode === 'edit' ? `${BASE_URL}/hru/Patientappapi/editmedicineintake` : `${BASE_URL}/hru/Patientappapi/savemedicineintake`;

            console.log(payload);

            // const url =
            //     'https://c359-2401-4900-1c85-52d4-a9b5-4d90-89c5-95db.ngrok-free.app/hru/Patientappapi/savemedicineintake';

            const res = await postData(url, payload);
            console.log('res -------------------', res);

            if (res.status) {
                if (mode === 'edit') {
                    Toast.show('Medicine data updated successfully', Toast.LONG);
                } else {
                    Toast.show('Medicine data added successfully', Toast.LONG);
                }

                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
                queryClient.invalidateQueries({
                    queryKey: ['medsPresent' + 'Intake'],
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
        if (!selectedMedicine?.name) {
            Toast.show('Medicine name is required', Toast.LONG);
            return;
        }
        if (!frequency) {
            Toast.show('Frequency is required', Toast.LONG);
            return;
        }
        if (!consumptionTime) {
            Toast.show('Consumption Time is required', Toast.LONG);
            return;
        }
        if (!duration) {
            Toast.show('Duration period is required', Toast.LONG);
            return;
        }
        if (!time) {
            Toast.show('Time is required', Toast.LONG);
            return;
        }
        if (!dosage) {
            Toast.show('Dosage is required', Toast.LONG);
            return;
        }
        if (!unit) {
            Toast.show('Unit is required', Toast.LONG);
            return;
        } else {
            const payloadData = selectedMedicine?._id
                ? {
                      token: token,
                      medicineName: selectedMedicine?.name,
                      medicineId: selectedMedicine?._id || item?.medicineId,
                      frequency: frequency?.value || frequency,
                      consumptionTime: consumptionTime?.value || consumptionTime,
                      duration: Number(duration),
                      time: time?.value || time,
                      dosage: Number(dosage),
                      unit: unit?.value || unit,
                      additionalNote: additionalNote,
                  }
                : {
                      token: token,
                      medicineName: selectedMedicine?.name.toUpperCase(),
                      frequency: frequency?.value || frequency,
                      consumptionTime: consumptionTime?.value || consumptionTime,
                      duration: Number(duration),
                      time: time?.value || time,
                      dosage: Number(dosage),
                      unit: unit?.value || unit,
                      additionalNote: additionalNote,
                  };

            console.log('intake data', payloadData);
            // API CALL ------------------
            handlePost(payloadData);
        }
    };

    const onChangeReminderTime = (event: DateTimePickerEvent, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || time; // Use the selected time or current value
        setReminderTime(currentTime);
        setShowTimePicker(false); // Update time state
    };

    const handleUpdate = () => {
        // console.log(item);
        // const payload = {};

        try {
            console.log(reminderTime.toISOString());
            // Define user-specific storage key for this medicine
            const storageKey = `user_${userData?.hruId}_medicine_${item._id}_time_${item.remainderTime}`;
            medsIntakeStorage.set(storageKey, reminderTime.toISOString());

            Toast.show('Reminder time updated successfully!', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: [queryKey],
            });
            queryClient.invalidateQueries({
                queryKey: ['medsPresent' + 'Intake'],
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error saving to MMKV:', error);
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Medicine Name */}
                <View style={[styles.inputGroup, { opacity }]}>
                    <Text style={styles.label}>
                        Medicine Name <Text style={{ color: colors.red }}>*</Text>
                    </Text>

                    <TouchableOpacity
                        disabled={mode === 'edit' ? true : false}
                        style={styles.searchBoxContainer}
                        onPress={() => navigation.navigate('MedicineIntakeSearchScreen')}
                    >
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

                {/* Frequency and Consumption Time */}
                <View style={[styles.rowHalf, { opacity }]}>
                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Frequency <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <CustomDropdown
                            isDisabled={mode === 'edit' ? true : false}
                            data={frequencyData}
                            value={frequency}
                            setValue={setFrequency}
                            customDropdownStyle={styles.dropdown}
                        />
                    </View>

                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Consumption Time <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <CustomDropdown
                            isDisabled={mode === 'edit' ? true : false}
                            data={consumptionTimeData}
                            value={consumptionTime}
                            setValue={setConsumptionTime}
                            customDropdownStyle={styles.dropdown}
                        />
                    </View>
                </View>

                {/* Duration and Time */}
                <View style={[styles.rowHalf, { opacity }]}>
                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Duration <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <TextInput
                            editable={mode === 'edit' ? false : true}
                            style={[styles.input]}
                            // placeholder="Duration"
                            value={duration}
                            onChangeText={setDuration}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Time <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <CustomDropdown
                            isDisabled={mode === 'edit' ? true : false}
                            data={timeData}
                            value={time}
                            setValue={setTime}
                            customDropdownStyle={styles.dropdown}
                        />
                    </View>
                </View>

                {/* Dosage and Unit */}
                <View style={[styles.rowHalf, { opacity }]}>
                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Dosage <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <TextInput
                            editable={mode === 'edit' ? false : true}
                            style={[styles.input]}
                            value={dosage}
                            onChangeText={setDosage}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>
                            Unit <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <CustomDropdown
                            isDisabled={mode === 'edit' ? true : false}
                            data={unitData}
                            value={unit}
                            setValue={setUnit}
                            customDropdownStyle={styles.dropdown}
                        />
                    </View>
                </View>

                {/* Additional Note */}
                <View style={[styles.inputGroup, { opacity }]}>
                    <Text style={styles.label}>Additional Note {/* <Text style={{color: colors.red}}>*</Text> */}</Text>
                    <TextInput
                        editable={mode === 'edit' ? false : true}
                        style={styles.input}
                        // placeholder="Additional Note"
                        value={additionalNote}
                        onChangeText={setAdditionalNote}
                        multiline
                    />
                </View>

                {mode === 'edit' && (
                    <View>
                        <Text style={styles.label}>
                            Reminder Time <Text style={{ color: colors.red }}>*</Text>
                        </Text>
                        <TouchableOpacity style={styles.timeContainer} onPress={() => setShowTimePicker(true)}>
                            <Text style={styles.timeText}>{reminderTime?.toLocaleTimeString()}</Text>
                            {showTimePicker && (
                                <RNDateTimePicker
                                    value={reminderTime}
                                    mode="time" // Set the mode to 'time' for time picker
                                    display="default" // Options: 'default', 'spinner', or 'clock'
                                    onChange={onChangeReminderTime}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                <BigButton
                    title={mode === 'edit' ? 'Update' : 'Add'}
                    onPress={() => {
                        mode === 'edit' ? handleUpdate() : handleAdd();
                        // console.log('q keyu 2nd', queryKey);
                        // console.log('incoming props', item);
                    }}
                    customStyle={{
                        marginVertical: isTab ? hp(1.5) : hp(2),
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
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(2),
    },
    searchBoxContainer: {
        backgroundColor: colors.blueWhite,
        borderRadius: wp(2.5),
        padding: isTab ? wp(2) : wp(3.5),
        flex: 1,
        flexDirection: 'row',
        borderWidth: isTab ? wp(0.15) : wp(0.2),
        borderColor: colors.darkBlue,
        // elevation: 3,
    },
    searchBoxText: {
        fontSize: isTab ? wp(2.2) : wp(3.5),
        fontWeight: 'bold',
        color: colors.darkGrey,
    },
    inputGroup: {
        marginBottom: hp(1.5),
        // flex: 1,
    },
    inputGroupHalf: {
        flex: 1,
        marginBottom: hp(1.5),
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
        fontWeight: '500',
        fontSize: isTab ? wp(2.2) : wp(4.2),
        color: colors.black,
        marginBottom: isTab ? hp(0.5) : hp(1),
    },
    input: {
        borderWidth: wp(0.3),
        borderColor: colors.grey,
        borderRadius: wp(2.5),
        // padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: isTab ? wp(2.2) : wp(4),
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
        fontSize: isTab ? wp(2.2) : wp(4.2),
        color: colors.darkGreen,
        fontWeight: 'bold',
        opacity: 0.6,
    },
    title: {
        fontSize: isTab ? wp(2.5) : wp(5),
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
        fontSize: isTab ? wp(3) : wp(4),
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
        fontSize: isTab ? wp(2.2) : wp(4),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
});
