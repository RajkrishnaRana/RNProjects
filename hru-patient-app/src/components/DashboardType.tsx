/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React from 'react';
import { useCurrentTabDashboard } from '../store/dashboardCurrentTab';
import { isIos } from '../utils/platform';

const DashboardType = () => {
    const { selectedTab, setSelectedTab } = useCurrentTabDashboard();
    console.log('selectedTab', selectedTab);

    const tabList = [
        { type: 'doctor', label: 'Doctor', image: require('../assets/icons/doctor_dashboard.png') },
        { type: 'lab', label: 'Lab Test', image: require('../assets/icons/lab_dashboard.png') },
        // { type: 'pharmacy', label: 'Pharmacy', image: require('../assets/icons/med_dashboard.png') },
        { type: 'pharmacy', label: 'Pharmacy', image: require('../assets/images/medicine_placeholder.png') },
    ];

    return (
        <View style={styles.dashboardTabWrapper}>
            {tabList.map(item => {
                const isActive = selectedTab === item.type;

                return (
                    <TouchableOpacity
                        key={item.type}
                        style={[styles.dashboardTab, { backgroundColor: isActive ? 'rgb(121, 190, 187)' : '#fff' }]}
                        onPress={() => setSelectedTab(item.type)}
                    >
                        <Image style={[{ opacity: isActive ? 1 : 0.6 }, styles.sectionImage]} source={item.image} />
                        <Text style={[{ color: isActive ? 'rgb(255, 255, 255)' : 'rgb(105, 109, 109)' }, styles.tabLabel]}>{item.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    dashboardTabWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: hp(2),
        marginHorizontal: isIos() ? 0 :wp(2)
    },
    dashboardTab: {
        width: '30%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#6EB7AC',
        borderRadius: wp(5),
        alignItems: 'center',
        padding: wp(1.5),
    },
    sectionImage: {
        height: 30,
        width: 30,
    },
    tabLabel: {
        fontWeight: '600',
        fontSize: wp(3.5),
        letterSpacing: 1,
    }
});
export default DashboardType;
