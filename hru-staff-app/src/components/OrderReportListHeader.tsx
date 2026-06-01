import {
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useAuthStore} from '../store/authStore';
import {
    startCaptureLocationTask,
    stopCaptureLocationTask,
} from '../utils/foregroundTask';
import DatePickerModal from './Modal/DatePickerModal';

export default function OrderReportListHeader() {
    const {logout, userData} = useAuthStore();

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <View style={{marginLeft: wp(2)}}>
                    <Text style={styles.subText}>{userData?.name}'s</Text>
                    <Text style={styles.mainText}>Work Queue</Text>
                </View>
                <View style={styles.iconsContainer}>
                    {/* Date Range Button */}
                    <DatePickerModal />

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => {
                            Alert.alert(
                                'Logout',
                                'Are you sure you want to logout?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            stopCaptureLocationTask();
                                            logout();
                                        },
                                    },
                                ],
                            );
                        }}>
                        <AntDesignIcon
                            name="logout"
                            size={wp(5)}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 0 : hp(5),
        paddingHorizontal: wp(3),
        backgroundColor: 'white',
        borderBottomEndRadius: wp(6),
        borderBottomStartRadius: wp(6),
        paddingBottom: hp(0.5),
        boxShadow: colors.primaryShadowColor2,
        marginBottom: hp(1),
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: hp(1.5),
        alignItems: 'flex-end',
    },
    subText: {
        fontSize: wp(4),
        fontWeight: '500',
        color: colors.grey,
    },
    mainText: {
        fontSize: wp(7),
        fontWeight: '900',
        color: colors.primary,
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'baseline',
    },
    iconContainer: {
        height: wp(10),
        width: wp(10),
        borderRadius: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: colors.primaryShadowColor,
    },
});
