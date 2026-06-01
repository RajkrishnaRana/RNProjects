import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isIos} from '../utils/platform';
import {isTab} from '../utils/isTab';
import {RFC_2822} from 'moment';

interface ProfileImageProps {
    profileImage: string | undefined;
    setProfileImage: React.Dispatch<React.SetStateAction<string | undefined>>;
    gender: string | undefined;
}

export default function ProfileImage({profileImage, setProfileImage, gender}: ProfileImageProps) {
    // const [profileImage, setProfileImage] = useState<string | null>();

    async function convertToJpg(uri: string) {
        try {
            const resizedImage = await ImageResizer.createResizedImage(
                uri, // Input URI
                800, // Max width
                800, // Max height
                'JPEG', // Output format (JPEG or PNG)
                80, // Quality (0-100)
                0, // Rotation (optional)
                undefined // Output path (temp file if omitted)
            );
            return resizedImage.uri; // New URI in JPEG format
        } catch (error) {
            console.log('Error converting image:', error);
            return uri; // Fallback to original
        }
    }

    const selectImage = () => {
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        launchCamera({mediaType: 'photo'}, async (response: ImagePickerResponse) => {
                            if (response.didCancel) {
                                console.log('User cancelled image picker');
                            } else if (response.errorCode) {
                                console.log('ImagePicker Error: ', response.errorMessage);
                            } else if (response.assets) {
                                const jpgUri = await convertToJpg(response.assets[0].uri || '');
                                setProfileImage(jpgUri);
                            }
                        });
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        launchImageLibrary({mediaType: 'photo'}, async (response: ImagePickerResponse) => {
                            if (response.didCancel) {
                                console.log('User cancelled image picker');
                            } else if (response.errorCode) {
                                console.log('ImagePicker Error: ', response.errorMessage);
                            } else if (response.assets) {
                                const jpgUri = await convertToJpg(response.assets[0].uri || '');
                                setProfileImage(jpgUri);
                            }
                        });
                    },
                },
                {text: 'Cancel', style: 'cancel'},
            ],
            {cancelable: true}
        );
    };
    return (
        <View style={styles.profileContainer}>
            <TouchableOpacity onPress={selectImage}>
                <Image
                    source={
                        profileImage
                            ? {uri: profileImage}
                            : gender === 'MALE'
                            ? require('../assets/icons/user.png')
                            : require('../assets/icons/user.png')
                    }
                    style={styles.profileImage}
                />

                <View style={styles.editIcon}>
                    <FontAwesome name="cloud-upload" size={isTab ? wp(2.5) : isIos() ? wp(3.5) : wp(4)} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        marginVertical: hp(1.5),
    },
    profileImage: {
        width: isTab ? wp(15) : wp(20),
        height: isTab ? wp(15) : wp(20),
        borderRadius: wp(15),
        borderWidth: wp(0.2),
        borderColor: colors.grey,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: wp(1),
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 5,
    },
});
