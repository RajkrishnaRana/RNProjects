import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from '../common/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BigButton from '../components/BigButton';
import {useNavigation} from '../hooks/useNavigation';
import LottieView from 'lottie-react-native';

export default function SuccessfulRegistrationScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const handleBackPress = () => {
            // Navigate to the home page
            navigation.navigate('Login'); // Replace 'Home' with your home page route name
            return true; // Prevent default back button behavior
        };

        // Add the back button listener
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress,
        );

        // Cleanup the listener on component unmount
        return () => {
            subscription.remove();
        };
    }, [navigation]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
                paddingHorizontal: wp(5),
            }}>
            <LottieView
                source={require('../assets/LottieFiles/paymentSuccess.json')}
                style={{
                    height: wp(40),
                    width: wp(40),
                    alignSelf: 'center',
                    marginTop: hp(30),
                }}
                autoPlay={true}
                loop={false}
            />
            <View style={{marginTop: hp(20)}}>
                <Text
                    style={{
                        fontSize: wp(6),
                        fontWeight: 'bold',
                        color: colors.black,
                        textAlign: 'center',
                    }}>
                    Successfully Registered
                </Text>
                <Text
                    style={{
                        fontSize: wp(3.5),
                        color: colors.darkGrey,
                        textAlign: 'center',
                        marginTop: hp(1),
                    }}>
                    Thank you for registering. You are now registered in
                </Text>
                <Text
                    style={{
                        fontSize: wp(3.5),
                        color: colors.darkGrey,
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>
                    HRU
                </Text>
            </View>

            <BigButton
                title="Login"
                onPress={() => {
                    navigation.replace('Login');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
