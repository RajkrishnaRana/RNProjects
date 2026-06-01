import {ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../common/colors';
import {useAuthStore} from '../../store/authStore';
import NoDataFound from '../../components/lottieComponent/NoDataFound';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {postData} from '../../utils/apiHelper';
import OptionModal from '../../components/modal/OptionModal';
import Toast from 'react-native-toast-message';
import {SkaletonView, ANIMATION_TYPE, ANIMATION_DIRECTION} from 'react-native-skaleton-kit';
import {useQuery, useQueryClient} from '@tanstack/react-query';

interface LeaveData {
    _id: string;
    supervisor: string;
    dateFrom: string;
    dateTo: string;
    days: number;
    appliedAt: string;
    approved: boolean;
    leaveTypeName: string;
    supervisorCode: string;
    supervisorEmail: string;
}
export default function HistoryScreen() {
    const queryClient = useQueryClient();

    // GLOBAL STATES ------------------------------------>
    const {token, deviceId, logout} = useAuthStore();

    // const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);

    // FETCH API HANDLING ------------------------------->
    const fetchData = async () => {
        const initialPostData = {
            token: token,
            deviceId: deviceId,
        };
        const url = 'https://illimitable.in/app/mobile/my-leave-history.json';
        const res = await postData(url, initialPostData, logout);
        return res?.docs ?? [];
    };
    const {isLoading, error, data} = useQuery({
        queryKey: ['leaveHistory'],
        queryFn: fetchData,
    });

    // RENDER ITEM FLATLIST ------------------------------------------->
    const renderItem = ({item}: {item: LeaveData}) => {
        const statusStyle = item?.approved === true ? styles.approvedStatus : styles.requestedStatus;

        const statusTextStyle = item?.approved === true ? styles.approvedStatusText : styles.requestedStatusText;

        const dotColor = item?.leaveTypeName === 'Casual Leave' ? '#06D6A0' : '#FF9F1C';

        // DELETE FUNCTION----------------------------------
        const deleteApiCall = async () => {
            try {
                const apiData = {
                    token: token,
                    deviceId: deviceId,
                    leaveId: item._id,
                };
                console.log(apiData);

                const response = await postData('https://illimitable.in/app/mobile/delete-leave-application.json', apiData, logout);
                console.log(response);

                if (!response.status) {
                    console.log(response.msg);
                    Toast.show({
                        type: 'error',
                        text1: response.msg || 'Error on Deleting Leaves',
                        visibilityTime: 4000,
                    });
                    return;
                }

                await Promise.all([
                    queryClient.refetchQueries({queryKey: ['myLeaveBalance']}),
                    queryClient.refetchQueries({queryKey: ['leaveHistory']}),
                    queryClient.refetchQueries({queryKey: ['leaveApprovals']}),
                ]);
                Toast.show({
                    type: 'success',
                    text1: 'Leave Request Deleted Successfully',
                    visibilityTime: 4000,
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error on Deleting Leaves',
                    visibilityTime: 4000,
                });
                console.log(error);
            }
        };

        function handlePress() {
            setModalVisible(true);
        }

        return (
            <View style={styles.leaveItem}>
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

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: wp(2),
                        }}>
                        <View style={statusStyle}>
                            <Text style={statusTextStyle}>{item?.approved === true ? 'Approved' : 'Pending'}</Text>
                        </View>
                        {item?.approved !== true && (
                            <TouchableOpacity
                                onPress={() => {
                                    handlePress();
                                    // console.log('Deleted');
                                }}>
                                <IconMaterialCommunityIcons name="delete-circle-outline" size={wp(10)} color={Colors.RED} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text style={styles.leaveDateRange}>
                    {item?.dateFrom} - {item?.dateTo}
                </Text>
                <Text style={styles.leaveDateRange}>({item?.days} days)</Text>

                <View style={styles.appliedAtSupervisorRow}>
                    <Text style={styles.leaveDate}>{item?.appliedAt}</Text>
                    <Text style={styles.leaveDate}>{item?.supervisor}</Text>
                </View>
                {/* <View style={styles.divider} /> */}
                <OptionModal
                    dialogueText="Do you want to delete your leave request?"
                    deleteButtonEnable={true}
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    functionCall2={deleteApiCall}
                />
            </View>
        );
    };

    // LOADING AND NO DATA ERROR HANDLING ------------------------------------------->
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
            // <SkaletonView viewHeight={100} animationType={ANIMATION_TYPE.shiver} direction={ANIMATION_DIRECTION.leftToRight} viewWidth={'100%'} />
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
                        }}>
                        <Text style={styles.emptyText}>No leave history found.</Text>
                    </View>
                }
            />
            {console.log(data)}
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
