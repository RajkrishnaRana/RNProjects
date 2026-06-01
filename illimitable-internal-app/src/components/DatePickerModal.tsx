import {StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, TouchableWithoutFeedback} from 'react-native';
import React, {memo, useState} from 'react';
import dayjs from 'dayjs';
// import DateTimePicker from 'react-native-ui-datepicker';
import {Colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IconFeather from 'react-native-vector-icons/Feather';

interface DatePickerModalProps {
    customLabel?: string;
    date: dayjs.Dayjs;
    minimumDate: dayjs.Dayjs;
    setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}

function DatePickerModal({date, setDate, customLabel, minimumDate}: DatePickerModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    let today = new Date();
    return (
        <>
            <View style={{width: wp(45)}}>
                {customLabel && <Text style={styles.label}>{customLabel || ''}</Text>}
                <TouchableOpacity
                    onPress={() => {
                        setIsVisible(!isVisible);
                    }}>
                    <View style={styles.dobContainer}>
                        <Text style={styles.input2}>{dayjs(date).format('DD/MM/YYYY')}</Text>

                        <IconFeather name="calendar" size={wp(8.2)} color={Colors.LIGHT_BLUE} />
                    </View>
                </TouchableOpacity>
            </View>

            <Modal visible={isVisible} transparent animationType="fade">
                <TouchableOpacity style={styles.modal} onPress={() => setIsVisible(!isVisible)}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <DateTimePicker
                                mode="single"
                                date={date}
                                onChange={params => {
                                    setDate(dayjs(params.date, 'YYYY-MM-DD').toDate().getTime());
                                    // setDate(dayjs(params.date, 'YYYY-MM-DD'));
                                    console.log(params.date);
                                    setIsVisible(!isVisible);
                                }}
                                minDate={minimumDate} // Disable previous dates
                                // styles={{
                                //     // weekday_label:{

                                //     // },
                                //     today: {
                                //         borderWidth: 2,
                                //         borderColor: Colors.LIGHT_BLUE,
                                //         borderRadius: wp(20),
                                //         borderStyle: 'dashed',
                                //     },
                                //     selected: {
                                //         backgroundColor: Colors.LIGHT_BLUE,
                                //         borderRadius: wp(20),
                                //         // height: wp(5),
                                //     }, // Highlight the selected day
                                //     selected_label: {color: 'white'}, // Highlight the selected day label
                                // }}
                                styles={{
                                    container: {
                                        margin: wp(3), // Adds spacing around the DateTimePicker component
                                    },
                                    weekday_label: {
                                        color: Colors.LIGHT_BLUE, // Neutral gray for weekdays
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    },
                                    today: {
                                        borderWidth: wp(0.5),
                                        borderColor: Colors.LIGHT_BLUE, // A bright blue border for today's date
                                        borderRadius: wp(50), // Rounded edges for a softer look
                                        borderStyle: 'dashed',
                                        padding: 5, // Adds spacing inside the border
                                    },
                                    selected: {
                                        backgroundColor: Colors.LIGHT_BLUE, // Highlight selected date with a light blue color
                                        borderRadius: wp(50), // Rounded edges for a softer look
                                        // paddingVertical: 5,
                                        // paddingHorizontal: 10,
                                    },
                                    selected_label: {
                                        color: 'white', // White text for contrast on the blue background
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    },
                                    disabled_date: {
                                        color: 'red', // Light gray for disabled dates
                                        textDecorationLine: 'line-through', // Cross out disabled dates
                                    },
                                    header: {
                                        backgroundColor: Colors.DARK_BLUE, // Dark blue header for contrast
                                        paddingVertical: 10,
                                        paddingHorizontal: 15,
                                        borderRadius: wp(10),
                                    },
                                    // header_label: {
                                    //     color: Colors.LIGHT_BLUE, // White text in the header
                                    //     fontSize: 16,
                                    //     fontWeight: 'bold',
                                    //     textAlign: 'center',
                                    // },
                                }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(4),
        marginBottom: 5,
        color: 'black',
        fontWeight: 'bold',
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
    modal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: hp(50),
        backgroundColor: 'white',
        borderRadius: wp(6),
        padding: wp(3),
        margin: wp(6),
    },
});

export default memo(DatePickerModal);
