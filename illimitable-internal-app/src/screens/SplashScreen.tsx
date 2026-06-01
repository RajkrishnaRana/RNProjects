import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withDelay} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useAuthStore} from '../store/authStore';
import {useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {postData} from '../utils/apiHelper';
import {useNavigation} from '../hooks/useNavigation';
import {Colors} from '../common/colors';

export default function SplashScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const {isAuthenticated, token, logout} = useAuthStore();
    const slowMessageTimeout = useRef<NodeJS.Timeout | null>(null);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) {
            return;
        }
        hasFetched.current = true;

        slowMessageTimeout.current = setTimeout(() => {
            setLoadingStatus(true);
        }, 3000);

        const validateToken = async () => {
            let valid = isAuthenticated;
            try {
                const url = 'https://illimitable.in/app/mobile/validate-token.json';
                console.log({token});
                const res = await postData(url, {
                    token: token,
                });
                console.log('token check res', res);

                if (res?.tokenExpired === true) {
                    Toast.show({
                        type: 'info',
                        text1: 'Token Expires, Please login again',
                        visibilityTime: 4000,
                    });

                    valid = false;
                    logout(); // Logout if token is invalid
                    queryClient.clear();
                }
            } catch (error) {
                if (error instanceof TypeError && error.message === 'Network request failed') {
                } else {
                    console.error('Token validation error:', error);
                    Toast.show({
                        type: 'error',
                        text1: `${error}`,
                        visibilityTime: 4000,
                    });
                }
            } finally {
                if (slowMessageTimeout.current) {
                    clearTimeout(slowMessageTimeout.current);
                }
                setTimeout(() => {
                    valid ? navigation.replace('Home') : navigation.replace('Login');
                }, 120); // Optional delay for splash effect
            }
        };

        validateToken();

        return () => {
            if (slowMessageTimeout.current) {
                clearTimeout(slowMessageTimeout.current);
            }
        };
    }, [token, logout, queryClient, navigation, isAuthenticated]);

    // Animation --------------------------------------->
    const imageOffset = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        // Delay slide animation after FadeInDown
        setTimeout(() => {
            imageOffset.value = withTiming(-wp(33), {duration: 700});
            textOpacity.value = withDelay(200, withTiming(1, {duration: 700}));
        }, 700);
    }, [imageOffset, textOpacity]);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: imageOffset.value}],
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Animated Image */}

            <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.imgContainer}>
                {/* Animated Image */}
                <Animated.View style={[imageAnimatedStyle]}>
                    <Image source={require('../assets/images/company_logo.png')} style={styles.img} />
                </Animated.View>
            </Animated.View>

            {/* Animated Text */}
            <Animated.View style={[styles.textLogo, textAnimatedStyle]}>
                <Image source={require('../assets/images/logo_blue.png')} style={styles.logoImg} />
            </Animated.View>

            <Animated.View style={styles.lottieContainer} entering={FadeInDown.delay(700).springify()}>
                <LottieView style={styles.lottie} speed={1} source={require('../assets/Lottie/splash.json')} autoPlay loop={false} />
            </Animated.View>

            {loadingStatus && (
                <Animated.View style={styles.loadingStatusContainer} entering={FadeInDown.springify()}>
                    <Text style={styles.loadingStatus}>Validation check is taking longer than usual ...</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imgContainer: {
        position: 'absolute',
    },
    img: {
        height: wp(25),
        width: wp(25),
        borderRadius: wp(5),
        // marginBottom: hp(3),
    },
    logoImg: {
        width: wp(60),
        height: hp(9),
    },
    textLogo: {
        position: 'absolute',
        marginLeft: wp(26),
        opacity: 0, // Start hidden
    },
    lottieContainer: {
        marginTop: hp(70),
        height: 200,
        width: wp(80),
    },
    lottie: {flex: 1},
    loadingStatusContainer: {
        position: 'absolute',
        bottom: hp(10),
    },
    loadingStatus: {
        fontSize: wp(3),
        color: Colors.BLACK,
    },
});
