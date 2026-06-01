import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { useNavigation } from '../hooks/useNavigation';
import { getName, imageSelector } from '../utils';
import moment from 'moment';
import IconText from './IconText';
import { isTab } from '../utils/isTab';

interface ProfileImg {
    name: string;
    path: string;
}

interface PersonDetails {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    profileImg?: ProfileImg;
    doctorType?: string;
    profileImgPath?: string;
    prefix: string;
}

type LabProfile = {
    _id: string;
    labName: string;
    profileImg: {
        name: string;
        path: string;
    };
    profileImgPath: string;
};

export interface AppointmentItemProps {
    _id: string;
    doctorId: string;
    patientId: string;
    profileId: string;
    workAddressId: string;
    startTime: string;
    bookedBy: string;
    status: number;
    consultationMode: string;
    consultationFee: number;
    otp: string;
    bookingId: string;
    cancelCheckIn: boolean;
    patientDetails: PersonDetails;
    doctorDetails: PersonDetails;
    labDetails?: LabProfile;
    statusTxt: string;
    startTimeInMs: number;
    cancelTimeInMS: number;
    todayInMs: number;
    remainderTime?: string;
}

export default function Appointment({
    item,
    type,
    isRating = false,
    renderRatingModal,
}: {
    item: AppointmentItemProps;
    type?: 'lab' | 'patient';
    isRating?: boolean;
    renderRatingModal?: (id: string) => void;
}) {
    const navigation = useNavigation();

    // LOCAL FUNCTIONS ------------------------------>
    const backGroundColorSelector = (data: string) =>
        data.includes('Cancelled') ? colors.red : data.includes('Booked') || data.includes('Checked In') ? colors.darkBlue : colors.primary;

    const handleAppointment = () => {
        type === 'lab'
            ? navigation.navigate('LabAppointmentDetails', {
                  id: item?._id,
              })
            : navigation.navigate('AppointmentDetails', { id: item?._id });
    };
    return (
        <TouchableOpacity
            style={[styles.container, {}]}
            onPress={() => {
                isRating ? renderRatingModal && renderRatingModal(item?._id) : handleAppointment();
            }}
            activeOpacity={0.8}
        >
            <View style={[styles.bodyContainer]}>
                <View style={styles.bodyDetailContainer}>
                    {/* Doctor Image  */}
                    <View style={styles.imgContainer}>
                        <Image
                            source={
                                type === 'lab'
                                    ? imageSelector(item?.labDetails?.profileImgPath, 'LAB')
                                    : imageSelector(item?.doctorDetails?.profileImgPath, 'DOCTOR')
                            }
                            style={{
                                height: isTab ? wp(9) : wp(16),
                                width: isTab ? wp(9) : wp(16),
                                borderRadius: wp(8),
                            }}
                        />
                    </View>

                    {/* Details List */}
                    <View>
                        <Text style={styles.drName}>
                            {type === 'lab'
                                ? getName(item?.labDetails?.labName, null, '')
                                : getName(
                                      item?.doctorDetails?.firstName,
                                      item?.doctorDetails?.middleName,
                                      item?.doctorDetails?.lastName,
                                      item?.doctorDetails?.doctorType,
                                  )}
                        </Text>

                        <IconText
                            index={0}
                            text={getName(
                                item?.patientDetails?.firstName,
                                item?.patientDetails?.middleName,
                                item?.patientDetails?.lastName,
                                item?.patientDetails?.prefix,
                            )}
                        />
                        <View style={styles.bookingDetails}>
                            <IconText index={1} text={moment(item?.startTime).format('Do MMM, YYYY | h:mm A')} />
                            <IconText index={2} text={item?.bookingId} />
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.tagContainer,
                        {
                            backgroundColor: backGroundColorSelector(item?.statusTxt),
                        },
                    ]}
                >
                    <Text style={styles.statusText}>{isRating ? 'Rate Doctor' : item?.statusTxt.trim()}</Text>
                    {/* <Text style={styles.statusText}></Text> */}
                </View>

                {/* {isRating && (
                    <View style={styles.ratingContainer}>
                        <Text style={{fontWeight: 'bold', color: colors.white}}>Rate Doctor</Text>
                    </View>
                )} */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(4),
        padding: isTab ? wp(1) : wp(2),
        backgroundColor: colors.white,
        // marginBottom: hp(2),
        borderWidth: wp(0.02),
        borderColor: colors.white,
        elevation: 1,
        marginHorizontal: wp(3),
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bodyDetailContainer: {
        flexDirection: 'row',
        gap: wp(3),
        marginVertical: hp(1),
        marginLeft: hp(1),
    },
    imgContainer: {
        backgroundColor: colors.blueWhite,
        width: isTab ? wp(9) : wp(16),
        height: isTab ? wp(9) : wp(16),
        borderRadius: wp(15),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        alignSelf: 'center',
    },
    drName: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: isTab ? wp(2.5) : wp(3.8),
        maxWidth: isTab ? wp(60) : wp(40),
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    logo: {
        height: wp(3.5),
        width: wp(3.5),
        tintColor: colors.darkGrey,
    },
    tagContainer: {
        height: isTab ? hp(4) : hp(5),
        width: wp(25),
        right: wp(-1),
        top: wp(-1),
        borderTopRightRadius: wp(3),
        borderBottomLeftRadius: wp(2),
        padding: wp(1),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    statusText: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: isTab ? wp(1.8) : wp(3),
    },
    bookingDetails: { flexDirection: isTab ? 'row' : 'column', gap: isTab ? wp(3) : 0 },
});
