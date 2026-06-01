import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import StarRating from '../StarRating';
import BackgroundGradient from '../BackgroundGradient';
import {isTab} from '../../utils/isTab';

interface Review {
    _id: string;
    createdAt: string; // ISO 8601 date string, could also be Date if parsed
    profileImg: string; // URL or blob URL
    name: string;
    description: string;
    isActive: boolean;
    starRating: number;
    patientType: string;
    updatedAt: string; // ISO 8601 date string, could also be Date if parsed
}

export const TestimonialCard = ({testimonial}: {testimonial: Review}) => {
    // Function to truncate text dynamically
    const truncateText = (text: string, maxLength = 210) => {
        if (typeof text !== 'string') return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.headerContainer}>
                    {/* <Image source={{uri: testimonial.profileImg.split('blob:')[1]}} style={styles.profileImage} /> */}
                    <View>
                        <Text style={styles.name}>{testimonial.name}</Text>
                        <Text style={styles.type}>{testimonial.patientType}</Text>
                    </View>
                </View>

                <View style={[styles.accent, {backgroundColor: '#20B2AA'}]} />

                <Text style={styles.testimonialText}>{truncateText(testimonial.description)}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.ratingNumber}>{testimonial.starRating}.0</Text>
                    <StarRating rating={testimonial.starRating} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white, //'#F8FBFF',
        borderRadius: wp(2.5),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: '100%',
        width: isTab ? wp(40) : wp(85),
        marginRight: wp(3),
    },
    cardContent: {
        padding: isTab ? wp(3.5) : wp(4.5),
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        gap: wp(3),
    },
    profileImage: {
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
    },
    name: {
        fontSize: isTab ? wp(2.5) : wp(4.5),
        fontWeight: 'bold',
        color: '#0F3C5D',
    },
    type: {
        fontSize: isTab ? wp(1.8) : wp(3.5),
        color: '#0F3C5D',
        opacity: 0.8,
        marginBottom: isTab ? hp(0.5) : hp(1),
    },
    accent: {
        height: 4,
        width: 100,
        borderRadius: 2,
        marginBottom: 15,
    },
    testimonialText: {
        fontSize: isTab ? wp(1.8) : wp(3.2),
        lineHeight: isTab ? hp(1.5) : hp(2.2),
        color: colors.darkGrey,
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isTab ? hp(0.5) : hp(1),
    },
    ratingNumber: {
        fontSize: isTab ? wp(2) : wp(4),
        fontWeight: 'bold',
        marginRight: wp(2),
        color: '#0F3C5D',
    },
});
