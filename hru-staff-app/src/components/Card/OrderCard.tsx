import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SegmentedControl from '../SegmentedControl';
import {getName} from '../../utils';
import moment from 'moment';
import Bigbutton from '../Buttons/Bigbutton';
import {useNavigation} from '../../hooks/useNavigation';
import {Details} from '../Details';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import Toast from 'react-native-simple-toast';
import CustomDropdown from '../CustomDropdown';
import {useAuthStore} from '../../store/authStore';

// type OptionListProps = {
//     name: string;
//     index: number;
// };

// const option: OptionListProps[] = [
//     {
//         name: 'Assigned',
//         index: 0,
//     },
//     {
//         name: 'Sample Collected',
//         index: 1,
//     },
//     {
//         name: 'Not Collected',
//         index: 2,
//     },
// ];

type Reason = {
    _id: string;
    createdAt: Date;
    isActive: boolean;
    name: string;
};

interface Props {
    item: AppointmentData;
    notCollectedOrdersReason?: {status: boolean; docs: Reason[]};
    selectOption: number;
}

function OrderCard({item, notCollectedOrdersReason, selectOption}: Props) {
    const navigation = useNavigation();

    // GLOBAL STATES ----------------------------->
    const {loginData, login} = useAuthStore();

    //LOCAL STATES ------------------------------>
    // const [selectOption, setSelectOption] = useState(
    //     item?.sampleCollectionStatus === true
    //         ? 1
    //         : item?.sampleCollectionStatus === false
    //         ? 2
    //         : 0,
    // );
    // const [isLoading, setLoading] = useState(false);
    // const [reason, setReason] = useState(notCollectedOrdersReason?.docs[0]);

    // LOCAL FUNCITONS ------------------------------->
    const formattedDate = moment(item?.appointmentDetails?.startTime).format(
        'D MMM, YYYY',
    );
    const formattedTime = moment(item?.appointmentDetails?.startTime).format(
        'h:mm A',
    );
    const testNames = item?.appointmentDetails?.labTests
        ?.map(test => test.testName)
        .join(', ');

    // For the not collected orders
    // const notCollectedOrderSubmit = async () => {
    //     try {
    //         setLoading(true);
    //         const payload = {
    //             appointmentId: item.appointmentId,
    //             phlebotomist: item?.phlebotomist,
    //             sampleCollectionStatus: false,
    //             status: 6,
    //             reason: reason?.name,
    //         };
    //         const url = `${BETA_BASE_URL}/hru/Labstaffappapi/savesamplecollection`;
    //         const res = await postData(url, payload);
    //         if (res.status) {
    //             const loginUrl = `${BETA_BASE_URL}/hru/Labstaffappapi/login`;
    //             const res = await postData(loginUrl, loginData);
    //             // console.log(res);
    //             if (res.status) {
    //                 // console.log(res);
    //                 login(res?.data);
    //             } else {
    //                 Toast.show(`${res?.status}: ${res?.msg}`, Toast.SHORT);
    //             }
    //         } else {
    //             Toast.show(`${res?.status}: ${res?.msg}`, Toast.SHORT);
    //             console.error(res);
    //         }
    //     } catch (error) {
    //         Toast.show('Something went wrong', Toast.LONG);
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    //SIDE EFFECTS ---------------------->
    // useEffect(() => {
    //     setSelectOption(
    //         item?.sampleCollectionStatus === true
    //             ? 1
    //             : item?.sampleCollectionStatus === false
    //             ? 2
    //             : 0,
    //     );
    // }, [item]);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {opacity: item?.sampleCollectionStatus ? 0.7 : 1},
            ]}
            disabled={selectOption === 1}
            activeOpacity={0.7}
            onPress={() => navigation.push('Order Details', {item})}>
            <View style={{marginBottom: hp(1), marginLeft: wp(1)}}>
                <Text style={styles.headerText}>
                    Order No : <Text>{item.appointmentDetails?.bookingId}</Text>
                </Text>
            </View>

            {/* Assigned | Sample Collected | Not Collected Selection Section */}
            {/* <SegmentedControl
                options={option}
                selectOptions={selectOption}
                onOptionPress={setSelectOption}
                disable={item?.sampleCollectionStatus === true}
            /> */}

            {/* Assigned Option View */}

            <View style={styles.detailView}>
                <Details
                    header="Customer Name"
                    details={getName(
                        item?.patientDetails?.firstName,
                        item?.patientDetails?.middleName,
                        item?.patientDetails?.lastName,
                    )}
                />
                <Details
                    header="Appointment Date"
                    details={`${formattedDate}`}
                />
                <Details
                    header="Appointment Time"
                    details={`${formattedTime}`}
                />
                <Details header="Test Names" details={testNames} />
                <Details
                    header="Order Amount"
                    details={item?.appointmentDetails?.invoice?.totalCharges}
                />
                <Details header="Payment Mode" details="Online" />
            </View>

            {/* Sample Collected Option View */}
            {selectOption === 1 && (
                <View style={[styles.detailView]}>
                    <Text style={[styles.collectionText]}>
                        {item?.sampleCollectionStatus
                            ? `Sample Collected on ${moment(
                                  item?.sampleCollectedDate,
                              ).format('D MMM, YYYY')}`
                            : 'Sample Not Collected Yet'}
                    </Text>
                </View>
            )}

            {/* Not Collected Option View */}
            {selectOption === 2 && (
                <View style={{marginTop: hp(2)}}>
                    {item?.sampleCollectionStatus === false ? (
                        <Text style={styles.collectionText}>
                            Reason for not collection is submitted
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.headingText}>
                                Select Your Reason :
                            </Text>
                            {/* {notCollectedOrdersReason?.docs?.length > 0 ? (
                                <>
                                    <>
                                        <CustomDropdown
                                            customDropdownStyle={
                                                styles.customTextInput
                                            }
                                            customSelectedTextStyle={
                                                styles.customDropdownText
                                            }
                                            data={
                                                notCollectedOrdersReason?.docs
                                            }
                                            label={null}
                                            value={reason?._id}
                                            setValue={setReason}
                                            customLabelField="name" // Define the field in data representing the label
                                            customValueField="_id" // Define the field in data representing the value
                                        />

                                        <Bigbutton
                                            title="Submit"
                                            onPress={notCollectedOrderSubmit}
                                            customStyle={styles.customButton}
                                            loading={isLoading}
                                        />
                                    </>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.collectionText}>
                                        No Reason Found
                                    </Text>
                                </>
                            )} */}
                        </>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        boxShadow: colors.primaryShadowColor2,
        marginBottom: hp(1.5),
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        borderRadius: wp(5),
        marginHorizontal: wp(3),
    },
    headerText: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    detailView: {
        marginTop: hp(1),
        marginHorizontal: wp(3),
        gap: hp(0.5),
    },
    headingText: {
        fontSize: wp(4.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    collectionText: {
        fontSize: wp(4),
        color: colors.darkGrey,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    customTextInput: {
        boxShadow: colors.primaryShadowColor2,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        marginVertical: hp(1),
        borderRadius: wp(5),
    },
    customDropdownText: {
        fontSize: wp(4),
        color: colors.black,
        fontWeight: 'bold',
    },
    customButton: {
        marginTop: hp(2),
        width: wp(50),
        alignSelf: 'center',
        paddingVertical: hp(1),
    },
});

export default memo(OrderCard);
