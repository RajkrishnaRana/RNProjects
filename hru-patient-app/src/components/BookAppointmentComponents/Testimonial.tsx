import {Image, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {doctorCardProps} from '../../screens/BookAppointmentScreen';
import Animated from 'react-native-reanimated';
import {colors} from '../../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    item: doctorCardProps;
}

function Testimonial({item}: Props) {
    return (
        <Animated.View style={[{width: wp(90), alignItems: 'center'}]}>
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[colors.transparentPrimary, 'rgba(29, 186, 181, 0.05)']}
                style={styles.container}>
                <View style={styles.imgContainer}>
                    <Image
                        source={require('../../assets/images/doctor.png')}
                        style={styles.img}
                    />
                </View>
                <View
                    style={{
                        width: wp(60),
                        alignItems: 'center',
                        paddingVertical: hp(1),
                        paddingHorizontal: wp(3),
                    }}>
                    <Text style={styles.name}>Sumit Maity</Text>
                    <Text style={styles.text}>
                        Great doctor. Clean patience. Red color Green pens White
                        curtains for test purpose.Rating is not working as
                        expected. Every review and rating need to be approved by
                        Admin first before becoming live.
                    </Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(3),
        // elevation: 1,
        width: wp(83),
        flexDirection: 'row',
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: wp(1),
    },
    img: {
        height: wp(24),
        width: wp(22),
        resizeMode: 'contain',
    },
    text: {
        color: colors.darkGrey,
        fontSize: wp(3.2),
        textAlign: 'right',
        marginBottom: hp(0.5),
    },
    name: {
        textAlign: 'center',
        fontSize: wp(4),
        fontWeight: 'bold',
        marginBottom: hp(0.5),
        color: colors.black,
    },
});

export default memo(Testimonial);
