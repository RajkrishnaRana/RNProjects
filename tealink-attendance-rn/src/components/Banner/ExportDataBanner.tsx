import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import { Feather } from '@react-native-vector-icons/feather';
import { wp } from '../../utils/dimesion';

export default function ExportDataBanner() {
    return (
        <View style={styles.container}>
            <Feather name="download" size={20} color={colors.blue} />
            <View style={{ width: wp(70) }}>
                <Text style={styles.header}>Export Data</Text>
                <Text style={styles.description}>Download all application data for backup or analysis.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightBlue,
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: colors.blue,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    header: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.blue,
    },
    description: {
        fontSize: wp(3),
        color: colors.blue,
        marginTop: 5,
    },
});
