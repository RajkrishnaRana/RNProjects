import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CustomRating from '../BookAppointmentComponents/CustomRating';
import IconText from '../IconText';
import {isTab} from '../../utils/isTab';

interface Props {
    drName: string;
    designation: string;
    drRating: number;
    doctorProfileImg: string | undefined;
    doctorExperience?: string;
}

export default function DoctorSummaryCard({drName, designation, drRating, doctorProfileImg, doctorExperience}: Props) {
    return (
        <View style={styles.doctorHeaderContainer}>
            {/* Profile Picture */}
            <View style={styles.imgContainer}>
                <Image
                    source={doctorProfileImg ? {uri: doctorProfileImg} : require('../../assets/icons/user.png')}
                    style={{
                        height: isTab ? wp(9) : wp(17),
                        width: isTab ? wp(9) : wp(17),
                        borderRadius: wp(10),
                    }}
                />
            </View>

            {/* Details */}
            <View style={{gap: isTab ? hp(0) : hp(0.3), width: wp(60)}}>
                <Text style={styles.drName}>{drName}</Text>
                <IconText
                    index={6}
                    text={designation.length > 25 ? designation.substring(0, 25) + '...' : designation}
                    // customLogoStyles={{tintColor: colors.darkBlue}}
                    customTextStyles={{fontSize: isTab ? wp(2) : wp(3.2)}}
                />

                <View style={{flexDirection: isTab ? 'row' : 'column', gap: isTab ? wp(3) : 0, alignItems: isTab ? 'center' : 'flex-start'}}>
                    <IconText
                        index={5}
                        text={`${doctorExperience} Years of Experience`}
                        customTextStyles={{fontSize: isTab ? wp(2) : wp(3.2)}}
                        // customLogoStyles={{
                        //     tintColor: colors.darkBlue,
                        // }}
                    />

                    <View style={styles.ratingContainer}>
                        <CustomRating prevRating={drRating} customStartSize={isTab ? wp(2.5) : wp(4)} customColor={colors.darkBlue} />
                        <IconText
                            index={7}
                            text="6 Reviews"
                            // customLogoStyles={{tintColor: colors.darkBlue}}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    doctorHeaderContainer: {
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    doctorHeaderDetails: {
        fontSize: wp(3.5),
        color: colors.black,
        fontWeight: '400',
    },
    imgContainer: {
        backgroundColor: colors.blueWhite,
        width: isTab ? wp(9.5) : wp(18),
        height: isTab ? wp(9.5) : wp(18),
        borderRadius: wp(10),
        borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        alignItems: 'center',
        justifyContent: 'flex-end',
        elevation: 2,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    drName: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(3) : wp(4.5),
        color: colors.black,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.4),
        gap: wp(4),
    },
});
