import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { useNavigation } from '../hooks/useNavigation';
import HorizontalList from '../screens/HorizontalList';
import SegmentedControl from './SegmentedControl';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import DashboardDoctorCard from './Cards/DashboardDoctorCard';
import { isIos } from '../utils/platform';
import { isTab } from '../utils/isTab';
import Animated, { LinearTransition } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const options = [
    {
        name: 'Top Rated',
        index: 0,
    },
    {
        name: 'Top Searched',
        index: 1,
    },
    {
        name: 'Recently Searched',
        index: 2,
    },
];

const TopRatedDoctors = () => {
    const navigation = useNavigation();

    // GLOBAL STATES ---------------------->
    const { nearestLocation } = useCurrentLocationStore();
    console.log('nearestLocation', nearestLocation);

    // LOCAL STATES ------------------------->
    const [selectOption, setSelectOption] = useState(0);

    // DATA FETCING ----------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${
        selectOption === 0 ? 'mostrateddoctor' : selectOption === 1 ? 'mostsearcheddoctors' : 'recentsearcheddoctors'
    }`;
    // const url = `https://3d6a09085989.ngrok-free.app/hru/patientappapi/recentsearcheddoctors`;
    const payload = {
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        locationId: nearestLocation?._id,
    };
    console.log(url, 'url');
    console.log(payload, 'payload');

    // Memoize query key to prevent unnecessary re-renders
    const queryKey = useMemo(() => {
        return [selectOption === 0 ? 'TopRatedDoctors' : selectOption === 1 ? 'TopSearchedDoctors' : 'RecentSearchedDoctors', selectOption];
    }, [selectOption]);

    const { isPending, error, data } = useQuery({
        queryKey: queryKey,
        queryFn: () => postData(url, payload),
        select: useCallback(
            (d: any) => {
                console.log('TopRatedDoctors', d);
                const finalData =
                    selectOption === 0 ? d?.doc?.mostRatedDoctors : selectOption === 1 ? d?.doc?.mostSearchedDoctors : d?.doc?.recentSearchedDoctors;
                return finalData;
            },
            [selectOption],
        ),
    });

    const renderDoctorCard = ({ item }: { item: TopRatedDoctorProfile }) => item && <DashboardDoctorCard item={item} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Find the Right Doctor for You</Text>
                    <Text style={styles.subtitle}>
                        Find trusted medical professionals by speciality, read patient reviews, and book your appointment with ease.
                    </Text>
                </View>
            </View>

            <View style={styles.segmentContainer}>
                <SegmentedControl
                    options={options}
                    selectOptions={selectOption}
                    onOptionPress={setSelectOption}
                    customContainerStyle={{ backgroundColor: colors.white }}
                />
            </View>

            {isPending ? (
                <ActivityIndicator color={colors.primary} size={isTab ? wp(3) : wp(5)} />
            ) : error ? (
                <Text style={styles.error}>Something went wrong</Text>
            ) : (
                <>
                    <HorizontalList data={data} renderItem={renderDoctorCard} paginationBlocked pagingEnabled={isIos() ? false : true} />
                    <AnimatedTouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => {
                            navigation.navigate('AllTopRatedDoctors', { type: selectOption, data: data });
                        }}
                        layout={LinearTransition}
                    >
                        <Text style={styles.link}>View all</Text>
                    </AnimatedTouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: isTab ? hp(1) : hp(2.5),
        marginBottom: hp(1.5),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(2),
    },
    title: {
        fontSize: isTab ? wp(3) : wp(5.3),
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: '#666',
        marginTop: 4,
    },
    link: {
        fontSize: isTab ? wp(2) : wp(3.8),
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        color: colors.primary,
    },
    segmentContainer: { marginTop: isTab ? hp(1) : hp(1.5), marginBottom: isTab ? 0 : hp(0.5) },
    error: { color: 'red' },
    linkContainer: { marginTop: hp(1), alignItems: 'center' },
});

export default TopRatedDoctors;
