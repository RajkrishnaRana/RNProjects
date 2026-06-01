import React, {useEffect} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming} from 'react-native-reanimated';
import {Colors} from '../../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface Props {
    isLoading: boolean;
    title: string;
    onPress: () => void;
}

export default function CheckButton2({isLoading, title, onPress}: Props) {
    /* ---- layer drivers ---- */
    const oldBtn = useSharedValue(1); // 1 = visible
    const newBtn = useSharedValue(0); // 1 = visible
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        oldBtn.value = withSequence(withTiming(1.2, {duration: 500}), withSpring(1, {damping: 10, stiffness: 500}));
        newBtn.value = withTiming(0, {duration: 500});
        rotation.value = 0;
    }, [oldBtn, newBtn, rotation]);

    /* ---- animated styles ---- */
    const oldStyle = useAnimatedStyle(() => ({
        opacity: oldBtn.value,
        transform: [{scale: oldBtn.value}, {rotateZ: `${rotation.value}deg`}],
    }));

    const newStyle = useAnimatedStyle(() => ({
        opacity: newBtn.value,
        transform: [{scale: newBtn.value}],
    }));

    /* ---- palettes ---- */
    const normalColors =
        title === 'Done'
            ? [Colors.LIGHTGREEN, Colors.GREEN]
            : title === 'Check Out'
            ? [Colors.PURPLE, Colors.PINK]
            : [Colors.LIGHT_BLUE, Colors.PRIMARY];

    const secretColors = ['#ff4757', '#c44569'];

    return (
        <View style={{width: wp(40), aspectRatio: 1, alignSelf: 'center', overflow: 'visible'}}>
            {/* NORMAL BUTTON (fades / explodes away) */}
            <Animated.View style={[StyleSheet.absoluteFill, oldStyle]}>
                <TouchableOpacity style={styles.button} disabled={isLoading} onPress={onPress}>
                    <LinearGradient colors={normalColors} style={styles.fill}>
                        {isLoading ? (
                            <ActivityIndicator color={Colors.WHITE} size="large" />
                        ) : (
                            <>
                                <Image
                                    source={
                                        title === 'Done' ? require('../../assets/icons/check.png') : require('../../assets/icons/touch-screen.png')
                                    }
                                    style={styles.img}
                                />
                                {title !== 'Done' && <Text style={styles.imgTxt}>{title}</Text>}
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {width: wp(40), alignSelf: 'center'},
    button: {
        height: wp(40),
        width: wp(40),
        borderRadius: wp(20),
        overflow: 'hidden',
    },
    fill: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: wp(20),
        height: wp(20),
        tintColor: Colors.WHITE,
    },
    imgTxt: {
        marginTop: hp(1),
        color: Colors.WHITE,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
});
