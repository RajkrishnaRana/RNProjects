import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {isTab} from '../../utils/isTab';

interface Props {
    img: string;
    heading: string;
    desc: string;
}

export default function ClinicFacilitiesCard({img, heading, desc}: Props) {
    return (
        <View style={styles.container}>
            <Image source={{uri: img}} style={{height: isTab ? wp(10) : wp(15), width: isTab ? wp(10) : wp(15)}} />
            <View>
                <Text style={styles.heading}>{heading}</Text>
                <Text style={styles.description}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: wp(0.1),
        borderColor: colors.grey,
        borderRadius: isTab ? wp(1.5) : wp(3),
        padding: wp(3),
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    heading: {
        fontSize: isTab ? wp(2.7) : wp(4),
        color: colors.darkBlue,
        maxWidth: isTab ? wp(65) : wp(60),
        lineHeight: isTab ? hp(1.5) : hp(2.5),
        fontWeight: 'bold',
        marginBottom: hp(0.8),
    },
    description: {
        fontSize: isTab ? wp(2.2) : wp(3.2),
        color: colors.lightBlack,
        maxWidth: isTab ? wp(65) : wp(60),
        lineHeight: isTab ? hp(1.8) : hp(2.1),
    },
});
