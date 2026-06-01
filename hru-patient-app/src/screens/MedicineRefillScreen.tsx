import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import CustomCalendar, { CalendarDateType } from '../components/CustomCalendar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import moment from 'moment';
import { useNavigation } from '../hooks/useNavigation';
import PageLoading from '../components/LottieComponent/PageLoading';
import ErrorComponent from '../components/ErrorComponent';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../api';
import MedicineRefillCard from '../components/Cards/MedicineRefillCard';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import { queryClient } from '../../App';
import BackgroundGradient from '../components/BackgroundGradient';
import TabBarParent from '../components/TabBarParent';
import { isTab } from '../utils/isTab';

export default function MedicineRefillScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------->
    const { token } = useAuthStore();
    const setSelectedMedicine = useMedicineIntakeStore(s => s.setSelectedMedicine);

    // LOCAL STATES ----------------------------->
    const [selectedDate, setSelectedDate] = useState<CalendarDateType>();
    const [loading, setLoading] = useState<boolean>(false);

    // DATA FECHING ----------------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientdatewisemedicinerefillreminder`;
    const payload = {
        token: token,
        start: selectedDate?.startTime,
        end: selectedDate?.startTime,
        type: 'DAY',
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['medicineRefill' + selectedDate?.startTime],
        queryFn: () => postData(url, payload),
        refetchOnWindowFocus: true,
        select: d => {
            console.log(d?.docs[0]?.records);
            return d?.docs[0]?.records;
        },
    });

    // SIDE EFFECTS ----------------------------->
    // useEffect(() => {
    //     refetch();
    // }, [selectedDate]);

    // useEffect(() => {
    //     const monthlyData = async() => {
    //         const payload = {
    //             token: token,
    //             start: '',
    //             end: '',
    //         }

    //         const res = await postData(url, payload);
    //     }
    // }, [])

    return (
        <TabBarParent>
            <View style={styles.container}>
                <CustomCalendar setSelectedDate={setSelectedDate} url={url} type="Refill" />

                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{moment(selectedDate?.startTime).format('MMM D')}'s Medicine Refill : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CreateMedicineRefillScreen', {
                                queryKey: `medicineRefill${selectedDate?.startTime}`,
                            });
                            setSelectedMedicine('');
                        }}
                    >
                        {/* <AntDesignIcon
                        name="pluscircle"
                        size={wp(7)}
                        color={colors.primary}
                        // onPress={() => setIsVisible(true)}
                    /> */}
                        <View style={styles.addContainer}>
                            <Text style={styles.addText}>Add +</Text>
                        </View>
                    </TouchableOpacity>
                    {/* <CreateMedicineItakeModal /> */}
                </View>

                <BackgroundGradient customStyle={styles.detailContainer}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => {
                                    setLoading(true);
                                    queryClient.invalidateQueries({
                                        queryKey: [`medicineRefill${selectedDate?.startTime}`],
                                    });
                                    setLoading(false);
                                }}
                            />
                        }
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                    >
                        {isPending ? (
                            <PageLoading />
                        ) : error ? (
                            <ErrorComponent />
                        ) : (
                            <>
                                {data?.length > 0 ? (
                                    <>
                                        {data?.map((i: any, index: number) => (
                                            <MedicineRefillCard key={index} data={i} queryKey={`medicineRefill${selectedDate?.startTime}`} />
                                        ))}
                                    </>
                                ) : (
                                    <View style={styles.notFountContainer}>
                                        <Text style={{ color: colors.darkGrey }}>No medicine refill for today</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </BackgroundGradient>
            </View>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    contentContainerStyle: { flexGrow: 1 },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: wp(3),
    },
    headerContainer: {
        marginTop: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        fontSize: isTab ? wp(2.2) : wp(4),
        color: colors.black,
        // fontWeight: 'bold',
    },
    detailContainer: {
        flex: 1,
        marginVertical: hp(1),
        // borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        borderRadius: wp(3),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        marginBottom: hp(1),
        // backgroundColor: colors.backgroundColor,
    },
    notFountContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addContainer: {
        backgroundColor: colors.primary,
        paddingVertical: isTab ? hp(0.5) : hp(1),
        paddingHorizontal: wp(3),
        borderRadius: isTab ? wp(3) : wp(5),
    },
    addText: {
        color: colors.white,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
});
