import { Pressable, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react';
import { colors } from '../../common/colors';
import moment from 'moment';
import { useNavigation } from '../../hooks/useNavigation';
import { isTab } from '../../utils/isTab';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DetailsText = ({ header, detail }: { header: string; detail: string }) => {
    return (
        <Text style={styles.header}>
            {header} : <Text style={[styles.bodyText, header === 'Dispute id' && styles.disputeHighlight]}>{detail}</Text>
        </Text>
    );
};

export default function DisputeCard({ item }: { item: DisputeObj }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.push('EditDispute', { item: item });
    };

    return (
        <AnimatedPressable
            style={styles.container}
            onPress={handlePress}
            entering={FadeInDown}
            android_ripple={{ radius: 200, foreground: true, color: colors.rippleBlack }}
        >
            <DetailsText header="Dispute id" detail={item?.dispute?.disputeId} />

            {item?.labDetails && <DetailsText header={'Lab Name'} detail={item?.labDetails?.labName} />}

            {item?.doctorDetails && <DetailsText header={'Work Location'} detail={item?.doctorDetails?.workLocation} />}

            <DetailsText header="Description" detail={item?.dispute?.disputeDescription} />
            <Text style={[styles.header, styles.dateText]}>Dated on : {moment(item?.dispute?.dateOfDispute).format('Do MMMM, YYYY')}</Text>

            <View
                style={[
                    styles.tagContainer,
                    {
                        backgroundColor: item?.dispute?.status === 'Close' || item?.dispute?.status === 'Resolved' ? colors.primary : colors.red,
                    },
                ]}
            >
                <Text style={[styles.statusText]}>{item?.dispute?.status}</Text>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        borderRadius: wp(3),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        marginVertical: hp(0.5),
        gap: hp(0.5),
        backgroundColor: colors.white,
        elevation: 2,
        marginHorizontal: wp(3),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    header: {
        fontSize: isTab ? wp(2.2) : wp(3.7),
        color: colors.black,
    },
    bodyText: {
        fontSize: isTab ? wp(2.2) : wp(3),
        fontWeight: 'normal',
        color: colors.black,
    },
    tagContainer: {
        height: hp(4),
        width: wp(25),
        right: wp(0),
        top: wp(0),
        borderTopEndRadius: wp(3),
        borderBottomLeftRadius: wp(2),
        padding: wp(1),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    statusText: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: isTab ? wp(1.8) : wp(3),
    },
    dateText: { textAlign: 'right', fontSize: isTab ? wp(2) : wp(3.2) },
    disputeHighlight: { fontWeight: 'bold' },
});
