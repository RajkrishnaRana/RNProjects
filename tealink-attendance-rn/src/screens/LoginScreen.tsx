import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { wp, hp } from '../utils/dimesion';
import TextField from '../components/TextField';
import { useLogin } from '../hooks/authHooks/useLogin';
import { Controller } from 'react-hook-form';
import { colors } from '../common/colors';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import MidButton from '../components/Buttons/MidButton';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import CheckBox from '../components/CheckBox';
import BlurryImageBackground from '../components/Backgrounds/BlurryImageBackground';
import QRCodeScanModal from '../components/Modals/QRCodeScanModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function LoginScreen() {
    const {
        control,
        loginControl,
        handleSaveConfig,
        handleLoginPress,
        errors,
        loginErrors,
        disableDownload,
        setDisableDownload,
        configSaved,
        loading,
        isQRCodeScan,
        setIsQRCodeScan,
        onQRCodeScanned,
    } = useLogin();

    return (
        <BlurryImageBackground>
            <KeyboardAwareScrollView contentContainerStyle={styles.keyboardContainer}>
                {/* White overlay */}
                <View style={styles.whiteOverlay} />
                {/* Foreground content */}
                <View style={styles.container}>
                    <Image source={require('../assets/images/tealink-login.png')} style={styles.img} />
                    <Image source={require('../assets/images/tealink-logo.png')} style={styles.logoImg} />

                    <View style={styles.formContainer}>
                        <Controller
                            control={loginControl}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    leftIcon={<FontAwesome6 name="user" size={wp(3.5)} color={colors.grey} iconStyle="solid" />}
                                    placeholder="Enter username"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorValue={loginErrors.username?.message}
                                />
                            )}
                        />

                        <Controller
                            control={loginControl}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    leftIcon={<FontAwesome6 name="lock" size={wp(3.5)} color={colors.grey} iconStyle="solid" />}
                                    placeholder="Enter password"
                                    isPassword
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorValue={loginErrors.password?.message}
                                />
                            )}
                        />

                        <View style={{ gap: hp(2.5) }}>
                            <Controller
                                control={loginControl}
                                name="deviceName"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextField
                                        leftIcon={<FontAwesome name="id-badge" size={wp(3.5)} color={colors.grey} />}
                                        placeholder="Enter device name"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        errorValue={loginErrors.deviceName?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="baseURL"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextField
                                        leftIcon={<FontAwesome6 name="gear" size={wp(3.5)} color={colors.grey} iconStyle="solid" />}
                                        rightIcon={<MaterialDesignIcons name="qrcode-scan" size={wp(4.5)} color={colors.black} />}
                                        placeholder="Enter BASE URL"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        errorValue={errors.baseURL?.message}
                                        rightIconPress={() => setIsQRCodeScan(true)}
                                    />
                                )}
                            />
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <CheckBox
                                rememberMe={disableDownload}
                                setRememberMe={() => setDisableDownload(prev => !prev)}
                                title="Disable download of worker Images?"
                            />
                        </View>

                        {/* <BaseLinkModal /> */}
                        {configSaved ? (
                            <MidButton title="Login" onPress={handleLoginPress} loading={loading.login || loading.downloadWorkerImg || loading.finalizingData} />
                        ) : (
                            <MidButton title="Save Configuration" onPress={handleSaveConfig} loading={loading.config} />
                        )}
                        {loading.downloadWorkerImg && <Text style={styles.downloadingWorkerImgText}>Downloading Worker images ...</Text>}
                        {loading.finalizingData && <Text style={styles.downloadingWorkerImgText}>Finalizing Data ...</Text>}
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <QRCodeScanModal isVisible={isQRCodeScan} setIsVisible={setIsQRCodeScan} onCodeScanned={onQRCodeScanned} />
        </BlurryImageBackground>
    );
}

const styles = StyleSheet.create({
    whiteOverlay: {
        ...StyleSheet.absoluteFillObject, // covers entire ImageBackground
        backgroundColor: 'rgba(255,255,255,0.4)', // 40 % white
    },
    keyboardContainer: { flexGrow: 1, paddingBottom: hp(5) },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    img: {
        width: 'auto',
        height: wp(60),
        marginHorizontal: 15,
        borderRadius: 20,
        marginTop: 10,
    },
    logoImg: {
        width: wp(35),
        height: wp(14),
        alignSelf: 'center',
        marginTop: hp(3),
    },
    formContainer: {
        gap: hp(2.5),
        paddingHorizontal: wp(5),
        marginTop: hp(2),
    },
    checkBoxContainer: { alignSelf: 'center' },
    downloadingWorkerImgText: {
        color: colors.white,
        fontSize: wp(3),
        fontWeight: 'bold',
        position: 'absolute',
        bottom: hp(-2.3),
        alignSelf: 'center',
    },
});
