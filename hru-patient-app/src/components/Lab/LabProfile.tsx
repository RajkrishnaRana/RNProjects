import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {imageSelector} from '../../utils';
import IconText from '../IconText';

interface Props {
    data: LabInfo;
}

export default function LabProfile({data}: Props) {
    return (
        <View style={{flexDirection: 'row', gap: wp(3), alignItems: 'center'}}>
            {/* Profile Picture */}
            <View style={styles.imgContainer}>
                <Image source={imageSelector(data?.doctorProfileImgPath, 'DOCTOR')} style={{height: wp(17), width: wp(17), borderRadius: wp(10)}} />
            </View>

            {/* Details */}
            <View style={{}}>
                <Text style={styles.drName}>{data?.labName}</Text>
                <IconText index={2} text={data?.hruId} customLogoStyles={{tintColor: colors.primary}} customTextStyles={{color: colors.black}} />
                <IconText
                    index={3}
                    text={data?.locationAddress}
                    customLogoStyles={{tintColor: colors.primary}}
                    customTextStyles={{color: colors.black, width: wp(60)}}
                />
                <IconText
                    index={4}
                    text={data?.mobileNumber}
                    customLogoStyles={{tintColor: colors.primary}}
                    customTextStyles={{color: colors.black, width: wp(60)}}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imgContainer: {
        backgroundColor: colors.blueWhite,
        width: wp(18),
        height: wp(18),
        borderRadius: wp(10),
        // borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        alignItems: 'center',
        // justifyContent: 'flex-end',
        // elevation: 2,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    drName: {
        fontWeight: 'bold',
        fontSize: wp(4.5),
        marginBottom: hp(0.3),
        color: colors.black,
    },
    iconWithDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(0.7),
        marginTop: hp(0.5),
    },
    detailText: {color: colors.black, fontSize: wp(3.5)},
});
