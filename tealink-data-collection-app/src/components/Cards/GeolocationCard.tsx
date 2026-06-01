import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '../../hooks/useNavigation';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
    sectionData: { _id: string; name: string }[];
}

export default function GeolocationCard({ sectionData }: Props) {
    const navigation = useNavigation();

    return (
        <AnimatedTouchableOpacity
            entering={FadeInDown.springify()}
            style={[styles.container]}
            onPress={() => navigation.push('Geolocation', { sectionData })}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
                <Image source={require('../../assets/Icons/geofencing.png')} style={styles.img} />
                <View>
                    <Text style={styles.text}>Geofencing</Text>
                    <Text style={styles.descText}>Measure easily using GPS!</Text>
                </View>
            </View>

            <EntypoIcons name="chevron-right" size={wp(5)} color="black" style={{ marginRight: wp(5) }} />
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(3),
        backgroundColor: 'white',
        elevation: 3,
        marginTop: hp(2),
        marginBottom: hp(2),
        marginHorizontal: wp(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
        boxShadow: '3px 3px 4px rgba(4, 99, 4,0.25)',
    },
    bar: {
        position: 'absolute',
        height: '100%',
        width: wp(1),
    },
    nameSection: {},
    imgContainer: {
        width: wp(13),
        height: wp(13),
        borderRadius: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(1),
    },
    textImg: {
        fontSize: wp(4.5),
        color: 'white',
        fontWeight: '600',
    },
    img: { width: wp(17), height: wp(17) },
    text: {
        fontSize: wp(5.5),
        color: 'black',
        fontWeight: '500',
    },
    descText: {
        fontSize: wp(3.5),
        color: colors.grey,
        fontWeight: '400',
    },
});
