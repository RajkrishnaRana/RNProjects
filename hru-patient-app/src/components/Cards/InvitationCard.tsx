import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Invitation} from '../../screens/ReferralPointsScreen';
import moment from 'moment';
import {isTab} from '../../utils/isTab';

interface Props {
    item: Invitation;
}

export default function InvitationCard({item}: Props) {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.bodyText, {width: wp(50)}]}>{`${item.firstName} ${item.lastName}`}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: wp(2),
                        alignItems: 'center',
                        width: wp(38),
                        // backgroundColor: colors.red,
                        justifyContent: 'flex-end',
                    }}>
                    <Image
                        source={item?.email ? require('../../assets/icons/email.png') : require('../../assets/icons/phone.png')}
                        style={styles.emailOrCallIcon}
                    />
                    <Text style={[styles.bodyText, {textAlign: 'right'}]}>{item?.email || item?.phoneNumber}</Text>
                </View>
            </View>
            <Text style={styles.date}>Invited on {moment(item?.createdAt).format('DD/MM/YYYY [at] hh:mm a')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.blueWhite,
        borderRadius: isTab ? wp(3) : wp(5),
        // elevation: 3,
        padding: isTab ? wp(2) : wp(3),
        gap: hp(0.5),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
    },
    bodyText: {
        fontSize: isTab ? wp(2.2) : wp(3.5),
        color: colors.black,
        // fontWeight: 'bold',
    },
    date: {
        textAlign: 'right',
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3),
    },
    emailOrCallIcon: {
        height: isTab ? wp(2.5) : wp(4),
        width: isTab ? wp(2.5) : wp(4),
        tintColor: colors.primary,
    },
});
