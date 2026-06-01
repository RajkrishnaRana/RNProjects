import {Dimensions, FlatList, Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import HorizontalList from '../screens/HorizontalList';
import {colors} from '../common/colors';
import {isIos} from '../utils/platform';
import {isTab} from '../utils/isTab';

interface Props {
    item: {
        id: string;
        title: string;
        imgSrc: ImageSourcePropType;
        description: string;
    };
}

const FeatureCard = ({item}: Props) => (
    <View style={styles.card}>
        <View style={styles.iconPlaceholder}>
            <Image source={item.imgSrc} style={{height: isTab ? wp(7) : wp(15), width: isTab ? wp(7) : wp(15)}} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
    </View>
);

const features = [
    {
        id: '1',
        title: 'Health Reminders & Alerts',
        imgSrc: require('../assets/appFeatureIcons/bell.png'),
        description:
            'Never Miss an Appointment or Dose. Get automatic reminders for upcoming doctor appointments, lab tests, and medicine refills. Stay on track with your healthcare goals without the worry of forgetting important dates.',
    },
    {
        id: '2',
        title: 'One Family One Account',
        imgSrc: require('../assets/appFeatureIcons/happy.png'),
        description:
            'No more hassle of registering each family member separately using different mobile numbers. Add and manage health for complete family under a single mobile number.',
    },
    {
        id: '3',
        title: 'Secure Health Records',
        imgSrc: require('../assets/appFeatureIcons/folder.png'),
        description:
            'Your health data is secure as mobile as you are. Store all your medical records securely on HRU. From doctor prescriptions to lab reports, access your health history anytime, anywhere.',
    },
    {
        id: '4',
        title: 'Online Consultation',
        imgSrc: require('../assets/appFeatureIcons/online-doctor.png'),
        description:
            'No time to visit a clinic? No problem! Connect with doctors through secure online consultations, receive advice, prescriptions, and follow-up care—all from the comfort of home.',
    },
    {
        id: '5',
        title: 'Medical Records Sharing',
        imgSrc: require('../assets/appFeatureIcons/share-file.png'),
        description:
            'Need to consult a new doctor or specialist? Simply share your health records through HRU. No need to carry physical documents or re-explain your medical history.',
    },
    {
        id: '6',
        title: 'One family One account',
        imgSrc: require('../assets/appFeatureIcons/connections.png'),
        description:
            'No more hassle of registring each family member seperately using different mobile numbers. Add and manage health for complete family under a single mobile number ',
    },
    {
        id: '7',
        title: 'Notifications That Keep You Updated',
        imgSrc: require('../assets/appFeatureIcons/notification.png'),
        description:
            'Get real-time notifications for doctor lab tests results, and medicine deliveries. Stay informed and in control of your health, effortlessly.',
    },
    {
        id: '8',
        title: 'Easy Payment Options',
        imgSrc: require('../assets/appFeatureIcons/cashless-payment.png'),
        description:
            'Choose from multiple payment options, including credit/debit cards, UPI, wallets, and even cash to doctor. Your payment information is always secure, and the process is hassle-free.',
    },
    {
        id: '9',
        title: 'Referral & Rewards Program',
        imgSrc: require('../assets/images/new-features.png'),
        description:
            'Invite friends and family to join our platform and earn rewards. Save on doctor consultations, lab tests, and medicine orders every time someone you refer uses our services.',
    },
];

export default function AppFeatures() {
    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: isTab ? wp(3) : wp(5.3),
                    fontWeight: 'bold',
                    color: colors.lightBlack,
                    marginHorizontal: wp(2),
                    marginBottom: isTab ? hp(0.5) : hp(1),
                }}>
                Our Features
            </Text>
            <Text style={styles.header}>
                We simplify your healthcare journey with expert doctors, seamless booking, and trusted digital support right when you need it.
            </Text>
            <HorizontalList
                data={features}
                renderItem={({item, index}) => <FeatureCard item={item} />}
                autoScrollEnabled
                pagingEnabled={isIos() ? false : true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: isTab ? hp(0) : hp(1.5),
    },
    header: {
        fontSize: isTab ? wp(2) : wp(3.5),
        // fontWeight: '500',
        // textAlign: 'center',
        // marginBottom: hp(1),
        color: colors.darkGrey,
        marginHorizontal: wp(2),
    },
    list: {
        paddingBottom: 16,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: isTab ? wp(40) : wp(80),
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: isTab ? wp(2) : 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: isTab ? wp(1) : wp(2),
    },
    iconPlaceholder: {
        width: isTab ? wp(8) : wp(15),
        height: isTab ? wp(8) : wp(15),
        // borderRadius: wp(15),
        // backgroundColor: '#E6F0FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isTab ? hp(1) : 12,
        alignSelf: 'center',
    },
    iconText: {
        fontSize: isTab ? wp(2) : 12,
        color: '#666',
        fontWeight: 'bold',
    },
    title: {
        fontSize: isTab ? wp(2.2) : wp(4),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: isTab ? wp(1.8) : wp(3),
        color: '#666',
        lineHeight: isTab ? hp(1.5) : hp(2),
        textAlign: 'center',
    },
});
