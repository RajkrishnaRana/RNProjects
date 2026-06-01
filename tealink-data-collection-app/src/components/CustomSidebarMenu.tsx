import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DrawerContentComponentProps, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { useAppDispatch, useAppSelector } from '../hooks/typedReduxHooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import BigButton from './Buttons/BigButton';
import { logout } from '../store/slices/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import { useQueryClient } from '@tanstack/react-query';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolsSection from './Sections/ToolsSection';
import DropdownOptionsCard from './Cards/DropdownOptionsCard';
import { useNavigation } from '../hooks/useNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function CustomSidebarMenu(props: DrawerContentComponentProps) {
    const activeRoute = props.state.routes[props.state.index].name;
    console.log(activeRoute);
    const { userData } = useAppSelector(state => state.auth);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const isDrawerOpen = useDrawerStatus() === 'open';
    if (isDrawerOpen) {
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <DrawerContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingStart: 0 }} {...props}>
                {/* Top Section */}
                <View style={styles.userDetailsContainer}>
                    <LinearGradient colors={['white', '#c4f5d1']} style={[styles.image, styles.placeholder]}>
                        <Text style={styles.placeHolderChar}>{userData?.userName.charAt(0)}</Text>
                    </LinearGradient>
                    <View>
                        <Text style={styles.welcomeText}>Welcome !</Text>
                        <Text style={styles.userNameText}>{userData?.userName}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Developed by Illimitable <Text style={styles.footerText}> V {DeviceInfo.getVersion()}</Text>
                    </Text>
                </View>

                <View style={styles.dropdownOptionContainer}>
                    <DropdownOptionsCard
                        activeRoute={activeRoute === 'Home'}
                        title="Dashboard"
                        navigation={() => navigation.navigate('Drawer', { screen: 'Home' })}
                        icon={
                            <AntDesign name="home" size={wp(5)} style={{ marginRight: wp(2) }} color={activeRoute === 'Home' ? 'white' : 'black'} />
                        }
                    />
                </View>
                <ToolsSection activeRoute={activeRoute} />
            </DrawerContentScrollView>

            {/* Footer Section */}
            <View style={{ paddingHorizontal: wp(5), paddingBottom: hp(4) }}>
                <BigButton
                    title="Log Out"
                    onPress={() => {
                        dispatch(logout());
                        queryClient.clear();
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    userDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        marginTop: hp(2),
        paddingStart: wp(3),
    },
    placeHolderChar: {
        fontSize: wp(6),
        fontWeight: '500',
        color: 'black',
    },
    image: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(10),
        elevation: 2,
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: wp(4),
        color: 'black',
        fontWeight: '600',
    },
    userNameText: {
        fontSize: wp(4.5),
        color: colors.green,
        fontWeight: '600',
    },
    footer: {
        marginTop: hp(1),
        paddingStart: wp(5),
    },
    footerText: {
        fontSize: wp(3),
        color: 'grey',
    },
    dropdownOptionContainer: {
        marginTop: hp(2),
    },
});
