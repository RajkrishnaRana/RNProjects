import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import CustomDropdown from '../../components/CustomDropdown';
import BigButton from '../BigButton';

export default function CreateMedicineItakeModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [medicineName, setMedicineName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [consumptionTime, setConsumptionTime] = useState('');
    const [duration, setDuration] = useState('');
    const [time, setTime] = useState('');
    const [dosage, setDosage] = useState('');
    const [unit, setUnit] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');

    const frequencyData = [
        {sName: '1-0-0', code: '1-0-0'},
        {sName: '0-1-0', code: '0-1-0'},
        {sName: '0-0-1', code: '0-0-1'},
        {sName: '1-0-1', code: '1-0-1'},
        {sName: '1-1-1', code: '1-1-1'},
        {sName: '1-1-0', code: '1-1-0'},
        {sName: '0-1-1', code: '0-1-1'},
        {sName: '4 Times', code: '4 Times'},
        {sName: '5 Times', code: '5 Times'},
        {sName: '6 Times', code: '6 Times'},
        {sName: 'SOS', code: 'SOS'},
        {sName: 'Once A Week', code: 'Once A Week'},
        {sName: 'Alt. Day', code: 'Alt. Day'},
    ];
    const consumptionTimeData = [
        {sName: 'Before Food', code: 'Before Food'},
        {sName: 'After Food', code: 'After Food'},
        {sName: 'Empty Stomach', code: 'Empty Stomach'},
        {sName: 'Bed Time', code: 'Bed Time'},
        {sName: 'Any Time', code: 'Any Time'},
    ];
    const timeData = [
        {sName: 'Day', code: 'Day'},
        {sName: 'Week', code: 'Week'},
        {sName: 'Month', code: 'Month'},
        {sName: 'Year', code: 'Year'},
    ];
    const unitData = [
        {sName: 'Tabs', code: 'Tabs'},
        {sName: 'Caps', code: 'Caps'},
        {sName: 'Inj', code: 'Inj'},
        {sName: 'ML', code: 'ML'},
        {sName: 'TS', code: 'TS'},
        {sName: 'Drops', code: 'Drops'},
        {sName: 'Puff', code: 'Puff'},
        {sName: 'Local App', code: 'Local App'},
    ];

    const handleAdd = () => {
        // Handle form submission logic here
        console.log({
            medicineName,
            frequency,
            consumptionTime,
            duration,
            time,
            dosage,
            unit,
            additionalNote,
        });
        setIsVisible(false); // Close modal after adding
    };

    return (
        <>
            <AntDesignIcon
                name="pluscircle"
                size={wp(7)}
                color={colors.primary}
                onPress={() => setIsVisible(true)}
            />

            <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                onBackButtonPress={() => setIsVisible(false)}
                style={styles.modal}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create Medicine Intake</Text>

                    {/* Medicine Name */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Medicine Name{' '}
                            <Text style={{color: colors.red}}>*</Text>
                        </Text>

                        <TextInput
                            style={styles.input}
                            // placeholder="Medicine Name"
                            value={medicineName}
                            onChangeText={setMedicineName}
                        />
                    </View>

                    {/* Frequency and Consumption Time */}
                    <View style={styles.rowHalf}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Frequency{' '}
                                <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <CustomDropdown
                                // label="Frequency *"
                                data={frequencyData}
                                customLabelField="sName"
                                customValueField="code"
                                value={frequency}
                                setValue={setFrequency}
                                customDropdownStyle={styles.dropdown}
                            />
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Consumption Time{' '}
                                <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <CustomDropdown
                                // label="Consumption Time *"
                                data={consumptionTimeData}
                                customLabelField="sName"
                                customValueField="code"
                                value={consumptionTime}
                                setValue={setConsumptionTime}
                                customDropdownStyle={styles.dropdown}
                            />
                        </View>
                    </View>

                    {/* Duration and Time */}
                    <View style={styles.rowHalf}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Duration{' '}
                                <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input]}
                                // placeholder="Duration"
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Time <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <CustomDropdown
                                // label="Time"
                                data={timeData}
                                customLabelField="sName"
                                customValueField="code"
                                value={time}
                                setValue={setTime}
                                customDropdownStyle={styles.dropdown}
                            />
                        </View>
                    </View>

                    {/* Dosage and Unit */}
                    <View style={styles.rowHalf}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Dosage{' '}
                                <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input]}
                                // placeholder="Dosage"
                                value={dosage}
                                onChangeText={setDosage}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                Unit <Text style={{color: colors.red}}>*</Text>
                            </Text>
                            <CustomDropdown
                                // label="Unit *"
                                data={unitData}
                                customLabelField="sName"
                                customValueField="code"
                                value={unit}
                                setValue={setUnit}
                                customDropdownStyle={styles.dropdown}
                            />
                        </View>
                    </View>

                    {/* Additional Note */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Additional Note{' '}
                            {/* <Text style={{color: colors.red}}>*</Text> */}
                        </Text>
                        <TextInput
                            style={styles.input}
                            // placeholder="Additional Note"
                            value={additionalNote}
                            onChangeText={setAdditionalNote}
                            multiline
                        />
                    </View>

                    <BigButton
                        title="Add"
                        onPress={handleAdd}
                        loading={false}
                    />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        borderRadius: wp(3),
    },
    modal: {
        padding: wp(1),
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
        fontWeight: 'bold',
        fontSize: wp(4.2),
        color: '#6B6B6B',
        marginBottom: hp(1),
    },
    input: {
        borderWidth: wp(0.3),
        borderColor: colors.grey,
        borderRadius: wp(2.5),
        // padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.darkBlue,
        height: hp(6),
        width: wp(38),
        paddingHorizontal: wp(2),
    },
    inputNonEditable: {
        borderWidth: wp(0.5),
        borderColor: colors.darkGreen,
        borderRadius: wp(2),
        padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: wp(4.2),
        color: colors.darkGreen,
        fontWeight: 'bold',
        opacity: 0.6,
    },
    title: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: hp(2),
        textAlign: 'center',
    },
    dropdown: {
        width: wp(38),
        height: hp(6),
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: wp(3),
        backgroundColor: colors.blueWhite,
    },
    addButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: hp(1.5),
        borderRadius: wp(1),
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.white,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
});
