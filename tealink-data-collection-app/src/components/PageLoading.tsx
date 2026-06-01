import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function PageLoading() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={wp(8)} color={colors.green} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
