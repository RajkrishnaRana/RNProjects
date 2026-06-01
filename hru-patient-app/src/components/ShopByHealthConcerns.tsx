import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {FlashList} from '@shopify/flash-list';

const healthConcerns = [
    {
        name: 'Diabates',
        imgUrl: require('../assets/images/diabetesCare.png'),
    },
    {
        name: 'Heart Care',
        imgUrl: require('../assets/images/heartCare.png'),
    },
    {
        name: 'Stomach Care',
        imgUrl: require('../assets/images/stomachCare.png'),
    },
];

export default function ShopByHealthConcerns() {
    return (
        <View style={{marginTop: hp(2), flex: 1}}>
            <Text style={styles.header}>Shop by health concerns</Text>

            <View style={{flex: 1, marginVertical: hp(2)}}>
                <FlashList
                    horizontal
                    data={healthConcerns}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.careCardContainer}>
                            <Image
                                source={item.imgUrl}
                                style={styles.imgContainer}
                            />
                            <Text
                                style={{
                                    color: colors.lightBlack,
                                    fontSize: wp(3.5),
                                    // fontWeight: 'bold',
                                    // paddingVertical: hp(1),
                                }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    estimatedItemSize={50}
                    keyExtractor={item => item.name}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: wp(5),
        fontWeight: '600',
        color: colors.lightBlack,
    },
    careCardContainer: {
        marginHorizontal: wp(2),
        alignItems: 'center',
        // borderWidth: wp(0.1),
        // borderColor: colors.grey,
        // borderRadius: wp(5),
    },
    imgContainer: {
        width: wp(30),
        height: wp(20),
        borderTopLeftRadius: wp(3),
        borderTopRightRadius: wp(3),
    },
});
