import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RootStackParamList} from '../../types/routeTypes';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {BASE_URL} from '../../config';
import {useCurrentLocationStore} from '../../store/currentLocationStore';
import {postData} from '../../api';
import {useAuthStore} from '../../store/authStore';
import BackgroundGradient from '../../components/BackgroundGradient';
import PageLoading from '../../components/LottieComponent/PageLoading';
import {FlashList} from '@shopify/flash-list';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import LabSearchResultCard from '../../components/Lab/LabSearchResultCard';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';

type LabSearchPageProps = RouteProp<RootStackParamList, 'LabSearch'>;

export default function LabSearchPage() {
    const {id} = useRoute<LabSearchPageProps>().params;
    const navigation = useNavigation();

    // GLOBAL STATES ---------------------------->
    const {token, isAuthenticated} = useAuthStore();
    const nearestLocation = useCurrentLocationStore(s => s.nearestLocation);

    // LOCAL STATES ------------------------------->

    // DATA FETCHING ------------------------------>
    const url = `${BASE_URL}/hru/Patientappapi/${id}/${nearestLocation?._id}/locationwisesearchlab`;
    const payload = {
        token: isAuthenticated ? token : null,
        latitude: nearestLocation?.location?.coordinates[1],
        longitude: nearestLocation?.location?.coordinates[0],
        searchLocationId: nearestLocation?._id,
    };

    const {isPending, error, data} = useQuery({
        queryKey: ['labSearch' + id],
        queryFn: () => postData(url, payload),
        select: data => {
            console.log('labSearchData', data);
            return data?.doc;
        },
    });

    //LOCAL FUNCTIONS ------------------------->
    const renderItem = ({item}: {item: Lab}) => <LabSearchResultCard item={item} testDetails={data?.labTestDetails} id={id} />;

    const handleLabTestName = () => navigation.push('TestDetails', {test: data?.labTestDetails});

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <Text>Something went wrong</Text>
            ) : (
                <View style={{flex: 1}}>
                    <TouchableOpacity style={styles.testInfo} onPress={handleLabTestName}>
                        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                            <EntypoIcons name="info-with-circle" size={wp(4.5)} color={colors.darkGrey} />
                            <Text style={styles.labInfoText}>{data?.labTestDetails?.name}</Text>
                        </View>
                        <EntypoIcons name="chevron-right" size={wp(5)} color={colors.black} />
                    </TouchableOpacity>

                    <View style={styles.breakLine} />

                    <FlashList
                        data={data?.getTestsLab || []}
                        renderItem={renderItem}
                        ListEmptyComponent={() => <ListEmptyComponent customText="No lab found for this serach data" />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    testInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp(3),
        marginVertical: hp(1.5),
    },
    labInfoText: {
        fontSize: wp(3.5),
        color: colors.darkGrey,
        fontWeight: '500',
        width: wp(70),
    },
    breakLine: {
        height: wp(0.2),
        backgroundColor: colors.grey,
        marginHorizontal: wp(3),
        marginBottom: hp(0.5),
    },
});
