import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { isIos } from '../../utils/platform';
import { isTab } from '../../utils/isTab';
import DeviceInfo from 'react-native-device-info';

export default function FooterSection() {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>App Version {DeviceInfo.getVersion()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        marginTop: hp(2),
        alignSelf: 'center',
        marginBottom: isIos() ? 0 : hp(2),
    },
    footerText: {
        color: colors.grey,
        fontSize: isTab ? wp(1.5) : wp(3),
    },
});
