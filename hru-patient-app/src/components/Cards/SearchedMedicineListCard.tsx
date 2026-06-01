import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { BASE_URL } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../../App';
import { useAuthStore } from '../../store/authStore';

const SearchedMedicineListCard = ({
    data: medicineData,
    specialityScreen = false,
    topRatedViewAllScreen = false,
}: {
    data: any;
    specialityScreen?: boolean;
    topRatedViewAllScreen?: boolean;
}) => {
    if (!medicineData?.mrp) return null;

    const [isSaveForLater, setIsSaveForLater] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log('search list data', medicineData);

    // GLOBAL STATES ---------------------------->
    const { token, isAuthenticated } = useAuthStore();

    const handleAddToCart = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/medicine-add-to-cart`;

        const payload: object = {
            medicineDetails: {
                name: medicineData?.name,
                _id: medicineData?._id,
            },
            token: isAuthenticated ? token : null,
        };
        try {
            setLoading(true);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }
            setLoading(false);
            Toast.show('Added to cart', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['medCartData' + medicineData?._id],
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveForLater = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/medicine-add-to-save-for-later`;

        const payload: object = {
            medicineDetails: {
                name: medicineData?.name,
                _id: medicineData._id,
            },
            token: isAuthenticated ? token : null,
        };
        try {
            setLoading(true);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }
            setLoading(false);
            Toast.show('Added to Save For later', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['medSaveForLater' + medicineData?._id],
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <View style={styles.container}>
            <Image style={styles.medicineImg} source={require('../../assets/images/medicine_placeholder.jpg')} />
            <View style={styles.medInfo}>
                <View>
                    <Text style={styles.medName}>{medicineData?.name}</Text>
                    <Text style={styles.saleInfo} numberOfLines={1} ellipsizeMode="tail">
                        {medicineData?.salt}
                    </Text>
                    {medicineData?.mrp || medicineData?.rxRequire ? (
                        <View style={styles.innerWrapper}>
                            <Text style={styles.RxRequired}>{medicineData?.rxRequire ? 'Rx Required' : ''}</Text>
                            {medicineData?.mrp && <Text style={styles.mrp}>₹{medicineData?.mrp}</Text>}
                        </View>
                    ) : (
                        ''
                    )}
                </View>
                <View style={styles.buttonSection}>
                    <TouchableOpacity style={styles.saveButtton} activeOpacity={0.3} onPress={handleSaveForLater}>
                        <FontAwesome name="bookmark-o" size={wp(4.2)} />
                        {/* <Text style={styles.buttonText}>Save for later</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cartButttons} activeOpacity={0.6} onPress={handleAddToCart}>
                        <Feather name="shopping-cart" size={wp(4.5)} color={colors.white} />
                        <Text style={styles.buttonText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SearchedMedicineListCard;

const styles = StyleSheet.create({
    container: {
        margin: wp(3),
        flexDirection: 'row',
        minHeight: hp(16),
        marginBottom: 0,
        borderRadius: wp(3),
        gap: 8,
        backgroundColor: colors.white,
        padding: 3,
        boxShadow: '0px 0px 6px rgb(228, 245, 255)',
    },
    medicineImg: {
        height: '100%',
        width: '28%',
        objectFit: 'cover',
        borderTopLeftRadius: wp(3),
        borderBottomLeftRadius: wp(3),
    },
    medInfo: {
        width: '70%',
        justifyContent: 'space-around',
        padding: wp(1),
    },
    medName: {
        fontSize: wp(4.5),
        fontWeight: '600',
    },
    saleInfo: {
        color: ' rgb(50, 141, 194)',
        fontWeight: '600',
    },
    innerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    RxRequired: {},
    mrp: {
        fontSize: wp(5),
        fontWeight: '600',
        marginRight: wp(3),
        color: 'rgb(4, 124, 34)',
    },
    buttonSection: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: wp(1),
        // backgroundColor: 'red',
        paddingRight: wp(2),
    },
    saveButtton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        backgroundColor: 'rgb(194, 205, 211)',
        height: hp(4.5),
        width: hp(4.5),
        borderRadius: wp(5),
    },
    cartButttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: colors.primary,
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(5),
        borderRadius: wp(5),
    },
    buttonText: {
        fontSize: wp(4.3),
        color: ' rgb(255, 255, 255)',
    },
});
