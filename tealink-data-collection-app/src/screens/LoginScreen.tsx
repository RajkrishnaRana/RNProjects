import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextField from '../components/TextField';
import { useLogin } from '../hooks/useLogin';
import BigButton from '../components/Buttons/BigButton';
import BackgroundGradient from '../components/BackgroundGradient';
import QRCodeScanModal from '../components/Modals/QRCodeScanModal';

export default function LoginScreen() {
    const { loginId, setLoginId, password, setPassword, baseUrl, setBaseUrl, handleLogin, loading, isQRCodeScan, setIsQRCodeScan, onQRCodeScanned } =
        useLogin();

    return (
        <BackgroundGradient>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Image source={require('../assets/images/tealink.png')} style={styles.img} />

                    <View style={styles.textFieldContainer}>
                        <TextField label="Login Id" placeholder="Enter Login Id.." value={loginId} onChangeText={setLoginId} isNecessary />
                        <TextField
                            label="Password"
                            placeholder="Enter Password.."
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                            isNecessary
                        />
                        <TextField
                            label="Base URL"
                            placeholder="Enter Base URL"
                            value={baseUrl}
                            onChangeText={t => setBaseUrl(t)}
                            isQRCodeScan
                            setQRCodeScan={() => setIsQRCodeScan(prev => !prev)}
                        />
                    </View>

                    <BigButton title="Login" onPress={handleLogin} loading={loading} customStyle={{ marginHorizontal: wp(5) }} />
                </ScrollView>
            </KeyboardAvoidingView>

            <QRCodeScanModal isVisible={isQRCodeScan} setIsVisible={setIsQRCodeScan} onCodeScanned={onQRCodeScanned} />
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingBottom: hp(4) },
    keyboardAvoid: { flex: 1 },
    textFieldContainer: { gap: hp(2), paddingHorizontal: wp(5) },
    img: {
        width: wp(60),
        height: hp(15),
        marginTop: hp(15),
        alignSelf: 'center',
        marginBottom: hp(5),
    },
});
