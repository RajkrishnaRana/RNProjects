import { StyleSheet, Text } from 'react-native';
import React from 'react';
import BackgroundGradient from '../components/BackgroundGradient';
import StackAppBar from '../components/AppHeaders/StackAppBar';
import { RootStackParamList } from '../types/routeTypes';
import { RouteProp, useRoute } from '@react-navigation/native';
import SpecialitiesDoctorCard from '../components/Cards/SpecialitiesDoctorCard';
import { LegendList } from '@legendapp/list';

type AllTopRatedDoctorsRouteProp = RouteProp<RootStackParamList, 'AllTopRatedDoctors'>;

const ListEmptyContainer = () => <Text style={styles.listEmpty}>No Doctors Found</Text>;

export default function AllTopRatedDoctorsScreen() {
    const { type, data } = useRoute<AllTopRatedDoctorsRouteProp>().params;

    // LOCAL FUNCTIONS ------------------->
    const handleTitle = (option: number) => {
        switch (option) {
            case 0:
                return 'Top Rated Doctors';
            case 1:
                return 'Top Searched Doctors';
            case 2:
                return 'Recently Searched Doctors';
            default:
                return 'Top Rated Doctors';
        }
    };

    return (
        <BackgroundGradient>
            <StackAppBar title={handleTitle(type)} />

            <LegendList
                data={data}
                renderItem={({ item }) => <SpecialitiesDoctorCard data={item} topRatedViewAllScreen />}
                estimatedItemSize={20}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={ListEmptyContainer}
                decelerationRate={0.7}
                recycleItems
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    listEmpty: { color: 'black', textAlign: 'center', marginTop: 20 },
});
