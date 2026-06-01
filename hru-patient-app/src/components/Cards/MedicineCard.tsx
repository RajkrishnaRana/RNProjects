import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import BigButton from '../BigButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {useNavigation} from '../../hooks/useNavigation';
import Toast from 'react-native-simple-toast';
import {postData} from '../../api';
import {BASE_URL} from '../../config';
import {useAuthStore} from '../../store/authStore';
import {useQuery} from '@tanstack/react-query';
import {queryClient} from '../../../App';
import {Description} from '../Description';
import {medsIntakeStorage} from '../../utils/MMKVStorage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {isTab} from '../../utils/isTab';

export type MedicineDataType = {
    _id: string; // Unique identifier for the record
    medicineName: string; // Name of the medicine
    frequency: string; // Medicine consumption frequency in the format "x-x-x"
    consumptionTime: string; // Time to consume the medicine (e.g., "After Food")
    dosage: string; // Amount of medicine to be taken
    unit: string; // Unit of dosage (e.g., "Tabs", "Capsules")
    duration: string; // Duration of the medicine usage
    time: string; // Time unit for the duration (e.g., "Day", "Week", "Month")
    additionalNote: string; // Optional note or comment
    medicineId: string; // Unique ID for the medicine
    startDate: number; // Start date of medicine in milliseconds (timestamp)
    endDate: number; // End date of medicine in milliseconds (timestamp)
    remainderTime: string; // Reminder time in ISO 8601 format
};

// const Description = ({header, body}: {header: string; body: string}) => {
//     return (
//         <View style={{flexDirection: 'row'}}>
//             <Text
//                 style={{
//                     fontSize: wp(3.5),
//                     color: colors.darkGrey,
//                     fontWeight: 'bold',
//                     width: wp(35),
//                 }}>
//                 {header}
//             </Text>
//             <Text style={{width: wp(4), color: colors.darkGrey}}> : </Text>
//             <Text
//                 style={{
//                     fontSize: wp(3.5),
//                     fontWeight: 'bold',
//                     color: colors.black,
//                 }}>
//                 {body}
//             </Text>
//         </View>
//     );
// };

export default function MedicineCard({item, queryKey}: {item: MedicineDataType; queryKey: string}) {
    const {token, userData} = useAuthStore();
    const navigation = useNavigation();

    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteMedicine = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                token: token,
                id: item?._id,
            };

            // Fetch the query if no cached data is found
            const url = `${BASE_URL}/hru/Patientappapi/deletemedicineintake`;
            // const url =
            //     'https://c359-2401-4900-1c85-52d4-a9b5-4d90-89c5-95db.ngrok-free.app/hru/Patientappapi/deletemedicineintake';
            const res = await postData(url, payload);

            // console.log(res);

            if (res.status) {
                console.log('Data deleted successfully---------', res);
                Toast.show('Medicine deleted successfully', Toast.SHORT);

                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
                queryClient.invalidateQueries({
                    queryKey: ['medsPresent' + 'Intake'],
                });

                setIsVisible(false);
            } else {
                Toast.show(res?.msg, Toast.SHORT);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            // Toast.show('Failed to cancel appointment', Toast.SHORT); // Show error message to the user
        } finally {
            setLoading(false);
        }
    };

    const handleAlert = (data: any) => {
        Alert.alert('Are you sure ? ', 'You want to delete this medicine ?', [
            {
                text: 'No',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    handleDeleteMedicine(data);
                },
            },
        ]);
    };

    const remainderTime = () => {
        const storageKey = `user_${userData?.hruId}_medicine_${item._id}_time_${item.remainderTime}`;
        const storedTime = medsIntakeStorage.getString(storageKey);
        return storedTime ? storedTime : item?.remainderTime;
    };

    return (
        <>
            {/* <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    setIsVisible(true);
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: wp(2),
                        alignItems: 'center',
                    }}>
                    <Image
                        source={require('../../assets/icons/plus.png')}
                        style={styles.image}
                    />
                    <View style={{width: wp(30)}}>
                        <Text style={styles.medicineName}>
                            {item?.medicineName}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        gap: hp(0.5),
                        width: wp(40),
                    }}>
                    <Text style={styles.time}>
                        {`${item?.dosage} ${item?.unit}, ${
                            item?.consumptionTime
                        } at ${moment(remainderTime()).format('hh:mm A')}`}
                    </Text>
                </View>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    setIsVisible(true);
                }}>
                {/* <Image
                    source={require('../../assets/icons/first-aid-box.png')}
                    style={styles.image}
                /> */}
                <FontAwesome name="medkit" size={30} color={colors.primary} />
                <View
                    style={{
                        gap: isTab ? 0 : hp(0.5),
                        width: wp(70),
                        flexDirection: isTab ? 'row' : 'column',
                    }}>
                    <Text style={{fontSize: isTab ? wp(2.5) : wp(3.5), color: colors.black, width: wp(44)}}>
                        <Text style={styles.medicineName}>{item?.medicineName}</Text>
                    </Text>
                    <Text style={styles.time}>
                        {`${item?.dosage} ${item?.unit}, ${item?.consumptionTime} at ${moment(remainderTime()).format('hh:mm A')}`}
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                style={{flex: 1}}>
                <View style={styles.modalBody}>
                    <Image source={require('../../assets/images/medicine.png')} style={styles.modalImage} />

                    {/* <Text style={styles.modalHeader}>
                        Medicine Intake Details
                    </Text> */}

                    {/* MEDICINE DETAILS -------------------------------- */}
                    <View style={{gap: hp(0.5), marginLeft: wp(2)}}>
                        <Description header="Medicine Name" body={item.medicineName} />
                        <Description header="Frequency" body={item?.frequency} />
                        <Description header="Consumption Time" body={item?.consumptionTime} />
                        <Description header="Dosage" body={`${item?.dosage} ${item?.unit}`} />
                        <Description header="Duration" body={`${item?.duration} ${item?.time}`} />
                        <Description header="Additional Details" body={item?.additionalNote} />
                    </View>

                    <View style={styles.buttonContainer}>
                        {/* DELETE MEDICINE--------------------------------- */}
                        <BigButton
                            customIcon={<MaterialCommunityIcons name="delete" size={isTab ? wp(3) : wp(5.5)} color={colors.white} />}
                            onPress={() => {
                                handleAlert(item);
                            }}
                            customStyle={styles.button}
                            loading={loading}
                        />

                        {/* EDIT MEDICINE--------------------------------- */}
                        <BigButton
                            customIcon={<MaterialCommunityIcons name="pencil" size={isTab ? wp(3) : wp(5)} color={colors.white} />}
                            onPress={() => {
                                // console.log('edit log---', item);

                                navigation.navigate('CreateMedicineItakeScreen', {
                                    item: item,
                                    mode: 'edit',
                                });
                                setIsVisible(false);
                            }}
                            customStyle={styles.button}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // borderWidth: wp(0.2),
        borderColor: colors.grey,
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        backgroundColor: colors.white,
        borderWidth: wp(0.01),
        borderRadius: wp(3),
        gap: wp(3),
        marginBottom: isTab ? hp(0.5) : hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        // width: wp(45),
        elevation: 1.5,
        marginHorizontal: wp(2),
        marginVertical: hp(0.1),
    },
    image: {
        height: isTab ? wp(5) : wp(8),
        width: isTab ? wp(5) : wp(8),
    },
    modalImage: {
        height: isTab ? wp(15) : wp(25),
        width: isTab ? wp(15) : wp(25),
        alignSelf: 'center',
        marginTop: hp(1),
        marginBottom: hp(3),
    },
    medicineName: {
        fontSize: isTab ? wp(2) : wp(3.5),
        // fontWeight: 'bold',
        width: wp(60),
        color: colors.black,
    },
    time: {
        // textAlign: 'right',
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3.5),
    },
    modalBody: {
        backgroundColor: colors.white,
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
        borderRadius: wp(3),
    },
    modalHeader: {
        fontSize: isTab ? wp(3.5) : wp(3.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
        textAlign: 'center',
        marginBottom: hp(1.5),
    },
    button: {
        width: wp(25),
        backgroundColor: colors.primary,
        paddingVertical: hp(1),
        marginTop: hp(2),
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: wp(5),
        justifyContent: 'center',
    },
});
