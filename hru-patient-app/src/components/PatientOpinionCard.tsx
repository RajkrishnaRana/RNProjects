import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import HorizontalList from '../screens/HorizontalList';
import {TestimonialCard} from './Cards/TestimonialCard';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import {BASE_URL} from '../config';
import {colors} from '../common/colors';
import {isIos} from '../utils/platform';
import {isTab} from '../utils/isTab';

const PatientOpenionCard = () => {
    // DATA FETCHING --------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/gettestimonials`;
    const {isPending, error, data, refetch} = useQuery({
        queryKey: ['testimonials'],
        queryFn: () => postData(url),
        select: data => {
            return data?.docs;
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>What Our Patients Say About Us</Text>
                <Text style={styles.subtitle}>We listen to your feedback to improve and provide trusted, seamless healthcare.</Text>
            </View>

            {isPending ? (
                <ActivityIndicator color={colors.primary} size={wp(5)} />
            ) : error ? (
                <Text style={{color: 'red'}}>Something went wrong</Text>
            ) : (
                <HorizontalList
                    data={data}
                    renderItem={({item}) => <TestimonialCard testimonial={item} />}
                    autoScrollEnabled
                    pagingEnabled={isIos() ? false : true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        padding: wp(2),
        marginTop: hp(2),
    },
    header: {
        // marginBottom: hp(1),
    },
    title: {
        fontSize: isTab ? wp(3) : wp(5.5),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: isTab ? wp(2) : wp(3.5),
        // lineHeight: 24,
        color: '#666',
        marginBottom: isTab ? hp(0.5) : hp(1),
    },
});

export default PatientOpenionCard;
