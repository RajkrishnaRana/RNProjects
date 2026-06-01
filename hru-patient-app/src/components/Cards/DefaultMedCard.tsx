import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React from 'react';
import { colors } from '../../common/colors';

const DefaultMedCard = ({ item: mostSearchMedicines, payload }: { item: any; payload: any }) => {
    console.log('mostSearchMedicines', mostSearchMedicines);

    return (
        <TouchableOpacity style={styles.cardWrapper} activeOpacity={0.4}>
            <View style={styles.cardImgWrapper}>
                <Image
                    style={styles.cardImg}
                    source={
                        mostSearchMedicines?.medicineProfileImg?.imgPath ? { uri: mostSearchMedicines.medicineProfileImg.imgPath } : require('../../assets/images/medicine_placeholder.png')
                    }
                />
            </View>
            <Text style={styles.medName} numberOfLines={1} ellipsizeMode="tail">
                {mostSearchMedicines?.name}
            </Text>
        </TouchableOpacity>
    );
};

export default DefaultMedCard;

const styles = StyleSheet.create({
    cardWrapper: {
        backgroundColor: '#fff',
        margin: wp(1.5),
        borderRadius: wp(3),
        padding: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardImgWrapper: {
        // borderRadius: wp(15),
        // borderWidth: 1,
        // borderColor: ' #000',
        padding: wp(2),
        alignItems: 'center',
        marginBottom: hp(1),
    },
    cardImg: {
        height: 40,
        width: 80,
        objectFit: 'contain',
        // backgroundColor: 'red'
    },
    medName: {
        color: colors.darkGrey,
        fontWeight: '600',
    },
});
