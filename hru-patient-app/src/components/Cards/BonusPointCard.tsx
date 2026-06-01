import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ReferralDetail} from '../../screens/ReferralPointsScreen';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import moment from 'moment';
import {isTab} from '../../utils/isTab';

export default function BonusPointCard({item}: {item: ReferralDetail}) {
    const {firstName, middleName, lastName, fullName} = item?.userDetails || {};

    return (
        <View style={styles.container}>
            <View style={styles.nameContainer}>
                {item?.userDetails?.fullName ? (
                    <Text style={[styles.name, {width: isTab ? wp(65) : wp(60)}]}>{fullName}</Text>
                ) : (
                    <View style={{width: isTab ? wp(65) : wp(60)}} />
                )}
                <View style={{flexDirection: 'row', gap: wp(4)}}>
                    <Text style={styles.name}>CP : {item?.point?.toFixed(1)} </Text>
                    <Text style={styles.name}>SP : {item?.spendingPoint?.toFixed(1)}</Text>
                </View>
            </View>
            <View style={styles.dateContainer}>
                <Text style={[styles.dateText]}>{moment(item?.createdAt).format('Do MMM, YYYY')}</Text>
                <Text style={styles.dateText}>Expired On {moment(item?.expiryDate).format('Do MMM, YYYY')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: isTab ? hp(0) : hp(0.5),
        backgroundColor: colors.white,
        borderRadius: isTab ? wp(3) : wp(5),
        elevation: 3,
        padding: isTab ? wp(2) : wp(3),

        // Shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    nameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: hp(0.5),
    },
    subject: {fontSize: isTab ? wp(2) : wp(3.5), color: colors.darkGrey, alignSelf: 'center'},
    name: {fontSize: isTab ? wp(2.5) : wp(4), color: colors.black},
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    dateText: {fontSize: isTab ? wp(1.7) : wp(3), color: colors.darkGrey},
});
