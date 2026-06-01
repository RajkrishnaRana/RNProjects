import React, { useEffect } from 'react';
import { View, Text, Keyboard, StyleSheet, Image } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useBottomTabStore } from '../../store/bottomTabStore';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuComponent from './MenuComponent';
import TopSection from './TopSection';
import FooterSection from './FooterSection';
import { isTab } from '../../utils/isTab';

export default function CustomSidebarMenu(props: DrawerContentComponentProps) {
    const activeRoute = props.state.routes[props.state.index].name;

    const isDrawerOpen = useDrawerStatus() === 'open';

    useEffect(() => {
        if (isDrawerOpen) {
            Keyboard.dismiss();
        }
    }, [isDrawerOpen]);

    //Zustand Implementation
    const { tabs, selectedTabs, setActiveRoute } = useBottomTabStore();
    // const tabs = useBottomTabStore(state => state.tabs)

    useEffect(() => {
        setActiveRoute(activeRoute);
    }, [activeRoute, setActiveRoute]);

    return (
        <DrawerContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container} {...props}>
            <View style={styles.sideMenuContainer}>
                <TopSection />

                <MenuComponent
                    selectedMenu={tabs[0].name}
                    index={0}
                    menuName="Dashboard"
                    activeTab={activeRoute}
                    menuIcon={
                        <IconIon name="home" size={isTab ? wp(3) : wp(5)} color={activeRoute === tabs[0].name ? colors.primary : colors.darkGrey} />
                    }
                />

                <MenuComponent
                    selectedMenu={tabs[8].name}
                    index={8}
                    menuName="Book Appointment"
                    activeTab={activeRoute}
                    menuIcon={
                        <IconMaterialCommunityIcons
                            name="forum"
                            color={activeRoute === tabs[8].name ? colors.primary : colors.darkGrey}
                            size={isTab ? wp(3) : wp(5)}
                        />
                    }
                />

                <MenuComponent
                    selectedMenu={tabs[4].name}
                    index={4}
                    menuName="Health Vault"
                    activeTab={activeRoute}
                    menuIcon={
                        <IconMaterialIcons
                            name="health-and-safety"
                            size={isTab ? wp(3) : wp(5)}
                            color={activeRoute === tabs[4].name ? colors.primary : colors.darkGrey}
                        />
                    }
                />

                <MenuComponent
                    selectedMenu={tabs[5].name}
                    index={5}
                    menuName="Doctor Appointments"
                    activeTab={activeRoute}
                    isCollapsible={true}
                    menuIcon={
                        <Image
                            source={require('../../assets/icons/appointment.png')}
                            style={{ width: isTab ? wp(3) : wp(5), height: isTab ? wp(4) : wp(5) }}
                            tintColor={activeRoute === tabs[5].name ? colors.primary : colors.darkGrey}
                        />
                    }
                />

                <MenuComponent
                    selectedMenu={tabs[12].name}
                    index={5}
                    menuName="Lab Appointments"
                    activeTab={activeRoute}
                    isCollapsible={true}
                    menuIcon={
                        <Image
                            source={require('../../assets/icons/microscope.png')}
                            style={{ width: isTab ? wp(4) : wp(5), height: isTab ? wp(4) : wp(5) }}
                            tintColor={activeRoute === tabs[12].name ? colors.primary : colors.darkGrey}
                        />
                    }
                />

                <MenuComponent
                    selectedMenu={tabs[13].name}
                    index={13}
                    menuName="Pharmacy Orders"
                    activeTab={activeRoute}
                    isCollapsible={true}
                    menuIcon={
                        <Image
                            source={require('../../assets/icons/capsule.png')}
                            style={{ width: isTab ? wp(4) : wp(5), height: isTab ? wp(4) : wp(5) }}
                            tintColor={activeRoute === tabs[13].name ? colors.primary : colors.darkGrey}
                        />
                    }
                />

                {/* Reminders Options */}
                <>
                    <View style={[styles.dashbordviewDropDown]}>
                        <View style={styles.groupHeader}>
                            <Text style={styles.dashbord}>My Reminders</Text>
                            <View style={styles.line} />
                        </View>
                    </View>

                    {/* My Reminders */}

                    <View style={[styles.collapsibleView]}>
                        <MenuComponent
                            selectedMenu={tabs[10].name}
                            index={10}
                            menuName="Medicine Intake"
                            activeTab={activeRoute}
                            isCollapsible={true}
                            menuIcon={
                                <IconAntDesign
                                    name="calendar"
                                    size={isTab ? wp(3) : wp(5)}
                                    color={activeRoute === tabs[10].name ? colors.primary : colors.darkGrey}
                                />
                            }
                        />

                        <MenuComponent
                            selectedMenu={tabs[11].name}
                            index={11}
                            menuName="Medicine Refill"
                            activeTab={activeRoute}
                            isCollapsible={true}
                            menuIcon={
                                <IconAntDesign
                                    name="calendar"
                                    size={isTab ? wp(3) : wp(5)}
                                    color={activeRoute === tabs[11].name ? colors.primary : colors.darkGrey}
                                />
                            }
                        />
                    </View>
                </>

                {/* Personal Info */}
                <>
                    <View style={[styles.dashbordviewDropDown]}>
                        <View style={styles.groupHeader}>
                            <Text style={styles.dashbord}>Personal Info</Text>
                            <View style={styles.line} />
                        </View>
                    </View>

                    <View style={[styles.collapsibleView]}>
                        <MenuComponent
                            selectedMenu={tabs[1].name}
                            index={1}
                            menuName="My Profile"
                            activeTab={activeRoute}
                            isCollapsible={true}
                            menuIcon={
                                <IconIon
                                    name="person"
                                    size={isTab ? wp(3) : wp(5)}
                                    color={activeRoute === tabs[1].name ? colors.primary : colors.darkGrey}
                                />
                            }
                        />

                        <MenuComponent
                            selectedMenu={tabs[2].name}
                            index={2}
                            menuName="Address Book"
                            activeTab={activeRoute}
                            isCollapsible={true}
                            menuIcon={
                                <IconIon
                                    name="location"
                                    size={isTab ? wp(3) : wp(5)}
                                    color={activeRoute === tabs[2].name ? colors.primary : colors.darkGrey}
                                />
                            }
                        />

                        <MenuComponent
                            selectedMenu={tabs[3].name}
                            index={3}
                            menuName="Family Members"
                            activeTab={activeRoute}
                            isCollapsible={true}
                            menuIcon={
                                <IconIon
                                    name="person-add"
                                    size={isTab ? wp(3) : wp(5)}
                                    color={activeRoute === tabs[3].name ? colors.primary : colors.darkGrey}
                                />
                            }
                        />
                    </View>
                </>

                <MenuComponent
                    selectedMenu={tabs[6].name}
                    index={6}
                    menuName="Disputes"
                    activeTab={activeRoute}
                    menuIcon={
                        <IconMaterialIcons
                            name="report-problem"
                            size={isTab ? wp(3) : wp(5)}
                            color={activeRoute === tabs[6].name ? colors.primary : colors.darkGrey}
                        />
                    }
                />

                {/* <MenuComponent
                    selectedMenu={tabs[7].name}
                    menuName="Orders"
                    activeTab={7}
                    menuIcon={
                        <IconMaterialCommunityIcons
                            name="shopping"
                            color={
                                selectedTab === tabs[7].name
                                    ? colors.white
                                    : colors.primary
                            }
                            size={wp(7)}
                        />
                    }
                /> */}

                <MenuComponent
                    selectedMenu={tabs[9].name}
                    index={9}
                    menuName="Referral Points"
                    activeTab={activeRoute}
                    menuIcon={
                        <IconMaterialCommunityIcons
                            name="star-four-points"
                            color={selectedTabs === tabs[9].name ? colors.primary : colors.darkGrey}
                            size={isTab ? wp(3) : wp(5)}
                        />
                    }
                />

                {/* Footer */}
                <FooterSection />
            </View>
        </DrawerContentScrollView>
    );
}

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    sideMenuContainer: {
        flex: 1,
        // paddingBottom: hp(4),
        backgroundColor: colors.white,
    },
    dashbord: {
        color: colors.black,
        fontSize: isTab ? wp(2) : wp(4),
        alignSelf: 'center',
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    dashbordviewDropDown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: colors.grey,
        paddingVertical: 15,
        alignItems: 'center',
        // borderBottomColor: colors.darkGrey,
    },
    collapsibleView: {
        overflow: 'hidden',
        backgroundColor: colors.white,
    },
    logoutButton: {
        marginLeft: wp(25),
        width: wp(30),
        marginTop: hp(2),
        backgroundColor: colors.darkBlue,
        borderRadius: wp(10),
    },
    logoutText: {
        color: colors.white,
        textAlign: 'center',
        padding: wp(2),
        fontWeight: 'bold',
        fontSize: wp(4),
    },
    personIcon: {
        width: wp(13),
        height: wp(13),
        borderRadius: wp(7), // Circular icon
        marginRight: wp(5),
    },
    groupHeader: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    line: {
        backgroundColor: colors.grey,
        height: hp(0.1),
        width: wp(59),
    },
});
