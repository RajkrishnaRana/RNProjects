import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import {isTab} from '../../utils/isTab';

interface Props {
    description: string;
}

export default function CinicMembershipCard({description}: Props) {
    return (
        <View style={styles.container}>
            <Octicons name="check-circle-fill" size={isTab ? wp(3) : wp(5)} color={colors.green} />
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: wp(0.1),
        borderColor: colors.grey,
        borderRadius: wp(3),
        padding: wp(3),
        flexDirection: 'row',
        gap: isTab ? wp(1.5) : 3,
        alignItems: 'center',
    },
    description: {
        fontSize: isTab ? wp(2.2) : wp(3.2),
        color: colors.lightBlack,
        maxWidth: wp(75),
        lineHeight: isTab ? hp(1.8) : hp(2.5),
    },
});
