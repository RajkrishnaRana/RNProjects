import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppointmentItemProps } from '../Appointment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { getName, imageSelector } from '../../utils';
import IconText from '../IconText';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import moment, { RFC_2822 } from 'moment';
import { MedicineDataType } from './MedicineCard';
import { useAuthStore } from '../../store/authStore';
import { medsIntakeStorage } from '../../utils/MMKVStorage';
import { useNavigation } from '../../hooks/useNavigation';
import { isTab } from '../../utils/isTab';

// Props type as a discriminated union
type DashboardReminderCardProps =
    | {
          item: AppointmentItemProps;
          type?: undefined;
      }
    | {
          item: MedicineDataType;
          type: 'meds';
      };

export default function DashboardReminderCard({ item, type }: DashboardReminderCardProps) {
    const navigation = useNavigation();
    const { userData } = useAuthStore();

    const remainderTime = () => {
        const storageKey = `user_${userData?.hruId}_medicine_${item._id}_time_${item?.remainderTime}`;
        const storedTime = medsIntakeStorage.getString(storageKey);
        return storedTime ? storedTime : item?.remainderTime;
    };

    return (
        <TouchableOpacity
            onPress={() => {
                type === 'meds'
                    ? null
                    : navigation.navigate('AppointmentDetails', {
                          id: item?._id,
                      });
            }}
        >
            <View style={styles.container}>
                {type === 'meds' ? (
                    <View style={{ padding: isTab ? wp(1) : wp(2), alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../assets/icons/drug.png')}
                            style={{
                                height: isTab ? wp(4) : wp(8),
                                width: isTab ? wp(4) : wp(8),
                            }}
                            tintColor={colors.primary}
                        />
                    </View>
                ) : (
                    <Image
                        source={imageSelector(item?.doctorDetails?.profileImgPath, 'DOCTOR')}
                        style={{
                            height: isTab ? wp(7) : wp(14),
                            width: isTab ? wp(7) : wp(14),
                            borderRadius: wp(3),
                            alignSelf: 'center',
                        }}
                    />
                )}

                <View style={{ gap: hp(0.5), flexDirection: isTab ? 'row' : 'column' }}>
                    <View style={{ gap: hp(0.5) }}>
                        {type === 'meds' ? (
                            <IconText index={12} text={item?.medicineName} customTextStyles={styles.drName} />
                        ) : (
                            <IconText
                                index={5}
                                text={`${getName(
                                    item?.doctorDetails?.firstName,
                                    item?.doctorDetails?.middleName,
                                    item?.doctorDetails?.lastName,
                                    item?.doctorDetails?.doctorType,
                                )}`}
                                customTextStyles={styles.drName}
                            />
                        )}
                        {type === 'meds' ? (
                            <IconText
                                customLogo={
                                    <MaterialCommunityIcons
                                        name="av-timer"
                                        size={isTab ? wp(2.5) : wp(3.5)}
                                        color={colors.darkBlue}
                                        style={{
                                            paddingLeft: wp(0.3),
                                            paddingRight: wp(2),
                                        }}
                                    />
                                }
                                text={`Consumption Time : ${item?.consumptionTime}`}
                                customTextStyles={{
                                    width: wp(37),
                                    color: colors.black,
                                }}
                            />
                        ) : (
                            <IconText
                                customLogo={
                                    <OcticonIcons
                                        name="person"
                                        size={isTab ? wp(2.5) : wp(3.5)}
                                        color={colors.darkBlue}
                                        style={{
                                            paddingLeft: wp(0.3),
                                            paddingRight: wp(2),
                                        }}
                                    />
                                }
                                text={`Patient : ${getName(
                                    item?.patientDetails?.firstName,
                                    item?.patientDetails?.middleName,
                                    item?.patientDetails?.lastName,
                                    item?.patientDetails?.prefix,
                                )}`}
                                customTextStyles={{
                                    width: wp(37),
                                    color: colors.black,
                                }}
                            />
                        )}
                        {/* {type != 'meds' && (
                    <IconText
                        index={2}
                        text={`Booking Id : ${item?.bookingId}`}
                        customTextStyles={{
                            fontWeight: '500',
                            marginLeft: wp(1.5),
                        }}
                    />
                )} */}
                    </View>

                    <View style={styles.dateTime}>
                        <View style={styles.dateTimeContainer}>
                            <MaterialCommunityIcons
                                name="calendar-text-outline"
                                size={isTab ? wp(2) : wp(4)}
                                color={colors.primary}
                                style={styles.dateTimeIcon}
                            />

                            <Text style={styles.dateTimeText}>
                                {type == 'meds' ? moment().format('ddd, Do MMM') : moment(item?.startTime).format('ddd, Do MMM')}
                            </Text>
                        </View>
                        <View style={styles.dateTimeContainer}>
                            <MaterialCommunityIcons
                                name="clock-time-three-outline"
                                size={isTab ? wp(2) : wp(3.5)}
                                color={colors.primary}
                                style={styles.dateTimeIcon}
                            />

                            <Text style={styles.dateTimeText}>
                                {type == 'meds' ? moment(remainderTime()).format('h:mm A') : moment(item?.startTime).format('h:mm A')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(4),
        borderWidth: wp(0.1),
        borderColor: colors.grey,
        padding: isTab ? wp(1.5) : wp(3),
        flexDirection: 'row',
        gap: isTab ? wp(1.5) : wp(3),
        marginBottom: hp(1.5),
    },
    drName: {
        fontSize: isTab ? wp(2.2) : wp(4),
        color: colors.lightBlack,
        // fontWeight: 'bold',
        marginLeft: isTab ? wp(0.5) : wp(1),
        width: isTab ? wp(37) : wp(50),
    },
    dateTime: {
        flexDirection: 'row',
        backgroundColor: colors.transparentPrimary,
        paddingVertical: hp(0.8),
        width: isTab ? wp(35) : wp(68),
        borderRadius: wp(3),
        justifyContent: 'space-evenly',
        marginVertical: hp(1),
    },
    dateTimeContainer: {
        flexDirection: 'row',
        gap: wp(1.5),
        alignItems: 'center',
    },
    dateTimeIcon: {
        backgroundColor: colors.white,
        padding: isTab ? wp(0.5) : wp(1),
        borderRadius: wp(6),
    },
    dateTimeText: {
        fontWeight: '500',
        color: colors.lightBlack,
        fontSize: isTab ? wp(2) : wp(3.5),
    },
});
