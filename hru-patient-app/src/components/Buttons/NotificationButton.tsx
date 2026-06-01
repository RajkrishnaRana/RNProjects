import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import { BASE_URL } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { isTab } from '../../utils/isTab';

export default function NotificationButton({ customStyle }: any) {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------------->
    const { token, logout } = useAuthStore();

    // LOCAL STATES ------------------------------->
    const [notificationLeft, setNotificationLeft] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientnotification`;
    const { isPending, error, data } = useQuery({
        queryKey: ['notificationData'],
        queryFn: () => postData(url, { token: token }),
        refetchOnWindowFocus: true, // Refetch when the app regains focus
        select: data => {
            if (data?.tokenExpired) return null;
            console.log(data);
            return data.docs;
        },
    });

    // LOCAL FUNCTIONS ------------------------------>
    const hasUnreadNotifications = useMemo(() => data?.some((d: any) => !d.readStatus), [data]);

    return (
        <TouchableOpacity onPress={() => navigation.push('Notification')}>
            <Image
                source={require('../../assets/icons/bell.png')}
                style={[
                    {
                        height: isTab ? wp(3.5) : wp(6),
                        width: isTab ? wp(3.5) : wp(6),
                        alignSelf: 'center',
                        tintColor: colors.primary,
                    },
                    customStyle,
                ]}
            />

            {hasUnreadNotifications && <View style={styles.notificationNumberContainer} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    notificationNumberContainer: {
        position: 'absolute',
        height: isTab ? wp(1) : wp(2),
        width: isTab ? wp(1) : wp(2),
        borderRadius: wp(2),
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        right: isTab ? wp(0.5) : wp(1.2),
        top: isTab ? hp(0.3) : hp(0.5),
    },
    notificationNumber: {
        color: colors.white,
        fontSize: wp(2.7),
    },
});
