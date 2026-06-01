import { RefreshControl, ToastAndroid, Vibration } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import ScreenNameCard from '../components/Cards/ScreenNameCard';
import { FlashList } from '@shopify/flash-list';
import PageLoading from '../components/PageLoading';
// import ErrorComponent from '../components/ErrorComponent';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../services/apiServices';
import { useAppSelector } from '../hooks/typedReduxHooks';
import GeolocationCard from '../components/Cards/GeolocationCard';
import BackgroundGradient from '../components/BackgroundGradient';
import { mmkv } from '../store/mmkvStorage';
import NetInfo from '@react-native-community/netinfo';
import ErrorComponent from '../components/ErrorComponent';

export default function Dashboard() {
    const { userData, baseURL } = useAppSelector(state => state.auth);

    // DATA FETCHING ------------------------>
    const url = `${baseURL}/user-forms.json`;
    const payload = {
        token: userData?.token,
    };
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['dashboard', userData?.token],
        queryFn: () => postData(url, payload),
        select: data => {
            return data?.doc;
        },
    });

    // LOGIC HANDLING ----------------------->
    const { refreshLoading, setRefreshLoading } = useDashboard(data);

    const onRefresh = async () => {
        setRefreshLoading(true);
        await refetch();
        ToastAndroid.show('Refreshed', ToastAndroid.SHORT);
        Vibration.vibrate(100);
        setRefreshLoading(false);
    };

    /* =====  NETWORK-AWARE UPLOADER  ===== */
    const uploadLocalData = useCallback(async () => {
        const raw = mmkv.getString('backgroundFormData');
        const queue = raw ? JSON.parse(raw) : [];
        if (!queue.length) return; // nothing to do

        let lastOk = -1;
        for (let i = 0; i < queue.length; i++) {
            try {
                console.log('queue[i]', queue[i]);
                const res = await postData(`${baseURL}/submit-user-forms.json`, queue[i], true);
                if (!res.status) throw new Error(res.msg);
                lastOk = i;
                console.log('success for the data is ', lastOk);
            } catch (e: any) {
                ToastAndroid.show(e?.message || 'Local upload failed', ToastAndroid.SHORT);
                break;
            }
        }

        /*  -----  Handle post processing  ----- */
        const restQueue = queue.slice(lastOk + 1);
        if (restQueue.length) {
            mmkv.set('backgroundFormData', JSON.stringify(restQueue));
        } else {
            mmkv.delete('backgroundFormData');
            Vibration.vibrate(20);
            ToastAndroid.show('All Local data uploaded', ToastAndroid.SHORT);
        }
    }, [baseURL]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) uploadLocalData();
        });
        return unsubscribe; // clean-up on unmount
    }, [uploadLocalData]);

    return (
        <BackgroundGradient>
            <GeolocationCard sectionData={data?.datasources?.SECTIONS} />

            {isPending ? (
                <PageLoading />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <>
                    <FlashList
                        data={data?.forms}
                        renderItem={({ item }: { item: Screen }) => <ScreenNameCard key={item.name} screen={item} len={data?.forms?.length} />}
                        estimatedItemSize={100}
                        keyExtractor={(item: Screen) => item.name}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />}
                        numColumns={data?.forms?.length >= 4 ? 2 : 1}
                    />
                </>
            )}
        </BackgroundGradient>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     button: {
//         backgroundColor: 'green',
//         padding: 10,
//     },
//     text: {
//         color: 'white',
//     },
// });
