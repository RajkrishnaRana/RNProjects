import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {isTab} from '../utils/isTab';

interface IconDetailsProps {
    imgSrc: ImageSourcePropType;
    highlightDetail: string;
    detail: string;
}

export default function IconDetails({imgSrc, highlightDetail, detail}: IconDetailsProps) {
    return (
        <View style={{alignItems: 'center', marginBottom: hp(1)}}>
            <View style={styles.imgContainer}>
                <Image source={imgSrc} style={{height: isTab ? wp(3) : wp(6), width: isTab ? wp(3) : wp(6)}} tintColor={colors.primary} />
            </View>

            <Text style={styles.highlightedText}>{highlightDetail}</Text>
            <Text style={styles.detail}>{detail}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    imgContainer: {
        height: isTab ? wp(8) : wp(12),
        width: isTab ? wp(8) : wp(12),
        borderRadius: wp(6),
        marginBottom: hp(0.7),
        backgroundColor: colors.transparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlightedText: {
        color: colors.primary,
        fontSize: isTab ? wp(2.2) : wp(3.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detail: {
        color: colors.black,
        fontSize: isTab ? wp(2.2) : wp(3.5),
        textAlign: 'center',
    },
});
