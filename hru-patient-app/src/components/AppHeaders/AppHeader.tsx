import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import DrawerButton from '../Buttons/DrawerButton';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import NotificationButton from '../Buttons/NotificationButton';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { colors } from '../../common/colors';
import { isIos } from '../../utils/platform';
import { useAuthStore } from '../../store/authStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCurrentLocationStore } from '../../store/currentLocationStore';
import LocationChoosingModal from '../Modal/LocationChoosingModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isTab } from '../../utils/isTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppHeader(props: DrawerHeaderProps) {
    const { navigation, route, options } = props;
    const screenName = route.name;
    const { top } = useSafeAreaInsets();
    // console.log('screenName', screenName);

    // GLOBAL STATES ------------------------------>
    const updatedUserData = useAuthStore(state => state.updatedUserData);
    const { nearestLocation, setLocationModal } = useCurrentLocationStore();

    return (
        <View style={[styles.container, isIos() && { paddingTop: top }]}>
            <View style={styles.bodyContainer}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <DrawerButton />
                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                </View>

                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: isTab ? wp(3) : wp(5),
                        // paddingRight: wp(1),
                    }}
                >
                    {screenName === 'BOOK APPOINTMENT' && (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: wp(-2),
                            }}
                            onPress={() => {
                                setLocationModal(true);
                            }}
                        >
                            <MaterialIcons name="location-pin" size={isTab ? wp(3) : wp(6)} color={colors.primary} />
                            <Text
                                style={{
                                    fontSize: isTab ? wp(2) : wp(4),
                                    color: colors.darkBlue,
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                }}
                            >
                                {nearestLocation?.city}
                            </Text>
                            <MaterialCommunityIcons
                                name="chevron-down"
                                size={isTab ? wp(2) : wp(5)}
                                color={colors.darkBlue}
                                style={{ marginTop: hp(0.3) }}
                            />
                        </TouchableOpacity>
                    )}
                    <NotificationButton />
                    <TouchableOpacity onPress={() => navigation.navigate('MY PROFILE')}>
                        <Image source={{ uri: updatedUserData?.imgLink }} style={styles.personIcon} resizeMethod="scale" />
                    </TouchableOpacity>

                    {/* <HelpButton />
                <MoreOptions /> */}
                </View>
            </View>

            <LocationChoosingModal />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(2),
        paddingBottom: isTab ? hp(0.5) : hp(2),
        backgroundColor: colors.white,
        paddingTop: isIos() ? 0 : (StatusBar.currentHeight ?? 0) + hp(0.7),
    },
    bodyContainer: {
        borderRadius: wp(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.2),
        // boxShadow: colors.primaryShadowColor2,
    },
    logo: {
        width: isTab ? wp(8) : wp(15),
        height: isTab ? hp(3) : hp(4),
        alignSelf: 'center',
        marginLeft: wp(2),
    },
    personIcon: {
        width: isTab ? wp(6) : wp(9),
        height: isTab ? wp(6) : wp(9),
        borderRadius: wp(6), // Circular icon
        borderWidth: wp(0.01),
        elevation: 3,
    },
});
