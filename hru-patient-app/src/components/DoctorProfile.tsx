import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { getName, imageSelector } from '../utils';
import IconText from './IconText';
import { isTab } from '../utils/isTab';

interface Props {
    data: DoctorDetails;
}

export default function DoctorProfile({ data }: Props) {
    return (
        <View
            style={{
                flexDirection: 'row',
                gap: isTab ? wp(1.5) : wp(3),
                alignItems: 'center',
            }}
        >
            {/* Profile Picture */}
            <View style={styles.imgContainer}>
                <Image
                    source={imageSelector(data?.doctorProfileImgPath, 'DOCTOR')}
                    style={{ height: isTab ? wp(10) : wp(17), width: isTab ? wp(10) : wp(17), borderRadius: wp(10) }}
                />
            </View>

            {/* Details */}
            <View style={{}}>
                <Text style={styles.drName}>{getName(data?.firstName, data?.middleName, data?.lastName, data?.doctorType)}</Text>
                <IconText
                    index={2}
                    text={data?.hruId}
                    customLogoStyles={{ tintColor: colors.primary }}
                    customTextStyles={{
                        color: colors.darkGrey,
                        fontSize: isTab ? wp(2) : wp(3.5),
                    }}
                />
                <IconText
                    index={3}
                    text={data?.locationAddress}
                    customLogoStyles={{ tintColor: colors.primary }}
                    customTextStyles={{
                        color: colors.darkGrey,
                        width: wp(73),
                        fontSize: isTab ? wp(2) : wp(3.5),
                        // backgroundColor: 'red',
                    }}
                />
                <IconText
                    index={4}
                    text={data?.locationContact}
                    customLogoStyles={{ tintColor: colors.primary }}
                    customTextStyles={{
                        color: colors.darkGrey,
                        width: wp(60),
                        fontSize: isTab ? wp(2) : wp(3.5),
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imgContainer: {
        backgroundColor: colors.blueWhite,
        width: isTab ? wp(10) : wp(18),
        height: isTab ? wp(10) : wp(18),
        borderRadius: wp(10),
        // borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        alignItems: 'center',
        // justifyContent: 'flex-end',
        // elevation: 2,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    detailsContainer: {},
    drName: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(2.5) : wp(4),
        marginBottom: hp(0.3),
        color: colors.black,
    },
    iconWithDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(0.7),
        marginTop: hp(0.5),
    },
    detailText: { color: colors.black, fontSize: isTab ? wp(2.5) : wp(3.5) },
});
