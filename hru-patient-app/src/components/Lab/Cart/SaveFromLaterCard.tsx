import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../common/colors';
import IconText from '../../IconText';
import LinearGradient from 'react-native-linear-gradient';
import BigButton from '../../BigButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../../../config';
import { useAuthStore } from '../../../store/authStore';
import { postData } from '../../../api';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../../../App';

export default function SaveFromLaterCard({ item }: { item: LabBookingType }) {
    //GLOBAL STATES ---------------------------->
    const { token } = useAuthStore();

    // LOCAL STATES -------------------------->
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);

    //LOCAL FUNCTIONS ---------------------------->
    const handleAddToCart = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/addcartfromsaveforlater`;
        const payload = { data: item, token: token };

        try {
            setLoading(true);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            Toast.show('Item added to cart successfully', Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
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
                        const url = `${BASE_URL}/hru/Patientappapi/removefromsaveforlater`;
                        const payload = { _id: item?._id, token: token };

                        try {
                            setDelLoading(true);
                            const res = await postData(url, payload);

                            if (!res.status) {
                                Toast.show(res.msg, Toast.SHORT);
                                throw new Error(res.msg);
                            }

                            console.log('remove from save for later', res);
                            Toast.show('Item removed', Toast.SHORT);
                            queryClient.invalidateQueries({
                                queryKey: ['CartData'],
                            });
                        } catch (error) {
                            console.log('Error removing from cart:', error);
                        } finally {
                            setDelLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }, // Allows dismissing the alert by tapping outside (optional)
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                {item?.labDetails?.labProfileImgPath ? (
                    <Image style={styles.image} src={item?.labDetails?.labProfileImgPath} />
                ) : (
                    <LinearGradient colors={['orange', 'orange', 'yellow']} style={[styles.image, styles.placeholder]}>
                        <Text style={styles.labPlaceHolderChar}>{item?.labDetails?.labName?.charAt(0).toUpperCase()}</Text>
                    </LinearGradient>
                )}

                <View style={{ paddingHorizontal: wp(2), gap: hp(0.3) }}>
                    <Text style={styles.labName}>{item?.labDetails?.labName}</Text>

                    <Text style={{ fontSize: wp(3.3), color: colors.darkGrey, width: wp(70) }}>
                        Test Name : <Text style={[styles.highlight, { fontSize: wp(3.1) }]}>{item?.testDetails?.name}</Text>
                    </Text>

                    {/* Location address */}
                    <IconText
                        index={3}
                        text={
                            item?.labDetails?.address?.[0]?.locationAddress?.length > 70
                                ? item?.labDetails?.address?.[0]?.locationAddress?.substring(0, 70) + '...'
                                : item?.labDetails?.address?.[0]?.locationAddress
                        }
                        customTextStyles={{ fontSize: wp(3.1), width: wp(65) }}
                    />
                </View>
            </View>

            {/* Pickup and Drop and Home Availability */}
            <View style={{ marginLeft: wp(1), marginTop: hp(1) }}>
                {item?.labDetails?.pickupDropAvl === 'YES' && (
                    <Text style={styles.bulletPoint}>
                        • Pick Up and Drop service available : <Text style={styles.highlight}>₹{item?.labDetails?.pickupCharges}</Text>
                    </Text>
                )}
                {item?.labDetails?.homeFacilityAvl === 'YES' && (
                    <Text style={styles.bulletPoint}>
                        • Home Sample Collection available : <Text style={styles.highlight}>₹{item?.labDetails?.smplCollectinChrges}</Text>
                    </Text>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.priceText}>Price : ₹{item?.labDetails?.labPrice || item?.testDetails?.price}</Text>

                <View style={styles.buttonContainer}>
                    <BigButton
                        title="Add to Cart"
                        onPress={handleAddToCart}
                        loading={loading}
                        customStyle={styles.customButton}
                        customTextStyle={styles.customButtonText}
                        customLoaderColor={colors.darkBlue}
                    />
                    {delLoading ? (
                        <ActivityIndicator size={wp(5)} color={colors.red} />
                    ) : (
                        <MaterialIcons name="delete" onPress={handleRemove} size={wp(5)} color={colors.red} style={styles.editIcon} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        borderWidth: wp(0.001),
        backgroundColor: colors.white,
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    headingContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    image: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(10),
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labPlaceHolderChar: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: colors.black,
    },
    labName: {
        fontSize: wp(4.5),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    highlight: { color: colors.black, fontWeight: 'bold' },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginTop: hp(0.5),
    },
    availabilityText: {
        fontSize: wp(3.6),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    bulletPoint: {
        fontSize: wp(3),
        color: colors.darkGrey,
    },
    bottomContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(2), marginTop: hp(2) },
    priceText: {
        marginTop: hp(0.5),
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    customButton: {
        marginTop: hp(0),
        width: wp(30),
        paddingVertical: hp(0.8),
        backgroundColor: colors.white,
        borderWidth: wp(0.02),
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    customButtonText: {
        fontSize: wp(3.5),
        color: colors.darkBlue,
    },
    editIcon: {
        padding: wp(2),
        backgroundColor: colors.white,
        borderRadius: wp(6),
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        elevation: 3,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    buttonContainer: { flexDirection: 'row', gap: wp(3) },
});
