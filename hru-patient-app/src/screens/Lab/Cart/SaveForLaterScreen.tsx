import { RefreshControl, View } from 'react-native';
import React from 'react';
import BackgroundGradient from '../../../components/BackgroundGradient';
import { useAuthStore } from '../../../store/authStore';
import { BASE_URL } from '../../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../../api';
import ErrorComponent from '../../../components/ErrorComponent';
import PageLoading from '../../../components/LottieComponent/PageLoading';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import SaveFromLaterCard from '../../../components/Lab/Cart/SaveFromLaterCard';
import { LegendList } from '@legendapp/list';

const ItemSeparator = () => <View style={{ height: hp(1.5) }} />;

export default function SaveForLaterScreen() {
    //GLOBAL STATE ------------------------------>
    const { token } = useAuthStore();

    // DATA FETCHING
    const url = `${BASE_URL}/hru/Patientappapi/cartpage`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['CartData'],
        queryFn: () => postData(url, { token }),
        select: d => {
            console.log('CartData', d);
            return d?.doc;
        },
    });

    //LOCAL FUNCTIONS ---------------------------->
    const renderItem = ({ item }: { item: any }) => <SaveFromLaterCard item={item} />;

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <>
                    <LegendList
                        data={data?.saveForLater}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item?._id || index.toString()}
                        estimatedItemSize={100}
                        ItemSeparatorComponent={ItemSeparator}
                        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
                        contentContainerStyle={{ paddingTop: hp(1.5) }}
                        ListEmptyComponent={<ListEmptyComponent customText="No tests present here" />}
                    />
                </>
            )}
        </BackgroundGradient>
    );
}
