import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'react-native-vision-camera-face-detector';
import { hp, wp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import { useFaceDetection } from '../../hooks/faceDetectionHooks/useFaceDetection';
import Animated from 'react-native-reanimated';
import { CameraDevice } from 'react-native-vision-camera';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const MessageOnCamera = ({ message }: { message: string }) => {
    return (
        <View style={styles.messageTxtContainer}>
            <Text style={styles.messageTxt}>{message}</Text>
        </View>
    );
};

interface Props {
    isVisible: boolean;
    setIsVisible: any;
    setImage: any;
    blinkingEnabled: boolean;
    smileDetectionEnabled: boolean;
}

export default function FaceDetectionModuleScreen({ isVisible, setIsVisible, setImage, blinkingEnabled, smileDetectionEnabled }: Props) {
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
        setCameraFacing,
    } = useFaceDetection(setImage, setIsVisible, blinkingEnabled, smileDetectionEnabled);

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            {hasPermission && isFocused ? (
                <>
                    <Camera
                        // @ts-ignore
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        isActive={isVisible}
                        device={cameraDevice as CameraDevice}
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

                    {message && <MessageOnCamera message={message} />}

                    {/* {blinkMessage && <MessageOnCamera message={blinkMessage} />} */}
                </>
            ) : (
                <Text>No Device</Text>
            )}

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => setIsVisible(false)}>
                    <Text style={styles.buttonTxt}>Close camera</Text>
                </Pressable>

                <Pressable style={styles.camRotationButton} onPress={() => setCameraFacing(current => (current === 'front' ? 'back' : 'front'))}>
                    <FontAwesome6 name="camera-rotate" size={wp(7)} color={colors.white} iconStyle="solid" />
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
    buttonTxt: { color: 'white', fontWeight: 'bold', fontSize: wp(4) },
    camRotationButton: {
        backgroundColor: colors.transparentWhiteBackground,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 50,
    },
    messageTxtContainer: {
        position: 'absolute',
        top: hp(5),
        alignSelf: 'center',
        backgroundColor: colors.transparentWhiteBackground,
        padding: 10,
        borderRadius: 10,
    },
    messageTxt: {
        color: colors.white,
        fontSize: wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
