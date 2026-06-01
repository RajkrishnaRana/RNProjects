import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../common/colors';
import {useAuthStore} from '../../store/authStore';
import NoDataFound from '../../components/lottieComponent/NoDataFound';
import LateCard from '../../components/cards/LateCard';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../utils/apiHelper';
import {useRefetchOnFocus} from '../../hooks/useRefetchOnWindowFocus';

interface LeaveData {
    _id: string;
    supervisor: string;
    dateFrom: string;
    dateTo: string;
    days: number;
    appliedAt: string;
    approved: boolean;
    leaveTypeName: string;
}

interface Props {
    showmonthDependency: {showDate: string; exactDate: Date};
}

export default function HistoryScreen({showmonthDependency}: Props) {
    // GLOBAL STATES ------------------------------------>
    const {token, deviceId, logout} = useAuthStore();

    // FETCH API HANDLING ------------------------------->
    const fetchQuery = async () => {
        const startDate = new Date(showmonthDependency.exactDate.getTime());
        startDate.setDate(1);

        const endDate = new Date(showmonthDependency.exactDate.getTime());
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);

        const url = `https://illimitable.in/app/mobile/my-late-attendance.json`;
        const initialPostData = {
            token: token,
            deviceId: deviceId,
            dateFrom: startDate.getTime(),
            dateTo: endDate.getTime(),
        };

        const res = await postData(url, initialPostData, logout);
        // console.log('res', res);
        return res?.docs ?? [];
    };

    const {isLoading, error, data} = useQuery({
        queryKey: ['lateHistory', showmonthDependency.exactDate],
        queryFn: fetchQuery,
        enabled: !!showmonthDependency,
    });

    // Triggers refetch every time the screen is focused
    useRefetchOnFocus(['lateHistory']);

    // RENDER ITEM FLATLIST ------------------------------------------->
    const renderItem = ({item}: {item: LeaveData}) => {
        // console.log(item);

        return <LateCard item={item} />;
    };

    // LOADING AND NO DATA ERROR HANDLING ------------------------------------------->
    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: wp(2),
                }}>
                <ActivityIndicator size="large" color={Colors.LIGHT_BLUE} style={styles.loader} />
            </View>
        );
    }

    if (error || !data) {
        return <NoDataFound customMessage={error} />;
    }

    return (
        <>
            <FlatList
                data={data}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: hp(20),
                        }}>
                        <Text style={styles.emptyText}>No late history found.</Text>
                    </View>
                }
            />
            <View style={{height: hp(5)}} />
        </>
    );
}

const styles = StyleSheet.create({
    loader: {marginTop: hp(5)},
    list: {paddingBottom: hp(5), paddingHorizontal: wp(3), marginTop: hp(2)},
    emptyText: {
        fontSize: wp(4.5),
        textAlign: 'center',
        marginTop: hp(10),
        color: Colors.GREY,
    },
    leaveListContainer: {
        marginBottom: hp(1),
    },
    leaveItem: {
        marginBottom: hp(1.5),
        borderBottomWidth: wp(0.4),
        borderBottomColor: '#E0E1DD',
        borderStyle: 'dashed',
        paddingBottom: hp(0.5),
    },
    leaveItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    leaveTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaveDot: {
        width: wp(3),
        height: wp(3),
        borderRadius: wp(10),
        marginRight: wp(1.2),
    },
    leaveType: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: '#333',
    },
    approvedStatus: {
        backgroundColor: '#4CAF50',
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(2.5),
        borderRadius: wp(5),
    },
    // rejectedStatus: {
    //     backgroundColor: Colors.RED,
    //     paddingVertical: hp(0.6),
    //     paddingHorizontal: wp(2.5),
    //     borderRadius: wp(5),
    // },
    approvedStatusText: {
        color: 'white',
        fontSize: wp(3.5),
        // fontWeight: '300',
    },
    // rejectedStatusText: {
    //     color: 'white',
    //     fontSize: wp(3.5),
    // },
    requestedStatus: {
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(2.8),
        borderRadius: wp(5),
    },
    requestedStatusText: {
        color: Colors.WHITE,
        fontSize: wp(3.5),
        // fontWeight: '300',
    },
    leaveDateRange: {
        fontSize: wp(4),
        color: '#888',
        // marginBottom: hp(1),
    },
    appliedAtSupervisorRow: {
        marginTop: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leaveDate: {
        fontSize: wp(3.2),
        color: '#888',
    },
    // leaveTypesContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     marginBottom: hp(5),
    // },
    // divider: {
    //     height: 1,
    //     backgroundColor: '#E0E0E0',
    //     // backgroundColor: 'red',
    //     marginVertical: 10,
    // },
});
