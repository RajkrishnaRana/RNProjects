import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { android_ripple_value, ScreenOptions } from '../../constants/screenOptions';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';
import Lucide from '@react-native-vector-icons/lucide';
import { useNavigation } from '../../hooks/useNavigation';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import Toast from 'react-native-toast-message';

export default function ScreenOptionsCard({ option }: { option: ScreenOptions }) {
    const navigation = useNavigation();
    const { authenticationTime } = useAppSelector(state => state.auth);

    return (
        <Pressable
            onPress={() => {
                if (authenticationTime && Date.now() < authenticationTime) {
                    Toast.show({
                        type: 'error',
                        text1: 'Timezone mismatched',
                        text2: 'Please fix your device timezone',
                    });
                    return;
                }
                navigation.push(option.navigation);
            }}
            android_ripple={android_ripple_value}
        >
            <LinearGradient
                colors={['#00C855', '#00AA84']}
                useAngle={true}
                angle={160}
                angleCenter={{ x: 0.5, y: 0.5 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1.0 }}
                style={styles.container}
            >
                <View style={styles.bodyContainer}>
                    <View style={styles.imgContainer}>
                        <Image source={option.img} style={styles.img} />
                    </View>
                    <View style={styles.optionContainer}>
                        <Text style={styles.screenName}>{option.name}</Text>
                        <Text style={styles.screenDetails}>{option.descriptions}</Text>
                    </View>
                </View>
                <Lucide name="chevron-right" size={20} color={colors.white} />
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    bodyContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    imgContainer: {
        height: 35,
        width: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentWhiteBackground,
    },
    img: {
        width: 18,
        height: 18,
        alignSelf: 'center',
        tintColor: colors.white,
    },
    optionContainer: { gap: 4 },
    screenName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.white,
    },
    screenDetails: {
        fontSize: 10,
        color: colors.white,
    },
});
