import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';

export type SpecialiesPayload = {
    token?: string | null;
    latitude: number | undefined;
    longitude: number | undefined;
    searchLocationId: string | undefined;
};

export default function MostSearchedLabTestCard({item, payload}: {item: MostSearchedLabTest; payload: SpecialiesPayload}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                console.log(item);
                navigation.push('LabSearch', {id: item._id});
            }}>
            <Image
                source={item?.labImg?.[0]?.labTestImgPath ? {uri: item?.labImg?.[0]?.labTestImgPath} : require('../../assets/images/pedia.jpg')}
                style={{
                    height: wp(16),
                    width: wp(16),
                    borderRadius: wp(10),
                    // borderWidth: 1,
                    borderColor: colors.primary,
                }}
            />

            <Text style={styles.text}>{item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        width: wp(26),
        borderRadius: wp(3),
        height: hp(17),
        justifyContent: 'center',
        marginBottom: hp(1),
        marginTop: hp(1),
        borderWidth: wp(0.01),
        elevation: 2,
        marginHorizontal: wp(2),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    text: {
        fontSize: wp(3),
        fontWeight: 'bold',
        marginTop: hp(0.8),
        color: colors.darkGrey,
        textAlign: 'center',
    },
});
