import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import NotificationIcons from './NotificationIcons';
import moment from 'moment';
import { notificationFilterData } from '../constants/NotificationDummyData';
import { NotificationDataProps } from '../types/notificationTypes';
import { useNavigation } from '../hooks/useNavigation';
import Toast from 'react-native-simple-toast';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { queryClient } from '../../App';
import { isTab } from '../utils/isTab';

interface NotificationsProps {
    item: NotificationDataProps;
}

function Notification({ item }: NotificationsProps) {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------------->
    const { token } = useAuthStore();

    // LOCAL FUNCTIONS ------------------------------>
    const colorAndIcon = notificationFilterData.find(i => i.value === item.type);

    const handleNotificationPress = async () => {
        console.log(item);

        if (item?.category === 'LAB_NOTIFICATION') {
            const id = item.callback.split('/')[3];
            navigation.navigate('LabAppointmentDetails', { id: id });
        }

        if (item.type.split('_')[0] === 'APPOINTMENT' && item?.category === 'DOCTOR_NOTIFICATION') {
            const id = item.callback.split('/')[3];
            navigation.navigate('AppointmentDetails', { id: id });
        }

        if (item.type.split('_')[0] === 'PRESCRIBED') {
            const profileId = item.callback?.split('profileId=')[1];
            // console.log(profileId);
            navigation.push('Prescriptions', { profileId: profileId });
        }

        const payload = {
            token: token,
            notificationId: item._id,
        };

        const url = `${BASE_URL}/hru/Patientappapi/changenotificationstatus`;
        const res = await postData(url, payload);

        if (!res.status) {
            Toast.show(res.msg, Toast.SHORT);
            return;
        }

        queryClient.invalidateQueries({
            queryKey: ['notificationData'],
        });
    };

    // STYLING & RENDERING ------------------------------>
    const opacity = item.readStatus ? 0.6 : 1;

    return (
        <TouchableOpacity style={[styles.notificationContainer, { opacity }]} onPress={handleNotificationPress}>
            <View style={styles.detailContainer}>
                <NotificationIcons bgColor={colorAndIcon!?.color} src={colorAndIcon!?.imgSrc} />
                <Text style={styles.detail}>{item.msg}</Text>
            </View>

            <Text style={styles.date}>{moment(item.notificationCreatedAt).format('Do MMM, YYYY, hh:mm A')}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        borderRadius: wp(4),
        padding: wp(2),
        elevation: 2,
        marginBottom: isTab ? hp(1) : hp(1.5),
        backgroundColor: colors.white,
        marginHorizontal: wp(3),
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isTab ? wp(2) : wp(3),
    },
    detail: {
        fontSize: isTab ? wp(2.1) : wp(3.5),
        color: colors.darkGrey,
        flex: 1, // Make text take available space
        flexShrink: 1, // Allow text to shrink to fit
    },
    date: { fontSize: isTab ? wp(1.8) : wp(3), color: colors.darkBlue, textAlign: 'right' },
});

export default memo(Notification);
