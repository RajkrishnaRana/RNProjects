import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import ClinicProfileImg from './ClinicProfileImg';
import StarRating from '../StarRating';
import {isTab} from '../../utils/isTab';

interface Props {
    image: string;
    name: string;
    firstLetter: string;
    rating: number;
    review: string;
}

export default function ClinicReviewCard({image, name, firstLetter, rating, review}: Props) {
    return (
        <View style={styles.container}>
            <ClinicProfileImg src={image} char={firstLetter} />

            <View style={styles.detailContainer}>
                <View style={styles.heading}>
                    <Text style={styles.name}>{name}</Text>
                    <StarRating rating={Number(rating)} />
                </View>
                <Text style={styles.review}>{review}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: wp(0.1),
        borderColor: colors.grey,
        borderRadius: wp(3),
        padding: isTab ? wp(2) : wp(3),
        flexDirection: 'row',
        gap: isTab ? wp(2) : wp(3),
        alignItems: 'center',
    },
    detailContainer: {
        gap: hp(0.6),
    },
    heading: {
        flexDirection: isTab ? 'row' : 'column',
        alignItems: 'center',
        gap: wp(2),
    },
    name: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        color: colors.black,
        maxWidth: wp(60),
    },
    review: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.lightBlack,
        maxWidth: wp(60),
    },
});
