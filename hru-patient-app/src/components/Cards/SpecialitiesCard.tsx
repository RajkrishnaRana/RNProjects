import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';
import {isTab} from '../../utils/isTab';

export type SpecialiesPayload = {
    token?: string | null;
    latitude: number | undefined;
    longitude: number | undefined;
    searchLocationId: string | undefined;
};

export default function SpecialitiesCard({item, payload}: {item: MostSearchedSpeciality; payload: SpecialiesPayload}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                console.log(item);
                navigation.push('SpecialitiesBasedDoctors', {
                    id: item._id,
                    payload: payload,
                });
            }}>
            <Image
                source={item?.specialityImgPath ? {uri: item?.specialityImgPath} : require('../../assets/images/pedia.jpg')}
                style={{
                    height: isTab ? wp(8) : wp(16),
                    width: isTab ? wp(8) : wp(16),
                    borderRadius: wp(10),
                    // borderWidth: 1,
                    borderColor: colors.primary,
                }}
            />

            <Text style={styles.text}>{item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        width: isTab ? wp(14) : wp(26),
        marginHorizontal: isTab ? wp(1) : wp(2),
        borderRadius: isTab ? wp(1.5) : wp(3),
        height: isTab ? hp(10) : hp(14),
        justifyContent: 'center',
        marginBottom: hp(1.5),
    },
    text: {
        fontSize: isTab ? wp(1.5) : wp(2.6),
        fontWeight: 'bold',
        marginTop: hp(0.8),
        color: colors.darkGrey,
        textAlign: 'center',
    },
});
