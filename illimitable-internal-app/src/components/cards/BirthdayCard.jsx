import React from 'react';
import {ScrollView, View, Text, StyleSheet, Image} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BirthdayCard = () => {
    // Dummy Data for Birthdays
    const birthdays = [
        {
            id: '1',
            name: 'Neha Singh',
            date: 'March 22',
            profilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
        },
        {
            id: '2',
            name: 'Rahul Gupta',
            date: 'March 25',
            profilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
        },
        {
            id: '3',
            name: 'Anjali Sharma',
            date: 'March 30',
            profilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}>
                {birthdays.map(birthday => (
                    <View key={birthday.id} style={styles.card}>
                        <Image
                            source={{uri: birthday.profilePic}}
                            style={styles.image}
                        />
                        <Text style={styles.name}>{birthday.name}</Text>
                        <Text style={styles.date}>{birthday.date}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(),
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollView: {
        flexDirection: 'row',
    },
    card: {
        width: 150,
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        padding: 10,
        marginRight: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
});

export default BirthdayCard;
