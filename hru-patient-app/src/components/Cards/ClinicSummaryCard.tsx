import {Image, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react';
import {colors} from '../../common/colors';
import IconText from '../IconText';
import {isNewBackTitleImplementation} from 'react-native-screens';
import {isTab} from '../../utils/isTab';

export default function ClinicSummaryCard({data}: {data: any}) {
    const clinicData = data?.doctorDetails?.addresses;
    const responseData = data?.responseData;

    console.log('clinicData', data);

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image
                    source={clinicData?.clinicImgPath ? {uri: clinicData?.clinicImgPath} : require('../../assets/icons/clinic.png')}
                    style={styles.img}
                />
            </View>

            <View style={{width: wp(60), gap: hp(0.25)}}>
                <Text style={styles.textHeader}>{clinicData?.workLocation}</Text>
                <View style={{flexDirection: isTab ? 'row' : 'column', gap: isTab ? wp(1.5) : 0, alignItems: isTab ? 'center' : 'flex-start'}}>
                    <IconText
                        index={3}
                        text={
                            clinicData?.locationAddress?.length > (isTab ? 35 : 25)
                                ? clinicData?.locationAddress?.substring(0, isTab ? 35 : 25) + '...'
                                : clinicData?.locationAddress
                        }
                        customTextStyles={{fontSize: isTab ? wp(2) : wp(3.2), width: isTab ? wp(35) : wp(50)}}
                    />
                    <IconText
                        index={8}
                        text={`${responseData?.slotDay.substring(0, 3)} ${responseData?.slotDate} ${responseData?.slotTime}`}
                        customTextStyles={{
                            color: colors.black,
                            fontWeight: 'bold',
                            fontSize: isTab ? wp(2) : wp(3.2),
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    imgContainer: {
        backgroundColor: colors.white,
        elevation: 3,
        borderRadius: isTab ? wp(1) : wp(3),
        height: isTab ? wp(10) : wp(18),
        width: isTab ? wp(10) : wp(18),
        marginHorizontal: isTab ? wp(2) : 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: isTab ? wp(9) : wp(13),
        width: isTab ? wp(9) : wp(13),
    },
    textHeader: {
        fontSize: isTab ? wp(3) : wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
});
