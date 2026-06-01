import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'react-native-vision-camera-face-detector';
import { hp, wp } from '../utils/dimesion';
import { colors } from '../common/colors';
import { useFaceDetection } from '../hooks/faceDetectionHooks/useFaceDetection';
import Animated from 'react-native-reanimated';
import { CameraDevice } from 'react-native-vision-camera';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import { useNavigation } from '../hooks/useNavigation';
// import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

type FaceDetectionRouteProp = RouteProp<RootStackParamList, 'FaceDetection'>;

const MessageOnCamera = ({ message }: { message: string }) => {
    return (
        <View style={styles.messageTxtContainer}>
            <Text style={styles.messageTxt}>{message}</Text>
        </View>
    );
};

export default function FaceDetectionModuleScreen() {
    const navigation = useNavigation();
    const { blinkingEnabled, smileDetectionEnabled, routeName } = useRoute<FaceDetectionRouteProp>().params;

    const {
        camera,
        isFocused,
        hasPermission,
        cameraDevice,
        handleCameraMountError,
        handleFacesDetected,
        handleUiRotation,
        handleSkiaActions,
        faceDetectionOptions,
        cameraFacing,
        message,
        boundingBoxStyle,
        // setCameraFacing,
        torch,
        setTorch,
        format,
        // squareSize,
        previewWidth,
        previewHeight,
    } = useFaceDetection(navigation, blinkingEnabled, smileDetectionEnabled, routeName);

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            {message && <MessageOnCamera message={message} />}
            {hasPermission && isFocused ? (
                // eslint-disable-next-line react-native/no-inline-styles
                <View style={{ height: previewHeight, width: previewWidth, position: 'relative' }}>
                    <Camera
                        // @ts-ignore
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        isActive={true}
                        torch={torch}
                        photo={true}
                        device={cameraDevice as CameraDevice}
                        format={format}
                        lowLightBoost={cameraDevice?.supportsLowLightBoost ?? false} // ← auto low light
                        exposure={0.5}
                        onError={handleCameraMountError}
                        faceDetectionCallback={handleFacesDetected}
                        onUIRotationChanged={handleUiRotation}
                        // @ts-ignore
                        skiaActions={handleSkiaActions}
                        faceDetectionOptions={{
                            ...faceDetectionOptions,
                            autoMode: true,
                            cameraFacing,
                        }}
                    />

                    <Animated.View style={boundingBoxStyle} />
                </View>
            ) : (
                <Text>No Device</Text>
            )}

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonTxt}>Close camera</Text>
                </Pressable>

                {/* <Pressable style={styles.camRotationButton} onPress={() => setCameraFacing(current => (current === 'front' ? 'back' : 'front'))}>
                    <FontAwesome6 name="camera-rotate" size={wp(7)} color={colors.black} iconStyle="solid" />
                </Pressable> */}

                <Pressable style={styles.camRotationButton} onPress={() => setTorch(current => (current === 'off' ? 'on' : 'off'))}>
                    <MaterialDesignIcons name={torch === 'on' ? 'flashlight' : 'flashlight-off'} size={wp(7)} color={colors.black} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: hp(5),
        flexDirection: 'row',
        gap: wp(4),
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.transparentRedBackground,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    buttonTxt: { color: 'black', fontWeight: 'bold', fontSize: wp(4) },
    camRotationButton: {
        backgroundColor: colors.transparentBlackBackground,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 50,
    },
    messageTxtContainer: {
        position: 'absolute',
        top: hp(5),
        alignSelf: 'center',
        backgroundColor: colors.transparentBlackBackground,
        padding: 10,
        borderRadius: 10,
    },
    messageTxt: {
        color: colors.black,
        fontSize: wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
