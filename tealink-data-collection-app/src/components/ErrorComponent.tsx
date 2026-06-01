import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function ErrorComponent() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Something Error Occured</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'black',
        fontWeight: '600',
    },
});
