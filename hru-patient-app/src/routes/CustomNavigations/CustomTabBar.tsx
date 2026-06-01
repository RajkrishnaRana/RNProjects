import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useBottomTabStore } from '../../store/bottomTabStore';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import { isTab } from '../../utils/isTab';
import { isIos } from '../../utils/platform';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trigger } from 'react-native-haptic-feedback';

const ANDROID_RIPPLE = { color: colors.rippleBlack, borderless: true, radius: 35, foreground: true };

function CustomTabBar() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const paddingBottom = isIos() ? hp(2) : insets.bottom;

    // GLOBAL STATES --------------------------------->
    const { tabs, selectActiveTabs, activeRoute } = useBottomTabStore();

    function handleNavigation(index: number, route: string) {
        selectActiveTabs(index);
        navigation.navigate('Home', { screen: route });
        trigger('impactLight');
    }

    return (
        <View style={[styles.tabBar, { paddingBottom }]}>
            <Pressable onPress={() => handleNavigation(0, tabs[0].name)} style={styles.iconContainer} android_ripple={ANDROID_RIPPLE}>
                <IconIon name="home" size={isTab ? wp(3) : wp(6)} color={activeRoute === tabs[0].name ? colors.primary : colors.darkGrey} />
                <Text
                    style={[
                        styles.tabText,
                        {
                            color: activeRoute === tabs[0].name ? colors.primary : colors.darkGrey,
                        },
                    ]}
                >
                    Dashboard
                </Text>
            </Pressable>

            <Pressable onPress={() => handleNavigation(5, tabs[5].name)} style={[styles.iconContainer]} android_ripple={ANDROID_RIPPLE}>
                <Image
                    source={require('../../assets/icons/appointment.png')}
                    style={{ width: isTab ? wp(3) : wp(6), height: isTab ? wp(3) : wp(6) }}
                    tintColor={activeRoute === tabs[5].name ? colors.primary : colors.darkGrey}
                />
                <Text
                    style={[
                        styles.tabText,
                        {
                            color: activeRoute === tabs[5].name ? colors.primary : colors.darkGrey,
                        },
                    ]}
                >
                    Appointments
                </Text>
            </Pressable>

            <Pressable onPress={() => handleNavigation(4, tabs[4].name)} style={[styles.iconContainer]} android_ripple={ANDROID_RIPPLE}>
                <IconMaterialIcons
                    name="health-and-safety"
                    size={isTab ? wp(3) : wp(6)}
                    color={activeRoute === tabs[4].name ? colors.primary : colors.darkGrey}
                />
                <Text
                    style={[
                        styles.tabText,
                        {
                            color: activeRoute === tabs[4].name ? colors.primary : colors.darkGrey,
                        },
                    ]}
                >
                    Health Vault
                </Text>
            </Pressable>

            <Pressable onPress={() => handleNavigation(3, tabs[3].name)} style={[styles.iconContainer]} android_ripple={ANDROID_RIPPLE}>
                <IconIon name="person-add" size={isTab ? wp(3) : wp(6)} color={activeRoute === tabs[3].name ? colors.primary : colors.darkGrey} />
                <Text
                    style={[
                        styles.tabText,
                        {
                            color: activeRoute === tabs[3].name ? colors.primary : colors.darkGrey,
                        },
                    ]}
                >
                    Family
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: isIos() ? hp(2) : hp(1),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    tabText: {
        fontSize: isTab ? wp(2) : wp(3),
        fontWeight: '600',
    },
    iconContainer: {
        // gap: wp(1),
        alignItems: 'center',
        width: wp(96 / 4),
        paddingBottom: 7,
        // paddingVertical: wp(1.5),
        // borderRadius: wp(10),
    },
});

export default CustomTabBar;
