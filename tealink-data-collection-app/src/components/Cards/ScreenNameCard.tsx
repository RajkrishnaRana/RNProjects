import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useScreenNameCard } from '../../hooks/useScreenNameCard';
import { colors } from '../../common/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
    screen: Screen;
    len: number;
}

export default function ScreenNameCard({ screen, len }: Props) {
    const { handlePress, imageText, getRandomColorPair } = useScreenNameCard();
    const { deepColor, lightColor } = getRandomColorPair();

    return (
        <AnimatedTouchableOpacity
            entering={FadeInDown.springify()}
            key={screen.name}
            style={[styles.container, len >= 4 && { width: wp(44), height: hp(18), marginLeft: wp(3), justifyContent: 'center' }]}
            onPress={() => handlePress(screen)}
        >
            <View style={[styles.nameSection, len < 4 && { padding: wp(5), flexDirection: 'row' }]}>
                <LinearGradient colors={[lightColor, deepColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.imgContainer}>
                    <Text style={styles.textImg}>{imageText(screen.name)}</Text>
                </LinearGradient>
                <Text style={styles.text}>{screen.name.length > 18 ? `${screen.name.slice(0, 18)}...` : screen.name}</Text>
            </View>

            {len < 4 && <EntypoIcons name="chevron-right" size={wp(5)} color="black" style={{ marginRight: wp(5) }} />}
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(3),
        backgroundColor: 'white',
        marginVertical: hp(1),
        elevation: 3,
        marginHorizontal: wp(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '3px 3px 4px rgba(4, 99, 4,0.25)',
    },
    bar: {
        position: 'absolute',
        height: '100%',
        width: wp(1),
    },
    nameSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(3),
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
    },
    imgContainer: {
        width: wp(13),
        height: wp(13),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textImg: {
        fontSize: wp(4.5),
        color: 'black',
        fontWeight: '600',
    },
    img: { width: wp(10), height: wp(10), tintColor: colors.green },
    text: {
        fontSize: wp(4.5),
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
    },
    descText: {
        fontSize: wp(3.5),
        color: colors.grey,
        fontWeight: '500',
    },
});
