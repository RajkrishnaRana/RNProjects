import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import BigButton from '../BigButton';
import {queryClient} from '../../../App';
import Modal from 'react-native-modal';
import DateTimePicker, {DateType, useDefaultStyles} from 'react-native-ui-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import CustomDropdown from '../CustomDropdown';
import {isNewBackTitleImplementation} from 'react-native-screens';
import {isTab} from '../../utils/isTab';

interface Props {
    startDate: DateType;
    setStartDate: React.Dispatch<React.SetStateAction<DateType>>;
    endDate: DateType;
    setEndDate: React.Dispatch<React.SetStateAction<DateType>>;
    type?: 'lab' | undefined;
}

export default function AppointmentFilterModal({startDate, setStartDate, endDate, setEndDate, type}: Props) {
    const defaultStyle = useDefaultStyles('light');
    const [isModalVisible, setModalVisible] = useState(false);

    const handlePress = () => {
        queryClient.invalidateQueries({queryKey: [type == 'lab' ? 'labAppointmentData' : 'appointmentData']});
        setModalVisible(!isModalVisible);
    };

    function formatDate(date: DateType) {
        return moment(date as Date).format('MMMM DD, YYYY');
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Filter</Text>
                <MaterialIcons name="sort" size={isTab ? wp(3) : wp(5)} color={colors.darkBlue} />
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.modal}>
                <View style={styles.modalContent}>
                    <DateTimePicker
                        mode="range"
                        startDate={startDate}
                        endDate={endDate}
                        onChange={({startDate, endDate}) => {
                            setStartDate(startDate);
                            setEndDate(endDate || startDate);
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
                        <MaterialCommunityIcons name="calendar-blank" size={isTab ? wp(3) : wp(6)} color={colors.darkBlue} />
                        <Text style={styles.dateText}>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</Text>
                    </View>

                    {/* <View>
                        <Text>Sorted By : </Text>
                        <CustomDropdown />
                    </View> */}

                    <BigButton
                        title="Apply"
                        onPress={handlePress}
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
                            fontSize: isTab ? wp(3) : wp(4),
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        borderRadius: wp(3),
        paddingVertical: isTab ? wp(1) : wp(2),
        paddingHorizontal: wp(3),
        backgroundColor: colors.blueWhite,
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 0,
        marginHorizontal: 0,
        marginBottom: 0,
    },
    modalButtonText: {
        fontSize: isTab ? wp(2.5) : wp(3.7),
        fontWeight: 'bold',
        color: colors.darkBlue,
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
        fontSize: isTab ? wp(2.5) : wp(4),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
});
