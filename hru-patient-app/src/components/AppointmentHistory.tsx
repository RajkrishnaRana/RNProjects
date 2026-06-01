import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BASE_URL} from '../config';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import {tokenExpiredMsg} from '../utils';
import {useAuthStore} from '../store/authStore';
import moment from 'moment';
import HorizontalList from '../screens/HorizontalList';
import Appointment, {AppointmentItemProps} from './Appointment';
import {queryClient} from '../../App';
import ProviderRatingModal from './Modal/ProviderRatingModal';
import Modal from 'react-native-modal';
import {isIos} from '../utils/platform';
import {isTab} from '../utils/isTab';

export default function AppointmentHistory() {
    // GLOBAL STATES ------------------------------>
    const {token, logout} = useAuthStore();

    // LOCAL STATES ------------------------------->
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [dataForRating, setDataForRating] = useState<any>();

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientappointmentlistdaterange`;
    const {isPending, error, data} = useQuery({
        queryKey: ['appointmentHistory'],
        queryFn: () =>
            postData(url, {
                token: token,
                start: moment().subtract(2, 'month').startOf('day').valueOf(),
                end: moment().endOf('day').valueOf(),
            }),
        select: data => {
            // if (data?.tokenExpired) tokenExpiredMsg(logout);

            let finalData = [...data?.doc?.completedAppointments?.filter((i: any) => i.status === 2)];
            console.log('appointment details', finalData);

            finalData?.sort((a, b) => Number(b.startTime) - Number(a.startTime));
            finalData = finalData?.slice(-6);
            return finalData;
            // return data;
        },
    });

    //LOCAL FUNCTIONS ------------------------------------->
    const renderRatingModal = async (id: string) => {
        try {
            setLoading(true);
            setSelectedId(id);
            const url = `${BASE_URL}/hru/Patientappapi/${id}/patientappointmentdetails`;
            const fetchedData = await queryClient.fetchQuery({
                queryKey: ['appointMentDetailsData' + id],
                queryFn: () => postData(url),
            });
            console.log('fetchedData', fetchedData);
            setDataForRating(fetchedData?.doc);
            // console.log(fetchedData?.doc);
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            console.log(isModalVisible, 'isModalVisible');
        }
    };

    const renderItem = ({item}: {item: AppointmentItemProps}) => (
        <View style={{marginRight: wp(1), width: isIos() ? wp(93) : wp(90)}}>
            <Appointment item={item} isRating renderRatingModal={renderRatingModal} />
        </View>
    );

    if (data?.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rate Your Experience</Text>
            <Text style={styles.subtitle}>We’d love for you to rate your experience with us ...</Text>
            {isPending ? (
                <ActivityIndicator color={colors.primary} size={wp(5)} />
            ) : error ? (
                <Text style={{color: 'red'}}>Something went wrong</Text>
            ) : (
                <HorizontalList
                    data={data}
                    renderItem={renderItem}
                    emptyListText="No Appointment for Ratings available ... "
                    // pagingEnabled={isIos() ? false : true}
                />
            )}

            {loading && <ActivityIndicator color={colors.primary} size={isTab ? wp(4) : wp(8)} />}

            <ProviderRatingModal id={selectedId} data={dataForRating} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: isTab ? hp(1.5) : hp(4),
        marginBottom: isTab ? hp(1.5) : hp(0),
    },
    header: {
        fontSize: isTab ? wp(3) : wp(5),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    subtitle: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: '#666',
        marginTop: 4,
    },
});
