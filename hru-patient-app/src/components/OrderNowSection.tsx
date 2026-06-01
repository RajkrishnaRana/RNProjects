import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BigButton from './BigButton';

export default function OrderNowSection() {
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    gap: wp(3),
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../assets/images/medicines.png')}
                    style={{
                        height: wp(7),
                        width: wp(7),
                        tintColor: colors.primary,
                    }}
                />
                <View>
                    <Text style={styles.titleText}>Order with</Text>
                    <Text style={styles.titleText}>Prescription</Text>
                </View>
            </View>

            <BigButton
                title="Order Now"
                onPress={() => {}}
                customStyle={styles.buttonStyle}
                customTextStyle={{fontSize: wp(3.5), color: colors.white}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.transparentPrimary,
        padding: wp(3),
        borderRadius: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(2),
    },
    titleText: {
        fontSize: wp(3.8),
        color: colors.lightBlack,
        fontWeight: '700',
    },
    buttonStyle: {
        marginTop: 0,
        width: wp(25),
        paddingVertical: hp(1),
    },
});
