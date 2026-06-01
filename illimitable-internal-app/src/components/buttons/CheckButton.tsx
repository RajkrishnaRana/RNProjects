import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../common/colors';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface Props {
    isLoading: boolean;
    title: string;
    onPress: () => void;
    isSecretMode: boolean;
    secretModeFunction: () => void;
}

export default function CheckButton({isLoading, title, onPress, isSecretMode, secretModeFunction}: Props) {
    return (
        <TouchableOpacity style={{width: wp(40), alignSelf: 'center'}} disabled={isLoading} onPress={isSecretMode ? secretModeFunction : onPress}>
            <LinearGradient
                colors={
                    title === 'Done'
                        ? [Colors.LIGHTGREEN, Colors.GREEN]
                        : title === 'Check Out'
                        ? [Colors.PURPLE, Colors.PINK]
                        : isSecretMode
                        ? ['#ff4757', '#c44569']
                        : [Colors.LIGHT_BLUE, Colors.PRIMARY]
                }
                style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator color={Colors.WHITE} size="large" />
                ) : (
                    <>
                        <Image
                            source={
                                title === 'Done'
                                    ? require('../../assets/icons/check.png')
                                    : isSecretMode
                                    ? require('../../assets/icons/danger.png')
                                    : require('../../assets/icons/touch-screen.png')
                            }
                            style={styles.img}
                        />
                        {title !== 'Done' && <Text style={styles.imgTxt}>{title}</Text>}
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: wp(40),
        width: wp(40),
        borderRadius: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.35)',
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
