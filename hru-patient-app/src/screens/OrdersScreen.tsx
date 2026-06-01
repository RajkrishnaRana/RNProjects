import React, {useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    NativeModules,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

type Order = {
    id: string;
    pharmacyName: string;
    customerName: string;
    date: string;
    amount: string;
    status: string;
};

const data: Order[] = [
    {
        id: '100004302-1007',
        pharmacyName: 'Prosper Pharma',
        customerName: 'Priyanka Pandey Sarkar',
        date: '24th, Feb 2023',
        amount: '₹5.58',
        status: 'Completed',
    },
    {
        id: '100003464-148',
        pharmacyName: 'Sun Pharma',
        customerName: 'Parijat Sarkar',
        date: '14th, Dec 2022',
        amount: '₹2.42',
        status: 'Cancelled',
    },
    // Add more items as needed
];

export default function OrdersScreen() {
    const [selectedTab, setSelectedTab] = useState<'Completed' | 'Pending'>(
        'Completed',
    );

    const {AlarmModule} = NativeModules;

    function scheduleNotification(
        hour: number,
        minute: number,
        title: string,
        message: string,
    ) {
        AlarmModule.setAlarm(hour, minute, title, message);
    }

    const renderItem = ({item}: {item: Order}) => (
        <View style={styles.card}>
            <View>
                <Image
                    source={require('../assets/images/profile-pic.png')} // Replace with the real image URL or local image
                    style={styles.profileImage}
                />
            </View>

            <View>
                <Text style={styles.pharmacyName}>{item.pharmacyName}</Text>
                <Text style={styles.customerName}>
                    <Icon name="account" size={16} /> {item.customerName}
                </Text>
                <Text style={styles.id}>
                    <Icon name="identifier" size={16} /> {item.id}
                </Text>
                <Text style={styles.date}>
                    <Icon name="calendar" size={16} /> {item.date}
                </Text>
                <Text style={styles.amount}>
                    <Icon name="currency-inr" size={16} /> {item.amount}
                </Text>
                <Text
                    style={[
                        styles.status,
                        item.status === 'Completed'
                            ? styles.completed
                            : styles.cancelled,
                    ]}>
                    <Icon name="information" size={16} /> {item.status}
                </Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                            Dispute Filed
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Rate </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <View style={styles.container}>
                {/* Segment Buttons */}
                <View style={styles.segmentContainer}>
                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            selectedTab === 'Completed' &&
                                styles.selectedSegment,
                        ]}
                        onPress={() => setSelectedTab('Completed')}>
                        <Text
                            style={[
                                styles.segmentText,
                                selectedTab === 'Completed' &&
                                    styles.selectedSegmentText,
                            ]}>
                            Completed Orders
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            selectedTab === 'Pending' && styles.selectedSegment,
                        ]}
                        onPress={() => setSelectedTab('Pending')}>
                        <Text
                            style={[
                                styles.segmentText,
                                selectedTab === 'Pending' &&
                                    styles.selectedSegmentText,
                            ]}>
                            Pending Orders
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Orders List */}
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            </View>

            <Button
                title="Display Notification"
                onPress={() => {
                    scheduleNotification(
                        12,
                        13,
                        'Afternoon Reminder',
                        'Stay productive!',
                    );
                    console.log('alerm set function called');
                }}
            />

            <Text style={{color: 'red'}}>**This page is under development</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // marginTop:hp(5),
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
    },
    segmentButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    selectedSegment: {
        backgroundColor: colors.primary,
    },
    segmentText: {
        fontSize: 16,
        color: '#333',
    },
    selectedSegmentText: {
        color: '#fff',
    },
    listContent: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',

        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    pharmacyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    customerName: {
        fontSize: 14,
        color: '#666',
    },
    id: {
        fontSize: 14,
        color: '#666',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    amount: {
        fontSize: 14,
        color: '#666',
    },
    status: {
        fontSize: 14,
        marginTop: 5,
    },
    completed: {
        color: 'green',
    },
    cancelled: {
        color: 'red',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#e0f7fa',
        padding: 8,
        borderRadius: 5,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#008080',
        fontSize: 14,
    },
    profileImage: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        marginRight: wp(4),
    },
});
