import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomCalendar, { CalendarDateType } from '../components/CustomCalendar';
import { BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import { queryClient } from '../../App';
import { postData } from '../api';
import MedicineCard from '../components/Cards/MedicineCard';
import PageLoading from '../components/LottieComponent/PageLoading';
import { useNavigation } from '../hooks/useNavigation';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import { useQuery } from '@tanstack/react-query';
import ErrorComponent from '../components/ErrorComponent';
import moment from 'moment';
import BackgroundGradient from '../components/BackgroundGradient';
import TabBarParent from '../components/TabBarParent';
import { isTab } from '../utils/isTab';
// import {useNavigation} from '@react-navigation/native';

export default function MedicineIntakeScreen() {
    // GLOBAL STATES --------------------------->
    const { token } = useAuthStore();
    const navigation = useNavigation();

    // ZUSTAND STATES --------------------------------------
    const { setSelectedMedicine } = useMedicineIntakeStore();

    // LOCAL STATES ----------------------------->
    const [selectedDate, setSelectedDate] = useState<CalendarDateType>();
    const [loading, setLoading] = useState<boolean>(false);
    // const [shownData, setShownData] = useState<any>();
    // const [isVisible, setIsVisible] = useState<boolean>(false);

    // DATA FECHING ----------------------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientdatewisemedicineintakereminder`;
    const payload = {
        token: token,
        start: selectedDate?.startTime,
        end: selectedDate?.startTime,
        type: 'DAY',
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['medicineIntake' + selectedDate?.startTime],
        queryFn: () => postData(url, payload),
        refetchOnWindowFocus: true,
        select: d => {
            console.log(d?.dayData);
            return d?.dayData;
        },
    });

    // SIDE EFFECTS ----------------------------->
    // useEffect(() => {
    //     refetch();
    // }, [refetch]);

    return (
        <TabBarParent>
            <View style={styles.container}>
                <CustomCalendar setSelectedDate={setSelectedDate} url={url} type="Intake" />
                {/* {console.log('medicineIntake' + selectedDate?.startTime)} */}
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{moment(selectedDate?.startTime).format('MMM D')}'s Medicine Intake : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CreateMedicineItakeScreen', {
                                queryKey: `medicineIntake${selectedDate?.startTime}`,
                            });
                            setSelectedMedicine('');
                        }}
                    >
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
                                onRefresh={async () => {
                                    setLoading(true);
                                    await queryClient.invalidateQueries({
                                        queryKey: [`medicineIntake${selectedDate?.startTime}`],
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
                                            <MedicineCard item={i} key={index} queryKey={`medicineIntake${selectedDate?.startTime}`} />
                                        ))}
                                    </>
                                ) : (
                                    <View style={styles.notFountContainer}>
                                        <Text style={{ color: colors.darkGrey }}>No medicine intake for today</Text>
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
    contentContainerStyle: {
        flexGrow: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // flexWrap: 'wrap',
    },
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
        fontSize: isTab ? wp(2.3) : wp(4),
        color: colors.black,
        // fontWeight: '400',
    },
    detailContainer: {
        flex: 1,
        marginVertical: hp(1),
        // borderWidth: wp(0.2),
        // borderColor: colors.backgroundColor,
        borderRadius: wp(3),
        paddingVertical: hp(1),
        // paddingHorizontal: wp(3),
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
