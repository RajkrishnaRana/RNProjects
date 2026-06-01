import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

const WIDTH = wp(85);

interface Props {
    item: any;
    index: number;
    scrollX: SharedValue<number>;
}

function ImgData({source, desc}: {source: ImageSourcePropType; desc: string}) {
    return (
        <View style={styles.imgTextContainer}>
            <Image
                source={source}
                style={{width: wp(5), height: wp(5)}}
                tintColor={colors.white}
            />
            <Text style={{color: colors.white, fontSize: wp(3)}}>{desc}</Text>
        </View>
    );
}

export default function UpcomingSchedules({item, index, scrollX}: Props) {
    return (
        <Animated.View style={[{width: WIDTH}]}>
            <View style={styles.container}>
                <View style={styles.doctorDetailContainer}>
                    <View style={styles.imgTextContainer}>
                        <View style={styles.imgContainer}>
                            <Image
                                source={require('../assets/images/doctor.png')}
                                style={{height: wp(11), width: wp(9)}}
                            />
                        </View>
                        <View>
                            <Text style={styles.doctorNameText}>
                                Dr. Pradip Sharma
                            </Text>
                            <Text style={styles.doctorSpeciality}>
                                Cardiologist
                            </Text>
                        </View>
                    </View>

                    <View style={styles.callIconContainer}>
                        <Image
                            source={require('../assets/icons/phone.png')}
                            style={{width: wp(5), height: wp(5)}}
                            tintColor={colors.primary}
                        />
                    </View>
                </View>

                <View style={styles.timeAndDateContainer}>
                    <ImgData
                        source={require('../assets/icons/calendar.png')}
                        desc="Mon 9th, Dec"
                    />
                    <ImgData
                        source={require('../assets/icons/time.png')}
                        desc="9.00 - 10.00"
                    />
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        backgroundColor: colors.primary,
        borderRadius: wp(3),
        elevation: 3,
        width: wp(78),
    },
    doctorDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imgContainer: {
        backgroundColor: colors.blueWhite,
        borderWidth: 1.5,
        borderColor: colors.primary,
        width: wp(13),
        height: wp(13),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'flex-end',
        elevation: 2,
        alignSelf: 'center',
        overflow: 'hidden',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    doctorNameText: {
        fontWeight: 'bold',
        fontSize: wp(3.7),
        color: colors.white,
    },
    doctorSpeciality: {
        fontSize: wp(3),
        color: colors.white,
    },
    callIconContainer: {
        width: wp(10),
        height: wp(10),
        backgroundColor: colors.white,
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeAndDateContainer: {
        borderRadius: wp(3),
        backgroundColor: colors.deepPrimary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: wp(2),
        paddingHorizontal: wp(3),
        marginTop: hp(1),
        marginHorizontal: wp(-1),
        marginBottom: hp(0.5),
    },
    imgTextContainer: {flexDirection: 'row', alignItems: 'center', gap: wp(1)},
});
