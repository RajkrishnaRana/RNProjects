import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { isIos } from '../../services/deviceServices';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks/useNavigation';
import LinearGradient from 'react-native-linear-gradient';

export default function DrawerHeader({ title }: { title: string }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Ionicons name="menu" size={wp(6.5)} color={'black'} onPress={() => navigation.openDrawer()} style={styles.drawerIconContainer} />
            <Text style={styles.screenName}>{title}</Text>
            <View style={{ width: wp(6) }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        paddingTop: isIos() ? 0 : (StatusBar.currentHeight ?? 0) + hp(1),
        paddingBottom: hp(1.5),
        backgroundColor: '#fafcfb',
    },
    screenName: {
        fontSize: wp(5.5),
        color: 'black',
        fontWeight: '500',
    },
    drawerIconContainer: {
        padding: wp(1.5),
        borderRadius: wp(3),
        borderWidth: 0.5,
    },
});
