import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';

interface SupervisorDetailsProps {
    name: string;
    email: string;
}

const SupervisorDetails = ({name, email}: any) => {
    const supervisor = name;
    const supervisorEmail = email;

    const openEmail = () => {
        Linking.openURL(`mailto:${supervisorEmail}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Supervisor Details</Text>
            <Text style={styles.name}>{supervisor}</Text>
            <TouchableOpacity onPress={openEmail}>
                <Text style={styles.email}>{supervisorEmail}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    name: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#1e90ff',
        textDecorationLine: 'underline',
    },
});

export default SupervisorDetails;
