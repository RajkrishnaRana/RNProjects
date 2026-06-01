import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DoctorSummaryCard from './DoctorSummaryCard';
import ClinicSummaryCard from './ClinicSummaryCard';
import FeeStructure from '../FeeStructure';
import { getName } from '../../utils';
import { isTab } from '../../utils/isTab';

export default function AppointmentSummaryCard({ data, couponDiscount, paymentMethod }: any) {
    // LOCAL FUNCTIONS ---------------------------->
    // const handleCard = () => {
    //     setIsShrinked(!isShrinked);
    // };

    return (
        <TouchableOpacity
            style={styles.container}
            // onPress={handleCard}
            activeOpacity={1}
        >
            <View style={styles.shrinkCardContainer}>
                <Text style={styles.shrinkCardText}>Appointment Details</Text>
                {/* {isShrinked ? (
                    <Image
                        source={require('../../assets/icons/arrow-down.png')}
                        style={styles.arrowDownIcon}
                    />
                ) : (
                    <Image
                        source={require('../../assets/icons/arrow-up.png')}
                        style={styles.arrowDownIcon}
                    />
                )} */}
            </View>

            <View style={styles.expandCardContainer}>
                <View style={styles.divider} />

                <DoctorSummaryCard
                    drName={getName(
                        data?.doctorDetails?.firstName,
                        data?.doctorDetails?.middleName,
                        data?.doctorDetails?.lastName,
                        data?.doctorDetails?.doctorType,
                    )}
                    designation={data?.doctorDetails?.specialities?.join(', ')}
                    drRating={data?.doctorDetails?.ratingDetails?.patientRatingToDoctor}
                    doctorProfileImg={data?.doctorDetails?.doctorProfileImgPath}
                    doctorExperience={data?.doctorDetails?.yearOfExperience}
                />

                <View style={styles.divider} />

                <ClinicSummaryCard data={data} />

                <View style={styles.divider} />

                <FeeStructure
                    bookingAmount={data?.bookingAmount}
                    data={data.responseData}
                    couponDiscount={couponDiscount}
                    paymentMethod={paymentMethod}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderColor: colors.primary,
        borderWidth: wp(0.3),
        borderRadius: wp(5),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
    },
    shrinkCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shrinkCardText: {
        fontSize: isTab ? wp(3) : wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
    arrowDownIcon: {
        height: wp(4),
        width: wp(4),
        tintColor: colors.darkBlue,
    },
    divider: {
        marginVertical: isTab ? hp(1.2) : hp(2),
        borderWidth: 0.5,
        borderColor: colors.darkBlue,
        borderStyle: 'dashed',
    },
    expandCardContainer: {},
});
