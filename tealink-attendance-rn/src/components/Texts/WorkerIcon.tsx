import { Image, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';
import { makeProfileIconText } from '../../utils/textHelper';
import { wp } from '../../utils/dimesion';

interface Props {
    title: string;
    img: string;
    profileImage?: string;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
}

export default function WorkerIcon({ title, img, profileImage, customStyle, customTextStyle }: Props) {
    return (
        <>
            {(img?.includes('file://') || profileImage) ? (
                <View style={[styles.workerProfileIcon, customStyle]}>
                    <Image source={{ uri: profileImage || img }} style={styles.img} />
                </View>
            ) : (
                <LinearGradient colors={['#01B280', colors.darkGreenShade]} style={[styles.workerProfileIcon, customStyle]} useAngle angle={120}>
                    <Text style={[styles.iconText, customTextStyle]}>{makeProfileIconText(title)}</Text>
                </LinearGradient>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    workerProfileIcon: {
        height: wp(12),
        width: wp(12),
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.white,
        borderWidth: 1,
        boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.15)',
    },
    img: { width: '100%', height: '100%', borderRadius: 50 },
    iconText: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: 'white',
    },
});
