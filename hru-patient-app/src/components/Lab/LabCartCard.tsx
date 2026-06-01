import {Image, StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import BigButton from '../BigButton';
import {BASE_URL} from '../../config';
import {useAuthStore} from '../../store/authStore';
import {postData} from '../../api';
import {queryClient} from '../../../App';
import Toast from 'react-native-simple-toast';

export default function LabCartCard({item}: {item: LabBookingType}) {
    //GLOBAL STATES ---------------------------->
    const {token} = useAuthStore();

    // LOCAL STATES -------------------------->
    const [loading, setLoading] = useState({
        removeFromCart: false,
        saveForLater: false,
    });

    // LOCAL FUNCTIONS ---------------------------->
    const discountPercentage = (mainPrice: string | number) => {
        const discount = Number(mainPrice) - (item?.labDetails?.labPrice || 0);
        const percentage = (discount / Number(mainPrice)) * 100;
        return percentage.toFixed(2);
    };

    const handleRemoveFromCart = async () => {
        // Show confirmation alert
        Alert.alert(
            'Remove Item', // Alert title
            'Are you sure you want to remove this item from the cart?', // Alert message
            [
                {
                    text: 'No', // Cancel button
                    style: 'cancel', // Style for cancel button
                    onPress: () => console.log('Remove cancelled'), // Optional: Log or handle cancel
                },
                {
                    text: 'Yes', // Confirm button
                    style: 'destructive', // Style for destructive action (optional, makes button red on iOS)
                    onPress: async () => {
                        // Proceed with removal logic if user confirms
                        const url = `${BASE_URL}/hru/Patientappapi/removefromcart`;
                        const payload = {_id: item?._id, token: token};

                        try {
                            setLoading(prev => ({...prev, removeFromCart: true}));
                            const res = await postData(url, payload);

                            if (!res.status) {
                                Toast.show(res.msg, Toast.SHORT);
                                throw new Error(res.msg);
                            }

                            console.log('remove from cart', res);
                            Toast.show('Item removed from cart successfully', Toast.SHORT);
                            queryClient.invalidateQueries({
                                queryKey: ['CartData'],
                            });
                        } catch (error) {
                            console.log('Error removing from cart:', error);
                        } finally {
                            setLoading(prev => ({...prev, removeFromCart: false}));
                        }
                    },
                },
            ],
            {cancelable: true} // Allows dismissing the alert by tapping outside (optional)
        );
    };

    const handleSaveForLater = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/addsaveforlaterfromcart`;
        const payload = {...item, token: token};

        try {
            setLoading(prev => ({...prev, saveForLater: true}));

            console.log('Save for later payload', payload);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('Save for later', res);
            Toast.show('Item moved to save for later successfully', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(prev => ({...prev, saveForLater: false}));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.detailsContainer}>
                <Image source={require('../../assets/icons/result.png')} style={{height: wp(10), width: wp(10)}} />
                <View>
                    <Text style={styles.testName}>{item?.testDetails?.name}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{item?.labDetails?.labPrice || item?.testDetails?.price}</Text>
                        {Number(item?.testDetails?.price) - Number(item?.labDetails?.labPrice) > 0 && (
                            <>
                                <Text style={styles.mainPrice}>{item?.testDetails?.price}</Text>
                                <Text style={styles.discountPrice}>{discountPercentage(item?.testDetails?.price)}% off</Text>
                            </>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <BigButton
                    title="Save for later"
                    onPress={handleSaveForLater}
                    customStyle={styles.customButton}
                    customTextStyle={styles.customButtonText}
                    loading={loading.saveForLater}
                    customLoaderColor={colors.darkBlue}
                />
                <BigButton
                    title="Remove"
                    onPress={handleRemoveFromCart}
                    loading={loading.removeFromCart}
                    customStyle={[styles.customButton]}
                    customTextStyle={[styles.customButtonText, {color: colors.red}]}
                    customLoaderColor={colors.red}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        elevation: 2,
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        marginHorizontal: wp(3),
        borderRadius: wp(3),
    },
    detailsContainer: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    testName: {
        fontSize: wp(4),
        color: colors.black,
        fontWeight: 'bold',
        width: wp(70),
    },
    priceContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    price: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
    mainPrice: {
        fontSize: wp(3.5),
        fontWeight: '500',
        color: colors.grey,
        textDecorationLine: 'line-through',
    },
    discountPrice: {
        fontSize: wp(3.5),
        fontWeight: '500',
        color: colors.primary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(3),
    },
    customButton: {
        marginTop: hp(0),
        width: wp(40),
        paddingVertical: hp(0.8),
        backgroundColor: colors.white,
        borderWidth: wp(0.02),
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    customButtonText: {
        fontSize: wp(4),
        color: colors.darkBlue,
    },
});
