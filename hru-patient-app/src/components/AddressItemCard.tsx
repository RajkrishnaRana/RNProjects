import { StyleSheet, Text, View } from 'react-native';
import React, { memo, useState } from 'react';
import { colors } from '../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Tag from './Tag';
import { getName } from '../utils';
import { useNavigation } from '../hooks/useNavigation';
import DeleteModal from './Modal/DeleteModal';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../config';
import { postData } from '../api';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../App';
import { isTab } from '../utils/isTab';

interface Props {
    item: Address;
    stateData: StateCodes[];
}

function AddressItemCard({ item, stateData }: Props) {
    const navigation = useNavigation();

    // GLOBAL STATES ---------------------------->
    const { token } = useAuthStore();

    // LOCAL STATES ----------------------------->
    const [isModalVisible, setModalVisible] = useState(false);

    // LOCAL FUNCTIONS ------------------------------->
    const handleEditButton = () => {
        navigation.navigate('AddAddress', {
            mode: 'edit',
            item: item,
            stateData: stateData,
        });
    };

    const handleDeleteButton = async () => {
        try {
            const dataToPost = {
                token: token,
                addressId: item.id,
            };

            const url = `${BASE_URL}/hru/Patientappapi/deleteaddress`;

            const res = await postData(url, dataToPost);
            if (res.status) {
                queryClient.invalidateQueries({
                    queryKey: ['addressData'],
                });
                Toast.show('Address deleted successfully', Toast.SHORT);
            }
        } catch (error) {
            Toast.show('Failed to delete address', Toast.SHORT);
            console.error(error);
        } finally {
        }
    };

    return (
        <View style={styles.addressContainer}>
            <View style={styles.addressDetailsContainer}>
                <View style={{ width: isTab ? wp(65) : wp(60) }}>
                    <Text style={styles.headerText}>{getName(item?.firstName, item?.middleName, item?.lastName)}</Text>
                    <Text style={styles.bodyText}>{item.addressLineOne}</Text>
                    {/* <Text style={styles.bodyText}>
                        {item.city}, {item.state}
                    </Text> */}
                    <Text style={styles.bodyText}>{item.pinCode}</Text>
                    {/* <Text style={styles.bodyText}>India</Text> */}
                </View>
                <View style={styles.buttonContainer}>
                    <MaterialIcons
                        name="edit"
                        size={isTab ? wp(3) : wp(5)}
                        color={colors.darkBlue}
                        style={styles.editIcon}
                        onPress={handleEditButton}
                    />
                    <MaterialIcons
                        name="delete"
                        size={isTab ? wp(3) : wp(5)}
                        color={colors.red}
                        style={styles.editIcon}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                </View>
            </View>
            <View style={styles.tagContainer}>
                {item?.isPrimaryAdd && <Tag backgroundColor={colors.primary} title="Primary Address" />}
                {item?.isBillingAdd && <Tag backgroundColor={colors.darkBlue} title="Default Billing" />}
                {item?.isShippingAdd && <Tag backgroundColor={colors.green} title="Default Shipping" />}
            </View>

            <DeleteModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} deleteFunction={handleDeleteButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    addressContainer: {
        backgroundColor: colors.white,
        borderRadius: wp(5),
        padding: isTab ? wp(3) : wp(4),
        marginHorizontal: wp(5),
        marginBottom: isTab ? hp(1) : hp(2),
        borderWidth: wp(0.15),
        borderColor: colors.white,
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    addressDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        color: colors.black,
        // fontWeight: 'bold',
    },
    bodyText: { fontSize: isTab ? wp(1.8) : wp(3.2), color: colors.darkGrey },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: wp(2),
    },
    editIcon: {
        padding: isTab ? wp(1.5) : wp(2),
        backgroundColor: colors.white,
        borderRadius: wp(6),
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        elevation: 3,
    },
    deleteIcon: {
        padding: wp(2),
        backgroundColor: colors.white,
        borderRadius: wp(6),
    },
    tagContainer: {
        flexDirection: 'row',
        marginTop: isTab ? hp(0.5) : hp(1),
        justifyContent: 'space-evenly',
    },
});

export default memo(AddressItemCard);
