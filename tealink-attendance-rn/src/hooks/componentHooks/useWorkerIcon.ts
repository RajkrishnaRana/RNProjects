import { useAppSelector } from "../typedReduxHooks";
import Toast from "react-native-toast-message";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import { useState } from "react";
import WorkerMaster from "../../model/workerMaster";
import apiEndpoints from "../../constants/apiEndpoints";
import { postData } from "../../services/apiServices";
import databaseServices from "../../services/databaseServices";
import RNBlobUtil from 'react-native-blob-util';
import { Alert } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";

const useWorkerIcon = (workerDetails: WorkerMaster) => {
    const { userData, baseURL } = useAppSelector((state) => state.auth);
    const { online } = useAppSelector(state => state.network);
    const { insertWorkerImage, insertToOfflineMasterForWorkerImage } = databaseServices;
    const { requestPermission } = useCameraPermission();

    const [profileImage, setProfileImage] = useState<string>('');

    const sendToServer = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('workerId', data?.workerId);
            formData.append('profile.jpg', {
                uri: data?.profileImage,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });

            const url = baseURL + apiEndpoints.UPDATE_WORKER_IMAGE;
            const res = await postData(url, formData, true);
            console.log('res', res);

            if (res?.status) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Error Uploading worker image',
                })
                return
            }
        } catch (error) {
            console.error(error);
            insertToOfflineMasterForWorkerImage('POST', data, 'UPDATE_WORKER_IMAGE');
        }
    }

    const openCamera = () => {
        if (!userData?.allowUpdateWorker) {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
                text2: 'You do not have permission to update worker',
            });
            return;
        }

        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 800,
            maxWidth: 800,
            quality: 0.9,
        };

        Alert.alert('Update Image', 'Are you sure you want to update worker image?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
            },
            {
                text: 'Yes',
                onPress: async () => {
                    const hasPermission = await requestPermission();
                    if (!hasPermission) {
                        Toast.show({
                            type: 'error',
                            text1: 'Permission Denied',
                            text2: 'Please enable Camera permission in Settings to update worker image',
                        });
                        return;
                    }

                    launchCamera(options, async (response) => {
                        if (response.didCancel || response.errorCode) {
                            console.log('User cancelled or error:', response.errorMessage);
                            return;
                        }

                        const uri = response.assets?.[0]?.uri;
                        if (uri) {
                            console.log('Selected image URI:', uri);
                            setProfileImage(uri); // This will trigger re-render with new image

                            // Create a permenent storage path for the image
                            const sourcePath = uri.replace('file://', '');
                            const permenantSavePath = `${RNBlobUtil.fs.dirs.DocumentDir}/workerProfilePic_${Date.now()}.jpg`;
                            await RNBlobUtil.fs.cp(sourcePath, permenantSavePath);

                            const data = {
                                workerId: workerDetails?.workerId,
                                profileImage: `file://${permenantSavePath}`,
                            }

                            insertWorkerImage(workerDetails?.workerId, `file://${permenantSavePath}`);
                            if (online) {
                                sendToServer(data);
                            } else {
                                insertToOfflineMasterForWorkerImage('POST', data, 'UPDATE_WORKER_IMAGE');
                            }
                        }
                    })
                },
            },
        ]);
    };

    return {
        profileImage,
        openCamera,
    };
}

export default useWorkerIcon
