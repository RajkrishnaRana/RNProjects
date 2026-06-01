import { StyleSheet, Text, TouchableOpacity, View, Alert, Linking } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../common/colors';
import Modal from 'react-native-modal';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { trigger } from 'react-native-haptic-feedback';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { hp, wp } from '../../utils/dimesion';

interface Props {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onCodeScanned?: (codes: any[]) => void; // Optional callback for parent
}

export default function QRCodeScanModal({ isVisible, setIsVisible, onCodeScanned }: Props) {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    console.log('isVisible', isVisible);

    // Request permission if not granted (optional UX improvement)
    const requestOrGuide = async (): Promise<boolean> => {
        let has = await requestPermission(); // your normal flow
        if (has) return true;

        return new Promise(resolve => {
            Alert.alert(
                'Camera Permission required',
                'Please enable Camera permission in Settings to punch in/out.',
                [
                    { text: 'Cancel', onPress: () => resolve(false) },
                    {
                        text: 'Open Settings', onPress: () => {
                            Linking.openSettings()
                            resolve(false)
                        }
                    }, // we’ll re-check below
                ],
                { cancelable: false },
            );
        });
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: codes => {
            console.log(`Scanned ${codes.length} codes!`);
            console.log(codes);

            // Close modal on first successful scan
            setIsVisible(false);

            // Optional: Pass result to parent
            if (onCodeScanned) {
                trigger('impactMedium');
                onCodeScanned(codes);
            }
        },
    });

    // Request permission on mount or when modal opens
    useEffect(() => {
        if (!hasPermission && isVisible) {
            requestPermission();
        }
    }, [isVisible, hasPermission, requestPermission]);

    // Handle no permission or no device
    if (!hasPermission) {
        return (
            <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)} style={styles.modal}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>Camera permission required to scan QR code.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => requestOrGuide()}>
                        <Text style={styles.buttonText}>Request Permission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    if (device == null) {
        return (
            <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)} style={styles.modal}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>No camera device found.</Text>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropTransitionOutTiming={0}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Scan QR Code</Text>
                    <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                        <MaterialDesignIcons name="close" size={wp(4.5)} color={colors.black} />
                    </TouchableOpacity>
                </View>

                {/* Camera View */}
                <View style={styles.cameraContainer}>
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isVisible} // Only active when modal is visible
                        codeScanner={codeScanner}
                    />

                    {/* Scanning Frame Overlay */}
                    <View style={styles.overlay} pointerEvents="none">
                        <View style={styles.scannerFrame} />
                        <Text style={styles.hintText}>Align QR code within the frame</Text>
                    </View>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity style={styles.bottomButton} onPress={() => setIsVisible(false)}>
                    <Text style={styles.bottomButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: hp(70),
        paddingHorizontal: wp(5),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    closeButton: {
        padding: 8,
    },
    cameraContainer: {
        flex: 1,
        marginVertical: hp(2),
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'black',
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerFrame: {
        width: wp(60),
        height: wp(60),
        borderWidth: 2,
        borderColor: colors.green,
        borderRadius: 16,
        position: 'relative',
    },
    hintText: {
        color: '#888',
        fontSize: 14,
        marginTop: hp(2),
        textAlign: 'center',
    },
    bottomButton: {
        backgroundColor: colors.red,
        paddingVertical: hp(1.5),
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: hp(2),
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    permissionContainer: {
        backgroundColor: 'white',
        padding: wp(5),
        borderRadius: 16,
        marginHorizontal: wp(5),
        alignItems: 'center',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: hp(3),
        color: '#333',
    },
    button: {
        backgroundColor: colors.green,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(8),
        borderRadius: 12,
        marginVertical: hp(1),
        minWidth: wp(40),
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
});
