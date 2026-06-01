import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

export default function WelcomeOffer() {
    return (
        <LinearGradient
            colors={['#FFF6E9', '#FFD28E']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.container}>
            <View>
                <Text style={styles.title}>Welcome Offer</Text>
                <Text style={styles.focusText}>15% Extra Off</Text>
                <Text style={[styles.title, {fontWeight: '400'}]}>
                    on first order | Use code
                </Text>
                <View style={styles.section}>
                    <Text
                        style={{
                            fontSize: wp(4),
                            fontWeight: 'bold',
                            color: colors.lightBlack,
                        }}>
                        1MGNEW
                    </Text>
                </View>
            </View>

            <Image
                source={require('../assets/images/offer.png')}
                style={{height: wp(25), width: wp(25)}}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(3),
        marginVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: wp(3.5),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    focusText: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: colors.lightBlack,
    },
    section: {
        borderRadius: wp(5),
        borderWidth: wp(0.5),
        borderColor: '#FFD2AE',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginTop: hp(1.5),
        paddingVertical: hp(0.8),
    },
});
