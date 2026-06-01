import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {isTab} from '../../utils/isTab';
import ImageViewing from 'react-native-image-viewing';

interface Props {
    src: string | undefined;
    char: string;
    gallery: {uri: string}[];
}

export default function ClinicProfileImg({src, char, gallery}: Props) {
    const [isVisible, setIsVisible] = React.useState(false);
    const onPress = () => {
        console.log('gallery', gallery);
        setIsVisible(true);
    };

    return (
        <>
            <LinearGradient colors={[colors.backgroundColor, colors.blueWhite]} style={styles.imgContainer} useAngle angle={45}>
                {src ? (
                    <TouchableOpacity onPress={onPress}>
                        <Image source={{uri: src}} style={styles.img} />
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.text}>{char}</Text>
                )}
            </LinearGradient>
            <ImageViewing images={gallery} imageIndex={0} visible={isVisible} onRequestClose={() => setIsVisible(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    imgContainer: {
        width: isTab ? wp(10) : wp(18),
        height: isTab ? wp(10) : wp(18),
        borderRadius: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    img: {height: isTab ? wp(9) : wp(17), width: isTab ? wp(9) : wp(17), borderRadius: wp(20)},
    text: {
        textAlign: 'center',
        fontSize: isTab ? wp(4) : wp(7),
        fontWeight: 'bold',
        color: colors.black,
    },
});
