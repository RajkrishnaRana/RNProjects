import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import NotificationButton from '../Buttons/NotificationButton';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../../hooks/useNavigation';
import { colors } from '../../common/colors';
import { useCurrentLocationStore } from '../../store/currentLocationStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationChoosingModal from '../Modal/LocationChoosingModal';
import { isTab } from '../../utils/isTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardHeader({ isLoading }: { isLoading: boolean }) {
    const navigation = useNavigation();
    const { isAuthenticated, updatedUserData } = useAuthStore();
    const { nearestLocation, setLocationModal } = useCurrentLocationStore();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container]}>
            <View style={{ gap: hp(0.6) }}>
                {isAuthenticated ? (
                    <>
                        <Text style={styles.hiText}>Hi, {updatedUserData?.name}</Text>
                    </>
                ) : (
                    <>
                        {isTab ? (
                            <>
                                <Text style={styles.name}>
                                    <Text style={styles.hiText}>Hey !,</Text> Ready to explore
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.hiText}>Hey !</Text>
                                <Text style={styles.name}>Ready to explore</Text>
                            </>
                        )}
                    </>
                )}
                <TouchableOpacity
                    onPress={() => setLocationModal(true)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.black} size={isTab ? wp(2) : wp(3)} />
                    ) : (
                        <>
                            <MaterialIcons name="location-pin" size={isTab ? wp(2.5) : wp(4)} color={colors.primary} />
                            <Text style={styles.locationText}>{nearestLocation?.city || '--'}</Text>
                            <MaterialCommunityIcons name="chevron-down" size={isTab ? wp(2) : wp(4)} color={colors.lightBlack} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
            {isAuthenticated ? (
                <View style={styles.detailContainer}>
                    <NotificationButton
                        customStyle={{
                            height: isTab ? wp(3.5) : wp(6.5),
                            width: isTab ? wp(3.5) : wp(6.5),
                        }}
                    />
                    <TouchableOpacity onPress={() => navigation.openDrawer()} onLongPress={() => navigation.navigate('MY PROFILE')}>
                        <Image source={{ uri: updatedUserData?.imgLink }} style={styles.personIcon} resizeMethod="scale" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.loginContainer} onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.name, { color: colors.primary }]}>Login</Text>
                </TouchableOpacity>
            )}

            <LocationChoosingModal />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hiText: {
        fontSize: isTab ? wp(3) : wp(5.5),
        fontWeight: '500',
        color: colors.lightBlack,
        width: wp(50),
    },
    name: {
        fontSize: isTab ? wp(3) : wp(5),
        color: colors.lightBlack,
        fontWeight: '600',
    },
    locationText: {
        fontSize: isTab ? wp(1.5) : wp(3),
        color: colors.lightBlack,
        fontWeight: '600',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isTab ? wp(3) : wp(5),
        paddingRight: wp(1),
        paddingLeft: isTab ? wp(3) : wp(5),
        paddingVertical: wp(1),
        backgroundColor: colors.white,
        borderTopEndRadius: wp(7),
        borderBottomEndRadius: wp(7),
        borderTopStartRadius: wp(9),
        borderBottomStartRadius: wp(9),
    },
    personIcon: {
        width: isTab ? wp(6) : wp(12),
        height: isTab ? wp(6) : wp(12),
        borderRadius: wp(7), // Circular icon
        borderWidth: wp(0.01),
        elevation: 3,
    },
    loginContainer: {
        backgroundColor: colors.transparentPrimary,
        paddingVertical: hp(1),
        width: isTab ? wp(20) : wp(30),
        borderRadius: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
