import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import DateTimePicker, {
    DateType,
    useDefaultStyles,
} from 'react-native-ui-datepicker';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Bigbutton from '../Buttons/Bigbutton';
import {useDateRangeStore} from '../../store/dateRangeStore';

interface DatePickerModalProps {
    customLabel?: string;
}

type DatePickerModalType = {
    startDate: DateType;
    endDate: DateType;
};

function DatePickerModal({customLabel}: DatePickerModalProps) {
    // GLOBAL STATES -------------------------------->
    const {startDate, endDate, setDate: setDateRange} = useDateRangeStore();

    const defaultStyle = useDefaultStyles('light');
    const [isVisible, setIsVisible] = useState(false);
    const [date, setDate] = useState<DatePickerModalType>({
        startDate: startDate,
        endDate: endDate,
    });

    function formatDate(date: DateType) {
        return moment(date as Date).format('MMMM DD, YYYY');
    }

    return (
        <>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setIsVisible(true)}>
                <MaterialCommunityIcons
                    name="calendar-month"
                    size={wp(6)}
                    color={colors.primary}
                />
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                onBackdropPress={() => setIsVisible(false)}
                style={styles.modal}>
                <View style={styles.modalContent}>
                    <DateTimePicker
                        mode="range"
                        startDate={date.startDate}
                        endDate={date.endDate}
                        onChange={({startDate, endDate}) =>
                            setDate({startDate, endDate})
                        }
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
                            day_cell: {
                                padding: wp(1),
                            },
                            range_fill: {
                                backgroundColor: colors.transparentPrimary,
                                marginVertical: hp(0.5),
                            },
                            range_start: {
                                backgroundColor: colors.primary,
                                borderRadius: wp(5),
                            },
                            range_end: {
                                backgroundColor: colors.primary,
                                borderRadius: wp(5),
                            },
                        }}
                    />

                    <View style={styles.dateShowContainer}>
                        <MaterialCommunityIcons
                            name="calendar-blank"
                            size={wp(6)}
                            color={colors.darkBlue}
                        />
                        <Text style={styles.dateText}>{`${formatDate(
                            date.startDate,
                        )} - ${formatDate(date.endDate)}`}</Text>
                    </View>

                    <Bigbutton
                        title="Apply"
                        onPress={() => {
                            setDateRange(
                                date.startDate,
                                date.endDate || date.startDate,
                            );
                            console.log(
                                'startDate',
                                date.startDate?.valueOf(),
                                'endDate',
                                date.endDate?.valueOf() ||
                                    date.startDate?.valueOf(),
                            );
                            setIsVisible(false);
                        }}
                        customStyle={{
                            backgroundColor: colors.primary,
                            marginTop: hp(1),
                            marginBottom: hp(1),
                            paddingVertical: hp(1),
                            width: wp(40),
                            alignSelf: 'center',
                        }}
                        customTextStyle={{
                            color: colors.white,
                            fontWeight: 'bold',
                            fontSize: wp(4),
                        }}
                    />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        height: wp(10),
        width: wp(10),
        borderRadius: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: colors.primaryShadowColor,
    },
    label: {
        fontSize: wp(4),
        marginBottom: 5,
        color: colors.black,
        fontWeight: 'bold',
    },
    dobContainer: {
        height: hp(6.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 15,
        paddingHorizontal: wp(2),
        backgroundColor: colors.blueWhite,
    },
    input2: {
        flex: 1,
        fontSize: wp(4),
    },
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 0,
        marginHorizontal: 0,
        marginBottom: 0,
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopStartRadius: wp(5),
        borderTopEndRadius: wp(5),
        paddingTop: wp(5),
        paddingBottom: wp(3),
        paddingHorizontal: wp(5),
        height: hp(70),
    },
    dateShowContainer: {
        flexDirection: 'row',
        gap: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        alignItems: 'center',
        borderWidth: wp(0.2),
        borderColor: colors.grey,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        borderRadius: wp(3),
    },
    dateText: {
        fontSize: wp(4),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
});

export default memo(DatePickerModal);
