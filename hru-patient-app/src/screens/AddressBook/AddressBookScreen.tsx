import React, { useState } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import AddressItemCard from '../../components/AddressItemCard';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { tokenExpiredMsg } from '../../utils';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import { BASE_URL } from '../../config';
import BackgroundGradient from '../../components/BackgroundGradient';
import TabBarParent from '../../components/TabBarParent';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import { FlashList } from '@shopify/flash-list';
import { queryClient } from '../../../App';

export interface AddressItemProps {
    firstName: string;
    middleName?: string;
    lastName: string;
    address1: string;
    address2?: string;
    state?: string;
    city?: string;
    pin: string;
    tags?: {
        primary: boolean;
        billing: boolean;
        shipping: boolean;
    };
}

const ListEmpty = () => <ListEmptyComponent customText="No addresses found" />;

export default function AddressBookScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ---------------------------------->
    const { token, logout } = useAuthStore();

    // LOCAL STATES -------------------------------->
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientaddnewaddress`;
    const { isPending, error, data } = useQuery({
        queryKey: ['addressData'],
        queryFn: () => postData(url, { token: token }),
        // refetchInterval: 3000,
        select: d => {
            if (d?.tokenExpired) tokenExpiredMsg(logout);
            console.log('addressData', d?.doc?.addresses);
            const addressArray = [...d?.doc?.addresses].sort((a, b) => {
                const isPrimaryA = a.isPrimaryAdd || false;
                const isPrimaryB = b.isPrimaryAdd || false;

                if (isPrimaryA && !isPrimaryB) return -1;
                if (!isPrimaryA && isPrimaryB) return 1;
                return 0;
            });
            return { fullData: d?.doc, addresses: addressArray };
        },
    });

    // LOCAL STATES --------------------------------->

    // LOCAL FUNCTIONS ------------------------------->
    const renderAddressItem = ({ item }: { item: Address }) => <AddressItemCard item={item} stateData={data?.fullData?.state} />;

    const handleAddNewAddress = () => {
        // console.log(data?.state);
        navigation.push('AddAddress', { mode: 'add', stateData: data?.fullData?.state });
    };

    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['addressData'],
        });
        setRefresh(false);
    };

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <ErrorComponent />
                    ) : (
                        <>
                            <FlashList
                                data={data?.addresses}
                                renderItem={renderAddressItem}
                                keyExtractor={(item, index) => item?.addressLineOne + index.toString()}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={ListEmpty}
                                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                            />

                            <BigButton
                                title="Add New Address"
                                onPress={handleAddNewAddress}
                                customStyle={{
                                    marginBottom: hp(2),
                                    marginTop: hp(1),
                                    marginHorizontal: wp(5),
                                }}
                            />
                        </>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(1),
        // backgroundColor: colors.white,
    },
    list: {
        paddingBottom: hp(10),
    },
});
