import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OrderReportListHeader from '../components/OrderReportListHeader';
import SearchBar from '../components/SearchBar';
import {colors} from '../common/colors';
import OrderCard from '../components/Card/OrderCard';
import {useAuthStore} from '../store/authStore';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import PageLoading from '../components/LottieComponenents/PageLoading';
import SegmentedControl from '../components/SegmentedControl';
import {FlashList} from '@shopify/flash-list';
import {useDateRangeStore} from '../store/dateRangeStore';
import {queryClient} from '../../App';
import BackgroundGradient from '../components/BackgroundGradient';
import BASE_URL from '../config';

type OptionListProps = {
    name: string;
    index: number;
};

const option: OptionListProps[] = [
    {
        name: 'Assigned',
        index: 0,
    },
    {
        name: 'Sample Collected',
        index: 1,
    },
    {
        name: 'Not Collected',
        index: 2,
    },
];

export default function Dashboard() {
    // GLOBAL STATES ----------------------------->
    const {token} = useAuthStore();
    const {startDate, endDate} = useDateRangeStore();

    // LOCAL STATES ------------------------------->
    const [selectOption, setSelectOption] = useState(0);
    const [filteredData, setFilteredData] = useState<
        AppointmentData[] | undefined
    >();
    const [refreshing, setRefreshing] = useState(false);

    const url2 = `${BASE_URL}/hru/Labstaffappapi/fetchphlebotomistdata`;
    const {
        isPending: loading,
        error: error2,
        data: userData,
    } = useQuery({
        queryKey: [
            'phlebotomistData',
            startDate?.valueOf(),
            endDate?.valueOf(),
        ],
        queryFn: () =>
            postData(url2, {
                token: token,
                start: startDate?.valueOf(),
                end: endDate?.valueOf(),
            }),
    });

    //LOCAL FUNCTIONS ---------------------------->
    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({queryKey: ['phlebotomistData']});
        setRefreshing(false);
    };

    //Side Effects ------------------------------->
    // useEffect(() => {
    //     queryClient.invalidateQueries({queryKey: ['phlebotomistData']});
    // }, [startDate, endDate]);

    useEffect(() => {
        if (!userData?.appointments) {
            setFilteredData([]);
            return;
        }

        console.log(userData);
        let filtered;
        switch (selectOption) {
            case 1: {
                filtered = userData?.appointments?.filter(
                    (item: any) => item?.sampleCollectionStatus === true,
                );
                break;
            }
            case 2: {
                filtered = userData?.appointments?.filter(
                    (item: any) => item?.sampleCollectionStatus === false,
                );
                break;
            }
            default: {
                filtered = userData?.appointments?.filter(
                    (item: any) => item?.sampleCollectionStatus === undefined,
                );
            }
        }

        setFilteredData(filtered);
    }, [userData, selectOption]);

    // if (loading) return <PageLoading />;

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                {loading ? (
                    <PageLoading />
                ) : error2 ? (
                    <Text style={{color: 'red', textAlign: 'center'}}>
                        Error: {error2.message}
                    </Text>
                ) : (
                    <>
                        <OrderReportListHeader />

                        {/* Search Bar */}
                        <View style={styles.bodyContainer}>
                            <SearchBar
                                appointment={
                                    userData?.appointments?.filter(
                                        (item: any) =>
                                            item?.sampleCollectionStatus !==
                                            true,
                                    ) || []
                                }
                            />

                            {/* Segmented Control */}
                            <View style={{marginVertical: hp(1)}}>
                                <SegmentedControl
                                    options={option}
                                    selectOptions={selectOption}
                                    onOptionPress={setSelectOption}
                                />
                            </View>

                            {/* Order Lists */}
                            <FlashList
                                data={filteredData || []}
                                renderItem={({item}) => (
                                    <OrderCard
                                        item={item}
                                        // notCollectedOrdersReason={data}
                                        selectOption={selectOption}
                                    />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{
                                    paddingTop: hp(1),
                                    paddingBottom: hp(20),
                                }}
                                estimatedItemSize={171}
                                decelerationRate={0.7}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                                ListEmptyComponent={() => (
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: colors.darkGrey,
                                        }}>
                                        No Data Found
                                    </Text>
                                )}
                            />
                        </View>
                    </>
                )}
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        flex: 1,
        paddingTop: hp(8),
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
    },
});
