import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { cameraServices } from '../services/cameraServices';
import { colors } from '../common/colors';
import { useCameraPermission } from 'react-native-vision-camera';

interface Props {
    image: any;
    setImage: any;
    label: string;
    isNecessary?: boolean;
}

export default function CameraModule({ image, setImage, label, isNecessary }: Props) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const { openCamera } = cameraServices;

    const requestOrGuide = async (): Promise<boolean> => {
        let has = await requestPermission(); // your normal flow
        if (has) return true;

        return new Promise(resolve => {
            Alert.alert(
                'Camera Permission required',
                'Please enable Camera permission in Settings to punch in/out.',
                [
                    { text: 'Cancel', onPress: () => resolve(false) },
                    { text: 'Open Settings', onPress: () => (Linking.openSettings(), resolve(false)) }, // we’ll re-check below
                ],
                { cancelable: false },
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <TouchableOpacity style={styles.camContainer} onPress={() => openCamera(image, setImage, requestOrGuide)}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.img} />
                ) : (
                    <MaterialCommunityIcons name="camera-plus-outline" size={50} color="grey" />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: hp(0.5) },
    camContainer: {
        backgroundColor: 'white',
        paddingVertical: hp(1),
        borderRadius: wp(5),
        alignItems: 'center',
        elevation: 2,
    },
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    img: { width: wp(30), height: hp(20) },
});
