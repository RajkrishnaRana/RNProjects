import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import {useAuthStore} from '../../store/authStore';
import {useNavigation} from '../../hooks/useNavigation';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Description} from '../Description';
import BigButton from '../BigButton';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../../config';
import {postData} from '../../api';
import {queryClient} from '../../../App';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {isTab} from '../../utils/isTab';

interface Props {
    data: MedicineReminder;
    queryKey: string;
}

export default function MedicineRefillCard({data, queryKey}: Props) {
    const {token} = useAuthStore();
    const navigation = useNavigation();

    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // LOCAL FUNCTIONS ------------------------------->
    const handleDeleteMedicine = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                token: token,
                id: data?._id,
            };

            // Fetch the query if no cached data is found
            const url = `${BASE_URL}/hru/Patientappapi/deletemedicinerefill`;
            const res = await postData(url, payload);

            console.log(res);

            if (!res.status) {
                Toast.show(res?.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            if (res.status) {
                // console.log('Data deleted successfully---------');
                Toast.show('Medicine deleted successfully', Toast.SHORT);

                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
                queryClient.invalidateQueries({
                    queryKey: ['medsPresent' + 'Refill'],
                });

                setIsVisible(false);
            } else {
                Toast.show(res?.msg, Toast.SHORT);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
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

    return (
        <>
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
                <View style={{flexDirection: isTab ? 'row' : 'column'}}>
                    <Text style={{fontSize: isTab ? wp(2) : wp(3.5), color: colors.darkGrey, width: isTab ? wp(47) : 'auto'}}>
                        <Text style={styles.medicineName}>{data?.medicineName}</Text>
                    </Text>
                    <Text style={{fontSize: isTab ? wp(2) : wp(3.5), color: colors.darkGrey}}>
                        Reminder Time : <Text style={styles.medicineName}>{moment(data?.remainderTime).format('hh:mm A')}</Text>
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                onBackdropPress={() => setIsVisible(false)}
                style={{flex: 1}}>
                <View style={styles.modalBody}>
                    {/* <Text style={styles.modalHeader}>
                        Medicine Reminder Details
                    </Text> */}

                    {/* MEDICINE DETAILS -------------------------------- */}
                    <View style={{gap: hp(0.5)}}>
                        <Image source={require('../../assets/images/medicine.png')} style={styles.modalImage} />
                        <Description header="Medicine Name" body={data?.medicineName} />
                        <Description header="Reminder Date" body={moment(data?.remainderDate).format('Do MMM, YYYY')} />
                        <Description header="Reminder Time" body={moment(data?.remainderTime).format('hh:mm A')} />
                        <Description header="Quantity" body={`${data?.quantity}`} />
                        <Description header="Pescribed By" body={data?.pescribedby} />
                    </View>

                    <View style={styles.buttonContainer}>
                        {/* DELETE MEDICINE--------------------------------- */}
                        <BigButton
                            customIcon={<MaterialCommunityIcons name="delete" size={isTab ? wp(3.5) : wp(5.5)} color={colors.white} />}
                            onPress={() => handleAlert(data)}
                            customStyle={styles.button}
                            loading={loading}
                        />

                        {/* EDIT MEDICINE--------------------------------- */}
                        <BigButton
                            customIcon={<MaterialCommunityIcons name="pencil" size={isTab ? wp(3) : wp(5)} color={colors.white} />}
                            onPress={() => {
                                // console.log('edit log---', item);

                                navigation.navigate('CreateMedicineRefillScreen', {
                                    item: data,
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
        elevation: 1.5,
        borderRadius: wp(3),
        gap: wp(3),
        marginBottom: isTab ? hp(0.5) : hp(1),
        flexDirection: 'row',
        alignItems: 'center',
    },
    medicineName: {
        fontSize: isTab ? wp(2) : wp(3.5),
        // fontWeight: 'bold',
        color: colors.black,
    },
    time: {
        // textAlign: 'right',
        color: colors.black,
        fontSize: wp(3.5),
    },
    modalBody: {
        backgroundColor: colors.white,
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
        borderRadius: wp(3),
    },
    modalHeader: {
        fontSize: isTab ? wp(3.5) : wp(4.5),
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
    image: {
        height: wp(8),
        width: wp(8),
    },
    modalImage: {
        height: isTab ? wp(15) : wp(25),
        width: isTab ? wp(15) : wp(25),
        alignSelf: 'center',
        marginTop: hp(1),
        marginBottom: hp(3),
    },
});
