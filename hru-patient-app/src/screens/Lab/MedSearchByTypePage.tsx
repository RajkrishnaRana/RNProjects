/* eslint-disable react/no-unstable-nested-components */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import BackgroundGradient from '../../components/BackgroundGradient';
import { LegendList } from '@legendapp/list';
import SearchedMedicineListCard from '../../components/Cards/SearchedMedicineListCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MedSearchByTypePage = () => {
    const route = useRoute();
    const data = (route.params as { data?: any })?.data;

    console.log('search by type med', data);


    const ListEmptyContainer = () => <Text style={styles.listEmpty}>No Doctors Found</Text>;

    return (
        <BackgroundGradient>
            <View style={styles.results}>
                <Text style={styles.text}>Result for</Text>
                <Text style={styles.searchText}>{data?.searchMedicines?.map((item: any) => item.name)}</Text>
            </View>
            <LegendList
                data={data?.getMedicines}
                // renderItem={({ item }) => <SearchedMedicineListCard data={item} topRatedViewAllScreen />}
                renderItem={({ item }) => <SearchedMedicineListCard data={item} />}
                estimatedItemSize={20}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={ListEmptyContainer}
                decelerationRate={0.7}
                recycleItems
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </BackgroundGradient>
    );
};

export default MedSearchByTypePage;

const styles = StyleSheet.create({
    listEmpty: {
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    results: {
        flexDirection: 'row',
        gap: wp(1),
        paddingLeft: wp(5),
        color: 'rgb(132, 144, 151)',
        alignItems: 'flex-end',
        marginTop: hp(1),
    },
    text: {
        color: 'rgb(124, 135, 141)',
    },
    searchText: {
        color: 'rgb(20, 103, 148)',
        fontWeight: '600',
        fontSize: wp(4.5),
        fontStyle: 'italic',
    },
});
