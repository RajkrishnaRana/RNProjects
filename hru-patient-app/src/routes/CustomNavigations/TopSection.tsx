import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../../hooks/useNavigation';
import { BASE_URL } from '../../config';
import { getUniqueId } from 'react-native-device-info';
import { postData } from '../../api';
import Toast from 'react-native-simple-toast';
import { isTab } from '../../utils/isTab';

export default function TopSection() {
    const updatedUserData = useAuthStore(state => state.updatedUserData);
    const navigation = useNavigation();
    const { logout, token } = useAuthStore();

    const [loading, setLoading] = React.useState(false);

    const handlePress = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Ok',
                onPress: async () => {
                    try {
                        setLoading(true);
                        const id = await getUniqueId();
                        const url = `${BASE_URL}/hru/Patientappapi/removefcmtoken`;
                        const payload = {
                            token: token,
                            deviceId: id,
                        };
                        console.log('remove fcm token payload', payload);
                        const res = await postData(url, payload);

                        if (!res.status) {
                            Toast.show(res.msg, Toast.SHORT);
                            console.error('Error removing FCM token:', res);
                            return;
                        }

                        console.log('FCM Token removed successfully', res);
                        logout();
                        navigation.navigate('Home', { screen: 'DASHBOARD' });
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={{
                    width: isTab ? wp(15) : wp(24),
                    height: isTab ? hp(5.5) : hp(6.5),
                    marginLeft: wp(3),
                }}
            />

            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'MY PROFILE' })}>
                    <Image source={{ uri: updatedUserData?.imgLink }} style={styles.personIcon} resizeMethod="scale" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconContainer} onPress={handlePress}>
                    {loading ? (
                        <ActivityIndicator color={colors.primary} size={isTab ? wp(2.5) : wp(5)} />
                    ) : (
                        <AntDesignIcon name="logout" size={isTab ? wp(2.5) : wp(5)} color={colors.primary} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        gap: isTab ? wp(1.5) : wp(3),
        alignItems: 'center',
    },
    iconContainer: {
        height: isTab ? wp(6) : wp(11),
        width: isTab ? wp(6) : wp(11),
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.6,
        borderColor: colors.grey,
        marginRight: wp(3),
    },
    personIcon: {
        width: isTab ? wp(6) : wp(11),
        height: isTab ? wp(6) : wp(11),
        borderRadius: wp(6), // Circular icon
        elevation: 2,
        borderWidth: wp(0.01),
    },
});
