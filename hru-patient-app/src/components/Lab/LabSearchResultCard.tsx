import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { imageSelector } from '../../utils';
import IconText from '../IconText';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import BigButton from '../BigButton';
import { useNavigation } from '../../hooks/useNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { postData } from '../../api';
import { BASE_URL } from '../../config';
import Toast from 'react-native-simple-toast';
import { useAuthStore } from '../../store/authStore';
import { queryClient } from '../../../App';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function LabSearchResultCard({ item, testDetails, id }: { item: Lab; testDetails: any; id: string }) {
    const navigation = useNavigation();
    const scale = useSharedValue(1);

    // GLOBAL STATES ------------------>
    const { token } = useAuthStore();

    // LOCAL STATES ------------------>
    const [isfabourite, setIsFabourite] = useState(item?.defaultLabId === item._id);
    const [loading, setLoading] = useState({
        addToCart: false,
        saveForLater: false,
    });

    //LOCAL FUNCTIONS ---------------------->
    const nextAvailability = (appointmentDates: AppointmentDates): string => {
        for (let i = 0; i < 7; i++) {
            const day = moment().add(i, 'days');
            const dayKey = day.format('dddd').toLowerCase() as keyof AppointmentDates;
            const slots = appointmentDates[dayKey];

            if (slots?.length > 0) {
                const prefix = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.format('dddd');
                return `${prefix} ${slots[0].from} to ${slots[0].to}`;
            }
        }

        return 'No availability';
    };

    const discountPercentage = (mainPrice: string, labPrice: number | undefined, testPrice: string) => {
        const discount = Number(mainPrice) - Number(labPrice ? labPrice : testPrice);
        const percentage = (discount * 100) / Number(mainPrice);
        return Number(percentage.toFixed(2));
    };

    const navigateToDetials = () => {
        navigation.navigate('LabDetails', {
            id: item._id,
        });
    };

    const handleHeartPress = async () => {
        // Bounce animation
        scale.value = withSpring(0.8, { damping: 2, stiffness: 150 }, () => {
            scale.value = withSpring(1, { damping: 3, stiffness: 200 });
        });

        // Add your heart press logic here
        try {
            const payload = {
                token: token,
                labId: item._id,
                isDefault: isfabourite,
            };

            const url = `${BASE_URL}/hru/Patientappapi/defaultlabset`;
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            setIsFabourite(!isfabourite);
            if (!isfabourite) Toast.show('Default lab set successfully', Toast.SHORT);
            if (isfabourite) Toast.show('Default lab removed successfully', Toast.SHORT);

            // Remove the particular cache for next time loading
            queryClient.removeQueries({
                queryKey: ['labSearch' + id],
            });
        } catch (error) {
            console.error(error);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handleSaveFromLater = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/labtestsaveforlaterfromsearchpage`;
        const payload = {
            token: token,
            labDetails: item,
            testDetails: testDetails,
        };

        console.log('Save for later payload', payload);

        try {
            setLoading(prev => ({ ...prev, saveForLater: true }));
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            Toast.show(`Items added to save for later`, Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, saveForLater: false }));
        }
    };

    const handleAddToCart = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/labtestaddcartfromsearchpage`;
        const payload = {
            token: token,
            labDetails: item,
            testDetails: testDetails,
        };

        console.log('Add to Cart payload', payload);

        try {
            setLoading(prev => ({ ...prev, addToCart: true }));
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            Toast.show(`Items added to cart`, Toast.SHORT);
            queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, addToCart: false }));
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={navigateToDetials}>
            {/* Heading Section */}
            <View style={styles.headingContainer}>
                <Image source={imageSelector(item?.labProfileImgPath, 'DOCTOR')} style={styles.labCardImg} />
                <View style={{ paddingHorizontal: wp(2) }}>
                    <View style={{ flexDirection: 'row', gap: wp(2), alignItems: 'center' }}>
                        <Text style={styles.labName}>{item.labName}</Text>

                        {/* Animating Heart Icon */}
                        <AnimatedTouchableOpacity onPress={handleHeartPress} style={animatedStyle} activeOpacity={0.7}>
                            {isfabourite ? (
                                <MaterialCommunityIcons name="cards-heart" size={wp(5.5)} color={colors.red} />
                            ) : (
                                <MaterialCommunityIcons name="cards-heart-outline" size={wp(5.5)} color={colors.red} />
                            )}
                        </AnimatedTouchableOpacity>
                    </View>
                    {item.clinicName && (
                        <View style={styles.HospitalName}>
                            <Image style={styles.hospitalIcon} source={require('../../assets/icons/clinic.png')} />
                            <Text style={styles.hospitalName}>
                                {item.clinicName}
                            </Text>
                        </View>
                    )}

                    {/* Location address */}
                    <IconText
                        index={3}
                        text={
                            item.address?.[0]?.locationAddress?.length > 70
                                ? item.address?.[0]?.locationAddress?.substring(0, 70) + '...'
                                : item.address?.[0]?.locationAddress
                        }
                        customTextStyles={{ fontSize: wp(3.3), width: wp(65) }}
                    />

                    {/* Ratings and Reviews */}
                    <View style={{ flexDirection: 'row', gap: wp(2), alignItems: 'center' }}>
                        <View style={styles.starsContainer}>
                            <AntDesignIcon name="star" size={wp(4.5)} color={colors.yellow} />
                            <Text
                                style={{
                                    color: colors.black,
                                    fontWeight: 'bold',
                                    fontSize: wp(3.5),
                                }}
                            >
                                {item?.avgRating || '0'}
                            </Text>
                        </View>
                        <Text style={{ fontSize: wp(3.2), color: colors.black }}>({item?.totalFeedback || '0' + ' Feedback'})</Text>
                    </View>
                </View>
            </View>

            {/* Availability */}
            <View style={styles.detailContainer}>
                <Text style={styles.availabilityText}>Availability : {nextAvailability(item?.appointmentDates)}</Text>
            </View>

            {/* Pickup and Drop and Home Availability */}
            <View style={{}}>
                {item?.pickupDropAvl === 'YES' && (
                    <Text style={styles.bulletPoint}>• Pick Up and Drop service available : ₹{item?.pickupCharges}</Text>
                )}
                {item?.homeFacilityAvl === 'YES' && <Text style={styles.bulletPoint}>• Home Sample Collection available</Text>}
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{item?.labPrice || testDetails?.price}</Text>
                {discountPercentage(testDetails?.price, item?.labPrice, testDetails?.price) > 0 && (
                    <>
                        <Text style={styles.mainPrice}>₹{testDetails?.price}</Text>
                        <Text style={styles.discountPrice}>{discountPercentage(testDetails?.price, item?.labPrice, testDetails?.price)}% off</Text>
                    </>
                )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <BigButton
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    loading={loading.addToCart}
                    customStyle={[styles.buttonStyle, { backgroundColor: colors.darkBlue }]}
                    customTextStyle={styles.cutomButtonText}
                />
                <BigButton
                    title="Save for later"
                    onPress={handleSaveFromLater}
                    loading={loading.saveForLater}
                    customStyle={styles.buttonStyle}
                    customTextStyle={styles.cutomButtonText}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        borderRadius: wp(3),
        borderWidth: wp(0.001),
        backgroundColor: colors.white,
        elevation: 2,

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headingContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    labName: {
        fontSize: wp(4.5),
        color: colors.darkBlue,
        fontWeight: 'bold',
        maxWidth: wp(60),
    },
    labCardImg: {
        height: wp(15),
        width: wp(15),
        borderRadius: wp(10),
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginTop: hp(0.5),
    },
    starsContainer: {
        borderRadius: wp(2),
        paddingVertical: wp(1),
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
    },
    availabilityText: {
        fontSize: wp(3.6),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    bulletPoint: {
        fontSize: wp(3.2),
        color: colors.darkGrey,
    },
    priceContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonStyle: {
        marginTop: hp(1.5),
        width: wp(35),
        paddingVertical: hp(0.8),
    },
    cutomButtonText: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
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
    hospitalName: {
        // color: colors.darkGrey,
        fontSize: wp(3.5),
        maxWidth: wp(60),
        fontWeight: '600'
    },
    hospitalIcon: {
        height: wp(4),
        width: wp(4),
        marginTop: 2
    },
    HospitalName: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(1.8)
    }
});
