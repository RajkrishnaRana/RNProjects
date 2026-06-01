import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../common/colors';
import CheckBox from '../../../components/CheckBox';
import TextField from '../../../components/TextField';
import BigButton from '../../../components/BigButton';
import useCartPrice from '../../../hooks/useCartPrice';
import {BASE_URL} from '../../../config';
import {postData} from '../../../api';
import Toast from 'react-native-simple-toast';
import {useAuthStore} from '../../../store/authStore';
import Confetti from '../../../components/LottieComponent/Confetti';
import {useNavigation} from '../../../hooks/useNavigation';

const PriceDetails = ({heading, value, type}: {heading: string; value: string; type?: string}) => {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.headingText, type === 'total' && styles.totalText]}>{heading}</Text>
            <Text style={[styles.headingText, {color: type === 'discount' ? colors.primary : colors.black}, type === 'total' && styles.totalText]}>
                {value}
            </Text>
        </View>
    );
};

export default function CartPricingCard({data, setHandleCheckoutFunc}: {data: any; setHandleCheckoutFunc: any}) {
    const navigation = useNavigation();

    //GLOBAL STATES ---------------------------->
    const {token} = useAuthStore();

    //LOCAL STATES ---------------------------->
    const [usePoints, setUsePoints] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState<any>();
    const [homeCollectionButton, setHomeCollectionButton] = useState(false);
    const [patientPickUpButton, setPatientPickUpButton] = useState(false);
    const [isConfettiVisible, setConfettiVisible] = useState(false);

    //LOCAL FUNCTIONS ------------------------->
    const {totalCartPrice, homeCollection, patientPickUp, collectionCharges, pickUpCharges, collectionChargeNotice, pickUpAvailableUpto} =
        useCartPrice(data?.cartData, data?.labTestCategory);

    const usableCoin = (percent: string): number => {
        const usableCoin = totalCartPrice * (Number(percent) / 100);
        if (Math.floor(usableCoin) > data?.totalPoints) return data?.totalPoints;
        return Math.floor(usableCoin);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode && !usePoints && couponDiscount === undefined) {
            Toast.show('Please enter coupon code or use points', Toast.LONG);
            return;
        }

        if (!usePoints && !couponCode && couponDiscount) {
            setCouponDiscount(undefined);
            return;
        }

        try {
            setApplyLoading(true);
            const url = `${BASE_URL}/hru/Patientappapi/applycouponforlabtest`;
            const payload = {
                token: token,
                couponCode: couponCode,
                consultationFee: totalCartPrice,
                labId: data?.cartData?.[0]?.labId,
                ...(usePoints && {usedBonusPoints: usableCoin(data?.usableCoinPercent)}),
            };

            console.log('applycoupon payload ------------->', payload);

            const res = await postData(url, payload);

            if (!res?.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res);
            }

            console.log('applycoupon response ------------->', res);
            setConfettiVisible(true);
            setCouponDiscount(res?.doc);
        } catch (error) {
            console.error(error);
        } finally {
            setApplyLoading(false);
        }
    };

    const handleCheckout = async () => {
        const totalAmount =
            (couponDiscount?.discountedConsultFee || totalCartPrice) +
            (homeCollectionButton ? collectionCharges : 0) +
            (patientPickUpButton ? pickUpCharges : 0);
        const pointsDiscount = usableCoin(data?.usableCoinPercent) || 0;

        const cartIds = [];
        for (let index = 0; index < data?.cartData?.length; index++) {
            const element = data?.cartData[index]?._id;
            cartIds.push(element);
        }

        const payload = {
            totalAmount: totalAmount,
            discount: couponDiscount?.discount || 0,
            couponDiscount: couponDiscount ? Number(couponDiscount?.discount || 0) - (usePoints ? pointsDiscount : 0) : 0,
            pointsDiscount: usePoints ? pointsDiscount : 0,
            cartIds: cartIds,
            couponId: couponDiscount?._id,
            homeCollection: homeCollectionButton,
            patientPickUp: patientPickUpButton,
            ...(patientPickUpButton && {pickupCharges: pickUpCharges}),
            ...(homeCollectionButton && {collectionCharge: totalCartPrice >= 500 ? 0 : collectionCharges}),
        };

        console.log('checkout payload ------------->', payload);

        try {
            const url = `${BASE_URL}/hru/Patientappapi/proceedtocheckout`;
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('checkout response ------------->', res);
            return res;
        } catch (error) {
            console.error(error);
        }
    };

    // SIDE EFFECTS for checkout function ---------------------------->
    useEffect(() => {
        setHandleCheckoutFunc(() => handleCheckout);
    }, [couponDiscount, couponCode, homeCollectionButton, patientPickUpButton, usePoints]);

    return (
        <>
            {/* Apply Coupon Section */}
            <View style={styles.container}>
                <Text style={styles.haveCouponText}>Have Coupon ?</Text>
                <CheckBox
                    rememberMe={usePoints}
                    setRememberMe={() => setUsePoints(prev => !prev)}
                    title={`${usableCoin(data?.usableCoinPercent) || '0'} out of ${data?.totalPoints} points can be used`}
                    isDisable={usableCoin(data?.usableCoinPercent) === 0}
                />

                <View style={styles.applyCouponCodeContainer}>
                    <TextField placeholder="Coupon code" value={couponCode} onChangeText={setCouponCode} customContainerStyle={{width: wp(55)}} />

                    <BigButton
                        title="Apply"
                        onPress={handleApplyCoupon}
                        loading={applyLoading}
                        customStyle={styles.customButton}
                        customTextStyle={styles.customButtonText}
                    />
                </View>
            </View>

            {/* Cart Pricing Section */}
            <View style={[styles.container, {marginTop: hp(2), gap: hp(1)}]}>
                <Text style={styles.haveCouponText}>Bill Summary</Text>

                <PriceDetails heading="Sub Total:" value={`₹${totalCartPrice}`} />
                <PriceDetails heading="Discount:" value={`₹${couponDiscount?.discount || 0}`} type="discount" />
                <PriceDetails heading="Estimated TAX:" value="₹0.00" />
                {homeCollection && homeCollectionButton && (
                    <PriceDetails heading="Collection Charge:" value={`₹${totalCartPrice >= 500 ? 0 : collectionCharges}`} />
                )}
                {patientPickUp && patientPickUpButton && <PriceDetails heading="Pick Up Charge:" value={`₹${pickUpCharges}`} />}
                {collectionChargeNotice && homeCollectionButton && <Text style={styles.collectionChargeNotice}>{collectionChargeNotice}</Text>}

                {/* Checkbox Section */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(1), marginBottom: hp(0.5)}}>
                    {homeCollection && (
                        <CheckBox
                            rememberMe={homeCollectionButton}
                            setRememberMe={() => setHomeCollectionButton(prev => !prev)}
                            title={`Home Collection`}
                        />
                    )}
                    {patientPickUp && (
                        <CheckBox
                            rememberMe={patientPickUpButton}
                            setRememberMe={() => setPatientPickUpButton(prev => !prev)}
                            title={`Patient Pick Up`}
                        />
                    )}
                </View>

                {/* Total Section */}
                <View style={{marginBottom: hp(1), height: hp(0.1), backgroundColor: colors.grey}} />
                <PriceDetails
                    heading="To be paid:"
                    value={`₹${
                        (couponDiscount?.discountedConsultFee || totalCartPrice) +
                        (homeCollectionButton && totalCartPrice < 500 ? collectionCharges : 0) +
                        (patientPickUpButton ? pickUpCharges : 0)
                    } `}
                    type="total"
                />
            </View>

            <Confetti
                isConfettiVisible={isConfettiVisible}
                discountPrice={couponDiscount?.discount}
                setIsConfettiVisible={setConfettiVisible}
                bookingPrice={couponDiscount?.discountedConsultFee}
                consultantFee={`${totalCartPrice}`}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        elevation: 2,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        marginHorizontal: wp(3),
        borderRadius: wp(3),
    },
    haveCouponText: {
        fontSize: wp(4.5),
        color: colors.black,
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    applyCouponCodeContainer: {
        flexDirection: 'row',
        marginTop: hp(2),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customButton: {
        width: wp(25),
        marginTop: hp(0),
        backgroundColor: colors.darkBlue,
        borderRadius: wp(3),
        paddingVertical: hp(1),
    },
    customButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: wp(4),
    },
    collectionChargeNotice: {
        color: colors.red,
        fontSize: wp(3),
    },
    buttonStyle: {
        marginTop: 0,
        marginHorizontal: wp(3),
        marginBottom: hp(2),
    },

    // Price Details Component styiling
    headingText: {color: colors.darkGrey, fontSize: wp(3.5)},
    totalText: {fontWeight: 'bold', color: colors.black, fontSize: wp(4)},
});
