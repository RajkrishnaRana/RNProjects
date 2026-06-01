import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';

export const cameraServices = {
    openCamera: (image: any, setImage: any, requestOrGuide: () => void) => {
        requestOrGuide();
        launchCamera({ mediaType: 'photo' }, async (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    },
};
