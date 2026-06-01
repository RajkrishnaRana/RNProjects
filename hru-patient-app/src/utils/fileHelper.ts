import { Alert, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-simple-toast';
import { BASE_URL } from '../config';
import { DeletefileParams } from '../screens/HealthVault/PrescriptionScreen';
import { postData } from '../api';
import { queryClient } from '../../App';
import { isIos } from './platform';

// Permission checker function
// const checkStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//         try {
//             // Check permission status
//             const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//             if (result === RESULTS.GRANTED) {
//                 console.log('READ_EXTERNAL_STORAGE permission granted');
//                 return true;
//             }

//             // Request permission if not granted
//             if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
//                 const requestResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//                 if (requestResult === RESULTS.GRANTED) {
//                     console.log('READ_EXTERNAL_STORAGE permission granted after request');
//                     return true;
//                 } else {
//                     console.log('READ_EXTERNAL_STORAGE permission denied:', requestResult);
//                     return false;
//                 }
//             } else {
//                 // Permission is blocked (user selected "Deny & don't ask again" or system restriction)
//                 console.log('READ_EXTERNAL_STORAGE permission blocked:', result);
//                 Alert.alert('Permission Blocked', 'Please enable storage permission in your device settings to access files.', [
//                     {text: 'Cancel', style: 'cancel'},
//                     {text: 'Open Settings', onPress: () => Linking.openSettings()},
//                 ]);
//                 return false;
//             }
//         } catch (error) {
//             console.error('Permission check error:', error);
//             return false;
//         }
//     }
//     return true; // iOS or no permission needed
// };

// Function to request storage permission (Android)
// const requestStoragePermissions = async () => {
//     try {
//         const writeGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download files.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//         });

//         const readGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download files.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//         });

//         return writeGranted === PermissionsAndroid.RESULTS.GRANTED && readGranted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//         console.warn(err);
//         return false;
//     }
// };

function ensurePdfExtension(filename: string) {
    // Check if filename ends with .pdf (case-insensitive)
    if (filename.toLowerCase().endsWith('.pdf')) {
        return filename; // Return unchanged if already ends with .pdf
    }
    // Add .pdf extension
    return filename + '.pdf';
}

export const savePath = () => {
    const dir = Platform.OS === 'ios' ? ReactNativeBlobUtil.fs.dirs.DocumentDir : '/storage/emulated/0/Download'; // Use DownloadDir for Android

    return dir;
};

// Function to download the file
const downloadFile = async (
    fileUrl: string,
    fileName: string,
    mimeType?: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    headers?: { [key: string]: string },
) => {
    try {
        const dir = savePath(); // Your function to get the directory (e.g., DownloadDir)
        const filePath = `${dir}/${ensurePdfExtension(fileName)}`;
        console.log('filePath', filePath);

        // Prepare body and headers
        let requestBody: string | any[] | null = null;
        let finalHeaders = headers || {};

        if (body) {
            if (typeof body === 'string') {
                requestBody = body;
            } else if (Array.isArray(body)) {
                requestBody = body;
                if (!finalHeaders['Content-Type']) {
                    finalHeaders['Content-Type'] = 'multipart/form-data';
                }
            } else if (typeof body === 'object') {
                requestBody = JSON.stringify(body);
                if (!finalHeaders['Content-Type']) {
                    finalHeaders['Content-Type'] = 'application/json';
                }
            }
        }

        // Base configuration
        const config: any = {
            fileCache: true,
        };

        // Platform-specific handling
        if (Platform.OS === 'ios') {
            config.path = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${ensurePdfExtension(fileName)}`;
        } else if (Platform.OS === 'android') {
            if (method === 'GET') {
                config.addAndroidDownloads = {
                    useDownloadManager: true,
                    notification: true,
                    title: fileName,
                    description: 'Downloading file...',
                    mediaScannable: true,
                    path: filePath,
                };
            }
            // For POST, Download Manager is NOT used – file is cached
        }

        Toast.show('Starting download...', Toast.SHORT);
        if (!fileUrl.includes('http')) {
            throw new Error('Invalid URL');
        }

        // Perform the request
        const res = await ReactNativeBlobUtil.config(config).fetch(method, fileUrl, finalHeaders, requestBody);

        // Handle POST on Android: move cached file to final destination
        if (Platform.OS === 'android' && method === 'POST') {
            const tempPath = res.path();
            console.log('Temporary file path:', tempPath);

            // 1. Verify temporary file exists
            const tempExists = await ReactNativeBlobUtil.fs.exists(tempPath);
            if (!tempExists) {
                throw new Error('Temporary file not found');
            }

            // 2. Ensure destination directory exists
            const destDirExists = await ReactNativeBlobUtil.fs.exists(dir);
            if (!destDirExists) {
                await ReactNativeBlobUtil.fs.mkdir(dir);
            }

            // 3. Try to move the file (fastest)
            await ReactNativeBlobUtil.fs.cp(tempPath, filePath);
            await ReactNativeBlobUtil.fs.unlink(tempPath);

            // 4. Make the file visible to Android Media Scanner
            if (Platform.OS === 'android') {
                ReactNativeBlobUtil.fs.scanFile([{ path: filePath, mime: mimeType || 'application/octet-stream' }]);
            }
        }

        Toast.show('File downloaded successfully', Toast.SHORT);
    } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to download the file.');
    }
};

const viewFile = async (
    fileUrl: string,
    fileName: string,
    navigation: any,
    type?: string,
    method: 'GET' | 'POST' = 'GET', // HTTP method, default GET
    body?: any, // Request body for POST
    headers?: { [key: string]: string }, // Custom headers
) => {
    try {
        const dir = ReactNativeBlobUtil.fs.dirs.DocumentDir;
        const filePath = isIos() ? `file://${dir}/${ensurePdfExtension(fileName)}` : `file://${dir}/${fileName}`;
        console.log('Checking file at:', filePath);

        const exists = await ReactNativeBlobUtil.fs.exists(`${filePath}.pdf`);
        const existsWithoutPDF = await ReactNativeBlobUtil.fs.exists(filePath);

        const parts = fileUrl.split('/');
        const itemId = parts[parts.indexOf('patient') + 1];

        if (exists) {
            navigation.push('PDFView', { fileUrl: `${filePath}.pdf`, type: type, _id: itemId });
        } else if (existsWithoutPDF) {
            navigation.push('PDFView', { fileUrl: `${filePath}`, type: type, _id: itemId });
        } else {
            try {
                const finalFilePath = `${dir}/${ensurePdfExtension(fileName)}`;
                Toast.show('Waiting for opening file...', Toast.LONG);

                // Prepare body and headers for ReactNativeBlobUtil
                let requestBody: string | any[] | null = null;
                let finalHeaders = headers || {};

                if (body) {
                    if (typeof body === 'string') {
                        requestBody = body; // Plain text or JSON string
                    } else if (Array.isArray(body)) {
                        requestBody = body; // Already in multipart array format
                        if (!finalHeaders['Content-Type']) {
                            finalHeaders['Content-Type'] = 'multipart/form-data';
                        }
                    } else if (typeof body === 'object') {
                        requestBody = JSON.stringify(body); // Convert JSON object to string
                        if (!finalHeaders['Content-Type']) {
                            finalHeaders['Content-Type'] = 'application/json';
                        }
                    }
                }

                // Configure download – always save directly to DocumentDir
                const config = {
                    fileCache: true,
                    path: finalFilePath, // Save directly to app's internal storage
                };

                if (!fileUrl.includes('http')) {
                    throw new Error('Invalid URL');
                }

                // Perform the request with method, body, and headers
                const res = await ReactNativeBlobUtil.config(config).fetch(method, fileUrl, finalHeaders, requestBody);

                // For POST on Android, if Download Manager was not used, the file is already at finalFilePath
                // (because config.path was set). No extra move needed.
                // Optionally ensure media scan if desired (not required for viewing)
                console.log('res.path()', res.path(), res);
                navigation.push('PDFView', { fileUrl: res.path(), type: type, _id: itemId });
                console.log('Downloaded file at:', finalFilePath);
            } catch (error) {
                console.error('File Download Error:', error);
                Alert.alert('Error', 'Failed to view the file.');
                return;
            }
        }
    } catch (error) {
        console.error('File Opening Error:', error);
        Alert.alert('Error', 'Failed to open the file.');
    }
};

const deleteFile = async (id: string, filePath: string, queryKey: string) => {
    const url = `${BASE_URL}/hru/Patientappapi/deletepatienthealthfile`;
    const data: DeletefileParams = {
        healthFileId: id,
        filePath: filePath,
    };

    try {
        const res = await postData(url, data);

        if (res.status) {
            Toast.show('File deleted successfully.', Toast.LONG);
            queryClient.invalidateQueries({
                queryKey: [queryKey],
            });
        }

        if (res.status === false) {
            Toast.show('Failed to delete the file.', Toast.LONG);
        }
    } catch (error) {
        console.log(error);
        Toast.show('Failed to delete the file.', Toast.LONG);
    }
};

export { downloadFile, viewFile, deleteFile };
