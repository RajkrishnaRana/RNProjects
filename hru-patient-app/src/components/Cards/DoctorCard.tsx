import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import CustomRating from '../BookAppointmentComponents/CustomRating';
import {useNavigation} from '../../hooks/useNavigation';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    item: RecentVisitedDoctor;
}

export default function DoctorCard({item}: Props) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.push('DoctorProfile', {id: item?._id});
    };

    return (
        <TouchableOpacity onPress={handlePress} style={{marginBottom: hp(2)}}>
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[colors.backgroundColor, 'rgba(10, 164, 252, 0.01)']}
                style={styles.container}>
                <View style={styles.dataContainer}>
                    <View style={styles.imgContainer}>
                        <Image
                            source={
                                item?.doctorProfileImgPath
                                    ? {uri: item?.doctorProfileImgPath}
                                    : require('../../assets/icons/doctor.png')
                            }
                            style={{height: wp(13), width: wp(13),  borderRadius: wp(7),}}
                        />
                    </View>
                    <View>
                        <Text style={styles.text}>
                            {item.doctorType} {item.name}
                        </Text>
                        <Text style={styles.subText}>
                            {item.specialities[0]}
                        </Text>
                        <CustomRating
                            prevRating={item?.patientRatingToDoctor}
                            customColor={colors.darkBlue}
                            customStartSize={wp(4)}
                        />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        // backgroundColor: 'rgba(10, 164, 252, 0.1)',
        borderRadius: wp(3),
        // width: wp(85),
    },
    dataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    imgContainer: {
        // backgroundColor: colors.blueWhite,
        // borderWidth: wp(0.2),
        // borderColor: colors.grey,
        width: wp(15),
        height: wp(15),
        borderRadius: wp(7),
        alignItems: 'center',
        justifyContent: 'flex-end',
        // elevation: 2,
        alignSelf: 'center',
        overflow: 'hidden',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    text: {
        color: colors.black,
        fontSize: wp(3.5),
        // fontWeight: 'bold',
        marginBottom: hp(0.5),
    },
    subText: {
        color: colors.black,
        fontSize: wp(2.8),
        marginBottom: hp(0.7),
    },
});
