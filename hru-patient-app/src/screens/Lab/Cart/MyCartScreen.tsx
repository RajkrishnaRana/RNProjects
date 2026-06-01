import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../../api';
import { useAuthStore } from '../../../store/authStore';
import { useNavigation } from '../../../hooks/useNavigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../common/colors';
import { BASE_URL } from '../../../config';
import BackgroundGradient from '../../../components/BackgroundGradient';
import PageLoading from '../../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../../components/ErrorComponent';
import LabCartCard from '../../../components/Lab/LabCartCard';
import SelectedLabCard from '../../../components/Lab/Cart/SelectedLabCard';
import CartPricingCard from './CartPricingCard';
import BigButton from '../../../components/BigButton';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import { useCartStore } from '../../../store/cartStore';
import { LegendList } from '@legendapp/list';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIos } from '../../../utils/platform';

const ItemSeparator = () => <View style={{ height: hp(2) }} />;

const MyCartScreen = React.memo(() => {
    const navigation = useNavigation();

    //GLOBAL STATE ------------------------------>
    const { token } = useAuthStore();
    const { setCartItemNumber, setSaveForLaterCount } = useCartStore();

    //LOCAL STATES ---------------------------->
    const [loading, setLoading] = useState(false);
    const [handleChekoutFunc, setHandleCheckoutFunc] = useState<any>(null);

    // DATA FETCHING ---------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/cartpage`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['CartData'],
        queryFn: () => postData(url, { token }),
        select: d => {
            console.log('CartData', d);
            return d?.doc;
        },
    });

    // Prepare data for FlashList
    const listData = [
        { key: 'selectedLab', type: 'selectedLab' },
        ...(data?.cartData?.map((item: LabBooking) => ({ ...item, type: 'labCard' })) || []),
        { key: 'pricing', type: 'pricing' },
    ];

    // Optimize renderItem with useCallback
    const renderItem = useCallback(
        ({ item }: { item: any }) => {
            if (item.type === 'selectedLab') {
                return data?.cartData?.[0] ? <SelectedLabCard item={data.cartData[0]} data={data} /> : null;
            } else if (item.type === 'pricing' && data?.cartData?.length > 0) {
                return <CartPricingCard data={data} setHandleCheckoutFunc={setHandleCheckoutFunc} />;
            } else if (item.type === 'labCard') {
                return <LabCartCard item={item} />;
            } else {
                return <ListEmptyComponent customText="No tests found, Please add some tests" />;
            }
        },
        [data],
    );

    //LOCAL FUNCTIONS ------------------------------------->
    const handleCheckout = async () => {
        setLoading(true);
        const res = await handleChekoutFunc();
        navigation.push('LabBookingTimings', { key: res?.key });
        setLoading(false);
    };

    useEffect(() => {
        setCartItemNumber(data?.cartData?.length || 0);
        setSaveForLaterCount(data?.saveForLater?.length || 0);
    }, [data, setCartItemNumber, setSaveForLaterCount]);

    return (
        <BackgroundGradient>
            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <>
                    <View style={styles.headerText}>
                        <Text style={styles.numberOfTest}>{data?.cartData?.length || 0} test added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'DASHBOARD' })}>
                            <Text style={styles.addMoreText}>+Add more tests</Text>
                        </TouchableOpacity>
                    </View>

                    <LegendList
                        data={listData}
                        renderItem={renderItem}
                        keyExtractor={item => item._id || item.key}
                        estimatedItemSize={100}
                        ItemSeparatorComponent={ItemSeparator}
                        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
                        contentContainerStyle={{ paddingBottom: hp(12) }}
                        showsVerticalScrollIndicator={false}
                        recycleItems
                    />

                    {data?.cartData?.length > 0 && (
                        <>
                            {isIos() ? (
                                <SafeAreaView edges={['bottom']}>
                                    <BigButton
                                        title="Proceed to Checkout"
                                        onPress={handleCheckout}
                                        loading={loading}
                                        customStyle={styles.buttonStyle}
                                    />
                                </SafeAreaView>
                            ) : (
                                <LinearGradient style={styles.bottomContainer} colors={['transparent', '#d0ece7', '#d0ece7']}>
                                    <BigButton
                                        title="Proceed to Checkout"
                                        onPress={handleCheckout}
                                        loading={loading}
                                        customStyle={styles.buttonStyle}
                                    />
                                </LinearGradient>
                            )}
                        </>
                    )}
                </>
            )}
        </BackgroundGradient>
    );
});

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 0,
        marginHorizontal: wp(3),
    },
    headerText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp(5),
        marginVertical: hp(2),
    },
    numberOfTest: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    addMoreText: {
        fontSize: wp(4.5),
        fontWeight: '500',
        color: colors.primary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        // paddingBottom: hp(2),
        // paddingTop: hp(5),
        justifyContent: 'center',
        zIndex: 999,
    },
});

export default MyCartScreen;
