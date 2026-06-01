import { StyleSheet, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import StackAppBar from '../components/AppHeaders/StackAppBar';
import FilterModal from '../components/Modal/NotificationFilterModal';
import Notification from '../components/Notification';
import { notificationFilterData } from '../constants/NotificationDummyData';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../api';
import { useAuthStore } from '../store/authStore';
import PageLoading from '../components/LottieComponent/PageLoading';
import ErrorComponent from '../components/ErrorComponent';
import { tokenExpiredMsg } from '../utils';
import { NotificationDataProps } from '../types/notificationTypes';
import { BASE_URL } from '../config';
import BackgroundGradient from '../components/BackgroundGradient';
import TabBarParent from '../components/TabBarParent';
import { LegendList } from '@legendapp/list';
import { FlashList } from '@shopify/flash-list';

export interface NotificationType {
    _id: string;
    type: 'APPOINTMENT_CREATION';
    category: 'DOCTOR_NOTIFICATION';
    icon: string;
    readStatus: boolean;
    notificationCreatedAt: string;
    msg: string;
    callback: string;
}

export default function NotificationScreen() {
    // GLOBAL STATES ------------------------------->
    const { token, logout } = useAuthStore();

    // LOCAL STATES ------------------------------->
    const [notificationFilterDataState, setNotificationFilterData] = useState(notificationFilterData);
    const [notificationData, setNotificationData] = useState<NotificationDataProps[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientnotification`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['notificationData'],
        queryFn: () => postData(url, { token: token }),
        select: d => {
            if (d?.tokenExpired) tokenExpiredMsg(logout);
            console.log(d);
            return d.docs;
        },
    });

    // LOCAL FUNCTIONS ------------------------------>
    const renderItem = ({ item }: { item: NotificationDataProps }) => <Notification item={item} />;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    // SIDE EFFECTS ---------------------------------->
    useEffect(() => {
        setNotificationData(data);
    }, [data]);

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    <StackAppBar
                        title="Notification"
                        rightIcon={
                            <FilterModal
                                notificationFilterDataState={notificationFilterDataState}
                                setNotificationFilterData={setNotificationFilterData}
                                setNotificationData={setNotificationData}
                                data={data as NotificationDataProps[]}
                            />
                        }
                    />

                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <ErrorComponent />
                    ) : (
                        <View style={styles.bodyContainer}>
                            <LegendList
                                data={notificationData}
                                renderItem={renderItem}
                                decelerationRate={0.8}
                                keyExtractor={item => item._id}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                                contentContainerStyle={styles.listContainer}
                                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                                estimatedItemSize={110}
                                recycleItems
                            />
                        </View>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bodyContainer: {
        flex: 1,
    },
    listContainer: {
        paddingTop: hp(2),
    },
});
