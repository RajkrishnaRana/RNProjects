import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import StackAppBar from '../../components/AppHeaders/StackAppBar';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PaymentOption from '../../components/PaymentOption';
import BigButton from '../../components/BigButton';

const paymentMethods = [
    {
        imgSrc: require('../../assets/icons/credit-card.png'),
        title: 'Debit or Credit Cards',
    },
    {
        imgSrc: require('../../assets/icons/upi.png'),
        title: 'UPI',
    },
    {
        imgSrc: require('../../assets/icons/mobile-banking.png'),
        title: 'Net-Banking',
    },
    {
        imgSrc: require('../../assets/icons/credit-card.png'),
        title: 'Others',
    },
];

export default function PaymentScreen() {
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <View style={{flex: 1, paddingHorizontal: wp(3)}}>
                <View style={styles.paymentContainer}>
                    <Text style={styles.amountHeader}>Payment Amount</Text>
                    <Text style={styles.paymentNumber}>₹600.00</Text>
                </View>

                <Text style={styles.heading}>Choose Your Payment Method :</Text>

                <View style={{flex: 1, marginTop: hp(2)}}>
                    {paymentMethods.map((item, index) => (
                        <PaymentOption
                            key={index}
                            imgSrc={item.imgSrc}
                            title={item.title}
                        />
                    ))}
                </View>

                <Text style={{color: 'red'}}>
                    **This Page isn't fully developed yet
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    paymentContainer: {
        marginVertical: hp(1),
        backgroundColor: colors.blueWhite,
        borderRadius: wp(6),
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(15),
    },
    amountHeader: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: wp(3.4),
    },
    paymentNumber: {
        color: colors.primary,
        fontSize: wp(10),
        fontWeight: '900',
        textAlign: 'center',
    },
    heading: {
        marginTop: hp(3),
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
});
