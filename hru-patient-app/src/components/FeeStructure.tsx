import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react';
import {colors} from '../common/colors';
import {isTab} from '../utils/isTab';
import {RFC_2822} from 'moment';

interface RowProps {
    title: string;
    value: string;
    customTitleStyle?: StyleProp<TextStyle>;
    customValueStyle?: StyleProp<TextStyle>;
}

const Row = ({title, value, customTitleStyle, customValueStyle}: RowProps) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.title, customTitleStyle]}>{title}</Text>
            <Text style={[styles.value, customValueStyle]}>{value}</Text>
        </View>
    );
};

export default function FeeStructure({data, couponDiscount, bookingAmount, paymentMethod}: any) {
    return (
        <View style={{gap: hp(0.5)}}>
            <Row title="Consultation Mode" value={data?.consultationMode} />
            <Row title="Consultation Fee" value={`₹${data?.consultationFee}`} customValueStyle={{fontWeight: 'bold'}} />
            {paymentMethod.bookAmountPayment && <Row title="Booking Fee" value={`₹${bookingAmount}`} customValueStyle={{fontWeight: 'bold'}} />}
            {couponDiscount && (
                <Row title="Discount" value={`-₹${couponDiscount?.discount}`} customValueStyle={{fontWeight: 'bold', color: colors.green}} />
            )}
            <Row title="Service Charges & Tax" value="Free" customValueStyle={{fontWeight: 'bold'}} />

            <View style={{height: hp(0.5)}} />

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.total}>Total Amount Payble Now</Text>
                <Text style={styles.total}>
                    ₹
                    {paymentMethod.bookAmountPayment
                        ? bookingAmount
                        : couponDiscount?.discountedConsultFee
                        ? couponDiscount?.discountedConsultFee
                        : data?.consultationFee}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.black,
    },
    value: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.black,
    },
    total: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: isTab ? wp(2.5) : wp(4),
        textAlign: 'center',
    },
});
