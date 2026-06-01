import React, {useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import OptionModal from '../../components/modal/OptionModal';
import {postData} from '../../utils/apiHelper';
import {useAuthStore} from '../../store/authStore';
import {Colors} from '../../common/colors';
import NoDataFound from '../../components/lottieComponent/NoDataFound';
import Toast from 'react-native-toast-message';
import {useQuery, useQueryClient} from '@tanstack/react-query';

interface ApprovalData {
    _id: string;
    dateFrom: string;
    dateTo: string;
    days: number;
    appliedAt: string;
    leaveTypeName: string;
    user: string;
    userCode: string;
    userEmail: string;
}

export default function ApprovalsScreen() {
    const queryClient = useQueryClient();

    // ZUSTAND STATES --------------------------------------------------------------
    const {token, logout, deviceId} = useAuthStore();
    const [isModalVisible, setModalVisible] = useState(false);

    // FETCH API HANDLING ------------------------------->
    const fetchData = async () => {
        const initialPostData = {
            token: token,
            deviceId: deviceId,
        };
        const url = 'https://illimitable.in/app/mobile/approval-pending-leaves.json';
        const res = await postData(url, initialPostData, logout);
        return res;
    };
    const {isLoading, error, data} = useQuery({
        queryKey: ['leaveApprovals'],
        queryFn: fetchData,
    });
    const renderItem = ({item}: {item: ApprovalData}) => {
        // APPROVE FUNCTION----------------------------------
        const approveApiCall = async () => {
            try {
                const apiData = {
                    token: token,
                    deviceId: deviceId,
                    _id: item._id,
                };
                const response = await postData('https://illimitable.in/app/mobile/approve-leave.json', apiData, logout);
                console.log(response);

                if (!response.status) {
                    Toast.show({
                        type: 'error',
                        text1: response.msg || 'Error on Approving Leaves',
                        visibilityTime: 4000,
                    });
                    console.log(response.msg);
                    return;
                }

                await Promise.all([
                    queryClient.refetchQueries({queryKey: ['myLeaveBalance']}),
                    queryClient.refetchQueries({queryKey: ['leaveHistory']}),
                    queryClient.refetchQueries({queryKey: ['leaveApprovals']}),
                    queryClient.invalidateQueries({queryKey: ['my-attendance-today']}),
                ]);
                Toast.show({
                    type: 'success',
                    text1: 'Leave Request Approved Successfully',
                    visibilityTime: 4000,
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error on Approving Leaves',
                    visibilityTime: 4000,
                });
                console.log(error);
            }
        };

        function handlePress() {
            setModalVisible(true);
        }

        const dotColor = item?.leaveTypeName === 'Casual Leave' ? '#06D6A0' : '#FF9F1C';

        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        handlePress();
                    }}
                    style={styles.leaveItem}>
                    <View style={styles.leaveItemHeader}>
                        <View style={styles.leaveTypeContainer}>
                            <View
                                style={[
                                    styles.leaveDot,
                                    {
                                        backgroundColor: dotColor,
                                    },
                                ]}
                            />
                            <Text style={styles.leaveType}>{item?.leaveTypeName}</Text>
                        </View>
                        {/* <View style={statusStyle}>
                               <Text style={statusTextStyle}>
                                   {item?.approved === true
                                       ? 'Approved'
                                       : item?.approved === false
                                       ? 'Rejected'
                                       : 'Pending'}
                               </Text>
                           </View> */}
                    </View>
                    <Text style={styles.leaveDateRange}>
                        {item?.dateFrom} - {item?.dateTo}
                    </Text>
                    <Text style={styles.leaveDateRange}>({item?.days} days)</Text>

                    <View style={styles.appliedAtSupervisorRow}>
                        <Text style={styles.leaveDate}>{item?.appliedAt}</Text>
                        <Text style={styles.leaveDate}>{item?.user}</Text>
                    </View>
                    {/* <View style={styles.divider} /> */}
                </TouchableOpacity>

                <OptionModal
                    dialogueText="Do you want to approve the leave request?"
                    approveButtonEnable={true}
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    functionCall1={approveApiCall}
                    // functionCall2={deleteApiCall}
                />
            </>
        );
    };

    if (isLoading) {
        return (
            <View
                style={{
                    marginTop: hp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size={wp(10)} color={Colors.LIGHT_BLUE} />
            </View>
        );
    }

    if (error || !data) {
        return <NoDataFound customMessage={error} />;
    }

    return (
        <>
            <FlatList
                data={data?.docs}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No pending approvals.</Text>}
            />
            <View style={{height: hp(5)}} />
        </>
    );
}

const styles = StyleSheet.create({
    loader: {marginTop: hp(10)},
    list: {paddingBottom: hp(5), paddingHorizontal: wp(3), marginTop: hp(2)},
    card: {
        backgroundColor: '#1B263B',
        padding: wp(4),
        marginBottom: hp(1.5),
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
    },
    user: {fontSize: wp(3.8), color: '#A0A9B8', marginBottom: hp(0.5)},
    date: {fontSize: wp(3.8), color: '#A0A9B8', marginBottom: hp(0.5)},
    appliedAt: {fontSize: wp(3.5), color: '#888'},
    emptyText: {
        fontSize: wp(4.5),
        textAlign: 'center',
        marginTop: hp(18),
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
        marginBottom: hp(0.8),
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
    rejectedStatus: {
        backgroundColor: Colors.RED,
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(2.5),
        borderRadius: wp(5),
    },
    approvedStatusText: {
        color: 'white',
        fontSize: wp(3.5),
    },
    rejectedStatusText: {
        color: 'white',
        fontSize: wp(3.5),
    },
    requestedStatus: {
        backgroundColor: '#F5F5F5',
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(2.8),
        borderRadius: wp(5),
    },
    requestedStatusText: {
        color: '#888',
        fontSize: wp(3.5),
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
});
