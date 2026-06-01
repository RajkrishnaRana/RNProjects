// import { StyleSheet, Text, View, Alert, Dimensions, PermissionsAndroid, Platform } from 'react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { Camera, runAsync, useCameraDevice, useFrameProcessor, PhotoFile, TakePhotoOptions } from 'react-native-vision-camera';
// import { Face, useFaceDetector, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
// import { Worklets } from 'react-native-worklets-core';
// import ReactNativeBlobUtil from 'react-native-blob-util';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// type CaptureState = 'waiting' | 'face_detected' | 'perfect_distance' | 'capturing' | 'captured';

// export default function FaceDetectionAndCaptureScreen() {
//     const [captureState, setCaptureState] = useState<CaptureState>('waiting');
//     const [distanceStatus, setDistanceStatus] = useState<string>('');
//     const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
//     const [countdown, setCountdown] = useState<number>(0);
//     const [detectedFaces, setDetectedFaces] = useState<Face[]>([]);

//     const cameraRef = useRef<Camera>(null);
//     const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

//     const faceDetectionOptions = useRef<FaceDetectionOptions>({
//         performanceMode: 'accurate',
//         landmarkMode: 'none',
//         contourMode: 'none',
//         classificationMode: 'none',
//     }).current;

//     /* ---------- camera setup ---------- */
//     const device = useCameraDevice('front');
//     const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

//     /* ---------- distance calculation based on face size ---------- */
//     // const calculateDistance = (face: Face): { distance: string; isOptimal: boolean; instruction: string } => {
//     //     const faceWidth = face.bounds.width;
//     //     const faceHeight = face.bounds.height;
//     //     const faceArea = faceWidth * faceHeight;

//     //     // Adjusted distance ranges - increased close range and very far range
//     //     const optimalMinArea = screenWidth * screenHeight * 0.05; // 5% of screen
//     //     const optimalMaxArea = screenWidth * screenHeight * 0.35; // 35% of screen

//     //     // Calculate relative distance categories with extended ranges
//     //     if (faceArea < optimalMinArea * 0.2) {
//     //         return {
//     //             distance: 'Very Far',
//     //             isOptimal: false,
//     //             instruction: 'Move much closer to the camera',
//     //         };
//     //     } else if (faceArea < optimalMinArea) {
//     //         return {
//     //             distance: 'Far',
//     //             isOptimal: false,
//     //             instruction: 'Move closer',
//     //         };
//     //     } else if (faceArea >= optimalMinArea && faceArea <= optimalMaxArea) {
//     //         return {
//     //             distance: 'Perfect',
//     //             isOptimal: true,
//     //             instruction: 'Perfect distance! Hold still',
//     //         };
//     //     } else if (faceArea <= optimalMaxArea * 1.8) {
//     //         return {
//     //             distance: 'Close',
//     //             isOptimal: false,
//     //             instruction: 'Move back a little',
//     //         };
//     //     } else {
//     //         return {
//     //             distance: 'Too Close',
//     //             isOptimal: false,
//     //             instruction: 'Move back from the camera',
//     //         };
//     //     }
//     // };
//     const calculateDistance = (face: Face): { distance: string; isOptimal: boolean; instruction: string } => {
//         const { width: faceWidth, height: faceHeight, x, y } = face.bounds;
//         const faceArea = faceWidth * faceHeight;
//         const screenArea = screenWidth * screenHeight;

//         // Restrict thresholds: only allow 2% - 10% of screen area
//         const minArea = screenArea * 0.1; // 2%
//         const maxArea = screenArea * 0.5; // 2%

//         // ✅ Check full visibility
//         const fullyVisible = x >= 0 && y >= 0 && x + faceWidth <= screenWidth && y + faceHeight <= screenHeight;

//         if (!fullyVisible) {
//             return {
//                 distance: 'Not Fully Visible',
//                 isOptimal: false,
//                 instruction: 'Keep your full face inside the frame',
//             };
//         }

//         if (faceArea < minArea) {
//             return {
//                 distance: 'Too Far',
//                 isOptimal: false,
//                 instruction: 'Move closer to the camera',
//             };
//         } else if (faceArea > maxArea) {
//             return {
//                 distance: 'Too Close',
//                 isOptimal: false,
//                 instruction: 'Move farther away from the camera',
//             };
//         } else {
//             return {
//                 distance: 'Perfect',
//                 isOptimal: true,
//                 instruction: 'Perfect distance! Hold still',
//             };
//         }
//     };

//     /* ---------- request storage permissions ---------- */
//     const requestStoragePermission = async (): Promise<boolean> => {
//         if (Platform.OS === 'android') {
//             try {
//                 const androidVersion = Platform.Version;

//                 // For Android 11+ (API 30+), use different permissions
//                 if (androidVersion >= 30) {
//                     const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]);
//                     return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
//                 } else {
//                     const granted = await PermissionsAndroid.requestMultiple([
//                         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//                     ]);
//                     return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
//                 }
//             } catch (err) {
//                 console.warn('Permission request error:', err);
//                 return false;
//             }
//         }
//         return true; // iOS doesn't need explicit storage permission for documents
//     };

//     /* ---------- save photo to downloads/documents folder ---------- */
//     const savePhotoToStorage = async (photoPath: string): Promise<string | null> => {
//         try {
//             console.log('Starting to save photo from:', photoPath);

//             // Request storage permissions first
//             const hasPermission = await requestStoragePermission();
//             if (!hasPermission) {
//                 console.log('Storage permission denied');
//                 Alert.alert('Permission Required', 'Storage permission is required to save photos');
//                 return null;
//             }

//             // Generate unique filename
//             const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//             const fileName = `face_capture_${timestamp}.jpg`;

//             let destinationPath: string;

//             if (Platform.OS === 'android') {
//                 // Use external storage directory for Android
//                 destinationPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

//                 // Alternative: try Pictures directory if Downloads fails
//                 const alternativePath = `${ReactNativeBlobUtil.fs.dirs.PictureDir}/${fileName}`;

//                 try {
//                     // Check if source file exists
//                     const exists = await ReactNativeBlobUtil.fs.exists(photoPath);
//                     if (!exists) {
//                         console.error('Source photo file does not exist:', photoPath);
//                         return null;
//                     }

//                     // Copy file to Downloads
//                     await ReactNativeBlobUtil.fs.cp(photoPath, destinationPath);
//                     console.log('Photo saved to Downloads:', destinationPath);
//                 } catch (downloadError) {
//                     console.log('Failed to save to Downloads, trying Pictures folder:', downloadError);
//                     try {
//                         await ReactNativeBlobUtil.fs.cp(photoPath, alternativePath);
//                         destinationPath = alternativePath;
//                         console.log('Photo saved to Pictures:', destinationPath);
//                     } catch (pictureError) {
//                         console.error('Failed to save to Pictures folder:', pictureError);
//                         return null;
//                     }
//                 }
//             } else {
//                 // iOS - use Documents directory
//                 destinationPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
//                 await ReactNativeBlobUtil.fs.cp(photoPath, destinationPath);
//                 console.log('Photo saved to Documents (iOS):', destinationPath);
//             }

//             // Verify the file was copied successfully
//             const savedExists = await ReactNativeBlobUtil.fs.exists(destinationPath);
//             if (!savedExists) {
//                 console.error('File was not saved successfully');
//                 return null;
//             }

//             return destinationPath;
//         } catch (error: any) {
//             console.error('Error saving photo:', error);
//             Alert.alert('Save Error', `Failed to save photo: ${error.message || error}`);
//             return null;
//         }
//     };

//     /* ---------- photo capture logic ---------- */
//     const capturePhoto = async () => {
//         if (!cameraRef.current || captureState === 'capturing' || captureState === 'captured') {
//             return;
//         }

//         try {
//             setCaptureState('capturing');
//             console.log('Starting photo capture...');

//             // Lowest quality settings for compression
//             const photoOptions: TakePhotoOptions = {
//                 // quality: 0.1, // Lowest quality (10%)
//                 flash: 'off',
//                 enableShutterSound: false, // Disable shutter sound
//             };

//             const photo = await cameraRef.current.takePhoto(photoOptions);
//             console.log('Photo captured successfully:', photo.path);

//             // Save photo to downloads/documents folder
//             const savedPath = await savePhotoToStorage(photo.path);

//             setCapturedPhoto(photo);
//             setCaptureState('captured');

//             const displayPath = savedPath || photo.path;
//             console.log('Final photo location:', displayPath);

//             Alert.alert(
//                 'Photo Captured!',
//                 savedPath
//                     ? `Photo saved to Downloads/Pictures folder:\n${savedPath}`
//                     : `Photo captured but save failed. Temporary location:\n${photo.path}`,
//                 [
//                     {
//                         text: 'Take Another',
//                         onPress: resetCapture,
//                     },
//                     {
//                         text: 'OK',
//                         style: 'default',
//                     },
//                 ],
//             );
//         } catch (error: any) {
//             console.error('Failed to capture photo:', error);

//             // Handle specific camera errors
//             if (error.message?.includes('camera-is-restricted') || error.message?.includes('restricted')) {
//                 Alert.alert(
//                     'Camera Restricted',
//                     'Camera access is restricted by device policy. Please check your device settings or contact your administrator.',
//                     [{ text: 'OK', onPress: () => setCaptureState('waiting') }],
//                 );
//             } else if (error.message?.includes('session/camera-not-ready')) {
//                 Alert.alert('Camera Error', 'Camera is not ready. Please try again.');
//                 setCaptureState('waiting');
//             } else {
//                 Alert.alert('Error', `Failed to capture photo: ${error.message || 'Unknown error'}`);
//                 setCaptureState('waiting');
//             }
//         }
//     };

//     /* ---------- reset capture process ---------- */
//     const resetCapture = () => {
//         setCaptureState('waiting');
//         setCapturedPhoto(null);
//         setDistanceStatus('');
//         setCountdown(0);

//         if (captureTimeoutRef.current) {
//             clearTimeout(captureTimeoutRef.current);
//             captureTimeoutRef.current = null;
//         }

//         if (countdownIntervalRef.current) {
//             clearInterval(countdownIntervalRef.current);
//             countdownIntervalRef.current = null;
//         }
//     };

//     /* ---------- start countdown for capture ---------- */
//     const startCaptureCountdown = () => {
//         if (captureTimeoutRef.current) {
//             clearTimeout(captureTimeoutRef.current);
//         }
//         if (countdownIntervalRef.current) {
//             clearInterval(countdownIntervalRef.current);
//         }

//         setCountdown(2); // 2 seconds countdown
//         setCaptureState('perfect_distance');

//         countdownIntervalRef.current = setInterval(() => {
//             setCountdown(prev => {
//                 if (prev <= 1) {
//                     if (countdownIntervalRef.current) {
//                         clearInterval(countdownIntervalRef.current);
//                     }
//                     capturePhoto();
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//     };

//     /* ---------- face detection and distance analysis ---------- */
//     const analyzeFaceDistance = Worklets.createRunOnJS((faces: Face[]) => {
//         if (captureState === 'capturing' || captureState === 'captured') {
//             return;
//         }

//         if (!faces.length) {
//             setCaptureState('waiting');
//             setDistanceStatus('No face detected');
//             setCountdown(0);

//             // Clear timers
//             if (captureTimeoutRef.current) {
//                 clearTimeout(captureTimeoutRef.current);
//                 captureTimeoutRef.current = null;
//             }
//             if (countdownIntervalRef.current) {
//                 clearInterval(countdownIntervalRef.current);
//                 countdownIntervalRef.current = null;
//             }
//             return;
//         }

//         // ✅ Restrict if more than 1 face detected
//         if (faces.length > 1) {
//             setCaptureState('waiting');
//             setDistanceStatus('Multiple faces detected — please ensure only one person is visible');
//             setCountdown(0);

//             // Stop any countdown if running
//             if (captureTimeoutRef.current) {
//                 clearTimeout(captureTimeoutRef.current);
//                 captureTimeoutRef.current = null;
//             }
//             if (countdownIntervalRef.current) {
//                 clearInterval(countdownIntervalRef.current);
//                 countdownIntervalRef.current = null;
//             }
//             return;
//         }

//         // Continue with single face
//         const face = faces[0];
//         const { distance, isOptimal, instruction } = calculateDistance(face);

//         setCaptureState('face_detected');
//         setDistanceStatus(`Distance: ${distance} - ${instruction}`);

//         if (isOptimal) {
//             if (captureState !== 'perfect_distance' && countdown === 0) {
//                 startCaptureCountdown();
//             }
//         } else {
//             // Cancel pending capture if not optimal
//             if (captureTimeoutRef.current) {
//                 clearTimeout(captureTimeoutRef.current);
//                 captureTimeoutRef.current = null;
//             }
//             if (countdownIntervalRef.current) {
//                 clearInterval(countdownIntervalRef.current);
//                 countdownIntervalRef.current = null;
//             }
//             setCountdown(0);
//         }
//     });

//     /* ---------- effects ---------- */
//     useEffect(() => {
//         return () => {
//             stopListeners();
//             if (captureTimeoutRef.current) {
//                 clearTimeout(captureTimeoutRef.current);
//             }
//             if (countdownIntervalRef.current) {
//                 clearInterval(countdownIntervalRef.current);
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (!device) {
//             stopListeners();
//             return;
//         }

//         (async () => {
//             try {
//                 console.log('Requesting camera permission...');
//                 const cameraStatus = await Camera.requestCameraPermission();
//                 console.log('Camera permission status:', cameraStatus);

//                 if (cameraStatus === 'denied') {
//                     Alert.alert(
//                         'Camera Permission Required',
//                         'This app needs camera permission to capture photos. Please enable camera access in your device settings.',
//                         [{ text: 'OK' }],
//                     );
//                     return;
//                 }

//                 // Also request storage permissions on component mount
//                 console.log('Requesting storage permission...');
//                 const storagePermission = await requestStoragePermission();
//                 console.log('Storage permission granted:', storagePermission);
//             } catch (error) {
//                 console.error('Permission error:', error);
//                 Alert.alert('Permission Error', 'Failed to request permissions');
//             }
//         })();
//     }, [device]);

//     /* ---------- frame processor ---------- */
//     const frameProcessor = useFrameProcessor(
//         frame => {
//             'worklet';
//             const faces = detectFaces(frame);
//             analyzeFaceDistance(faces);
//         },
//         [analyzeFaceDistance],
//     );

//     /* ---------- UI helpers ---------- */
//     const getStatusColor = (): string => {
//         switch (captureState) {
//             case 'perfect_distance':
//                 return '#4CAF50';
//             case 'face_detected':
//                 return '#FF9800';
//             case 'capturing':
//                 return '#2196F3';
//             case 'captured':
//                 return '#9C27B0';
//             default:
//                 return '#9E9E9E';
//         }
//     };

//     const getStatusText = (): string => {
//         if (captureState === 'captured') return 'Photo captured successfully!';
//         if (captureState === 'capturing') return 'Capturing photo...';
//         if (countdown > 0) return `Capturing in ${countdown}...`;
//         return distanceStatus || 'Position your face in the camera';
//     };

//     return (
//         <View style={styles.container}>
//             {!!device ? (
//                 <>
//                     <Camera
//                         ref={cameraRef}
//                         style={StyleSheet.absoluteFill}
//                         device={device}
//                         isActive={captureState !== 'captured'}
//                         frameProcessor={frameProcessor}
//                         photo={true}
//                     />

//                     {/* Face bounding boxes */}
//                     {detectedFaces.map((face, index) => {
//                         const { x, y, width, height } = face.bounds;
//                         return (
//                             <View
//                                 key={index}
//                                 style={{
//                                     position: 'absolute',
//                                     left: x,
//                                     top: y,
//                                     width,
//                                     height,
//                                     borderWidth: 3,
//                                     borderColor: detectedFaces.length > 1 ? 'red' : 'lime',
//                                     borderRadius: 8,
//                                     backgroundColor: 'transparent',
//                                 }}
//                             />
//                         );
//                     })}

//                     {/* Overlay UI */}
//                     <View style={styles.overlay}>
//                         {/* Status display */}
//                         <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
//                             <Text style={styles.statusText}>{getStatusText()}</Text>
//                         </View>

//                         {/* Face guide frame */}
//                         {/* <View style={styles.faceGuide}>
//                             <View style={styles.faceFrame} />
//                         </View> */}

//                         {/* Countdown display */}
//                         {countdown > 0 && (
//                             <View style={styles.countdownContainer}>
//                                 <Text style={styles.countdownText}>{countdown}</Text>
//                             </View>
//                         )}

//                         {/* Reset button */}
//                         {captureState === 'captured' && (
//                             <View style={styles.buttonContainer}>
//                                 <Text style={styles.resetButton} onPress={resetCapture}>
//                                     Take Another Photo
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                 </>
//             ) : (
//                 <View style={styles.noDeviceContainer}>
//                     <Text style={styles.noDeviceText}>No Camera Device Available</Text>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     overlay: {
//         flex: 1,
//         justifyContent: 'space-between',
//         padding: 20,
//     },
//     statusContainer: {
//         marginTop: 50,
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//         borderRadius: 25,
//         alignSelf: 'center',
//         backgroundColor: 'rgba(0,0,0,0.7)',
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     faceGuide: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     faceFrame: {
//         width: 200,
//         height: 250,
//         borderWidth: 3,
//         borderColor: 'rgba(255,255,255,0.5)',
//         borderRadius: 125,
//         backgroundColor: 'transparent',
//     },
//     countdownContainer: {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: [{ translateX: -50 }, { translateY: -50 }],
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     countdownText: {
//         color: 'white',
//         fontSize: 48,
//         fontWeight: 'bold',
//     },
//     buttonContainer: {
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     resetButton: {
//         backgroundColor: '#2196F3',
//         color: 'white',
//         paddingHorizontal: 30,
//         paddingVertical: 15,
//         borderRadius: 25,
//         fontSize: 16,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         overflow: 'hidden',
//     },
//     noDeviceContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#000',
//     },
//     noDeviceText: {
//         color: 'white',
//         fontSize: 18,
//         textAlign: 'center',
//     },
// });

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Button, View, useWindowDimensions } from 'react-native';
import { CameraPosition, DrawableFrame, Frame, Camera as VisionCamera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Face, Camera, Contours, Landmarks, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { ClipOp, Skia, TileMode } from '@shopify/react-native-skia';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

/**
 * Entry point component
 *
 * @return {ReactNode} Component
 */
function Index(): ReactNode {
    return (
        <SafeAreaProvider>
            <FaceDetection />
        </SafeAreaProvider>
    );
}

/**
 * Face detection component
 *
 * @return {ReactNode} Component
 */
function FaceDetection(): ReactNode {
    const { width, height } = useWindowDimensions();
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraMounted, setCameraMounted] = useState<boolean>(false);
    const [cameraPaused, setCameraPaused] = useState<boolean>(false);
    const [cameraFacing, setCameraFacing] = useState<CameraPosition>('front');
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        performanceMode: 'fast',
        classificationMode: 'all',
        contourMode: 'all',
        landmarkMode: 'all',
        windowWidth: width,
        windowHeight: height,
    }).current;
    const isFocused = useIsFocused();
    //   const appState = useAppState()
    const isCameraActive = !cameraPaused && isFocused;
    const cameraDevice = useCameraDevice(cameraFacing);
    //
    // vision camera ref
    //
    const camera = useRef<VisionCamera>(null);
    //
    // face rectangle position
    //
    const aFaceW = useSharedValue(0);
    const aFaceH = useSharedValue(0);
    const aFaceX = useSharedValue(0);
    const aFaceY = useSharedValue(0);
    const aRot = useSharedValue(0);
    const boundingBoxStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        borderWidth: 4,
        borderLeftColor: 'rgb(0,255,0)',
        borderRightColor: 'rgb(0,255,0)',
        borderBottomColor: 'rgb(0,255,0)',
        borderTopColor: 'rgb(255,0,0)',
        width: withTiming(aFaceW.value, {
            duration: 100,
        }),
        height: withTiming(aFaceH.value, {
            duration: 100,
        }),
        left: withTiming(aFaceX.value, {
            duration: 100,
        }),
        top: withTiming(aFaceY.value, {
            duration: 100,
        }),
        transform: [
            {
                rotate: `${aRot.value}deg`,
            },
        ],
    }));

    useEffect(() => {
        if (hasPermission) return;
        requestPermission();
    }, []);

    /**
     * Handle camera UI rotation
     *
     * @param {number} rotation Camera rotation
     */
    function handleUiRotation(rotation: number) {
        aRot.value = rotation;
    }

    /**
     * Hanldes camera mount error event
     *
     * @param {any} error Error event
     */
    function handleCameraMountError(error: any) {
        console.error('camera mount error', error);
    }

    /**
     * Handle detection result
     *
     * @param {Face[]} faces Detection result
     * @param {Frame} frame Current frame
     * @returns {void}
     */
    function handleFacesDetected(faces: Face[], frame: Frame): void {
        // if no faces are detected we do nothing
        if (faces.length <= 0) {
            aFaceW.value = 0;
            aFaceH.value = 0;
            aFaceX.value = 0;
            aFaceY.value = 0;
            return;
        }

        console.log('faces', faces.length, 'frame', frame.toString(), 'faces', JSON.stringify(faces));

        const { bounds } = faces[0];
        const { width, height, x, y } = bounds;
        aFaceW.value = width;
        aFaceH.value = height;
        aFaceX.value = x;
        aFaceY.value = y;

        // only call camera methods if ref is defined
        if (camera.current) {
            // take photo, capture video, etc...
        }
    }

    /**
     * Handle skia frame actions
     *
     * @param {Face[]} faces Detection result
     * @param {DrawableFrame} frame Current frame
     * @returns {void}
     */
    function handleSkiaActions(faces: Face[], frame: DrawableFrame): void {
        'worklet';
        // if no faces are detected we do nothing
        if (faces.length <= 0) return;

        console.log('SKIA - faces', faces.length, 'frame', frame.toString());

        const { bounds, contours, landmarks } = faces[0];

        // draw a blur shape around the face points
        const blurRadius = 25;
        const blurFilter = Skia.ImageFilter.MakeBlur(blurRadius, blurRadius, TileMode.Repeat, null);
        const blurPaint = Skia.Paint();
        blurPaint.setImageFilter(blurFilter);
        const contourPath = Skia.Path.Make();
        const necessaryContours: (keyof Contours)[] = ['FACE', 'LEFT_CHEEK', 'RIGHT_CHEEK'];

        necessaryContours.map(key => {
            contours?.[key]?.map((point, index) => {
                if (index === 0) {
                    // it's a starting point
                    contourPath.moveTo(point.x, point.y);
                } else {
                    // it's a continuation
                    contourPath.lineTo(point.x, point.y);
                }
            });
            contourPath.close();
        });

        frame.save();
        frame.clipPath(contourPath, ClipOp.Intersect, true);
        frame.render(blurPaint);
        frame.restore();

        // draw mouth shape
        const mouthPath = Skia.Path.Make();
        const mouthPaint = Skia.Paint();
        mouthPaint.setColor(Skia.Color('red'));
        const necessaryLandmarks: (keyof Landmarks)[] = ['MOUTH_BOTTOM', 'MOUTH_LEFT', 'MOUTH_RIGHT'];

        necessaryLandmarks.map((key, index) => {
            const point = landmarks?.[key];
            if (!point) return;

            if (index === 0) {
                // it's a starting point
                mouthPath.moveTo(point.x, point.y);
            } else {
                // it's a continuation
                mouthPath.lineTo(point.x, point.y);
            }
        });
        mouthPath.close();
        frame.drawPath(mouthPath, mouthPaint);

        // draw a rectangle around the face
        const rectPaint = Skia.Paint();
        rectPaint.setColor(Skia.Color('blue'));
        rectPaint.setStyle(1);
        rectPaint.setStrokeWidth(5);
        frame.drawRect(bounds, rectPaint);
    }

    return (
        <>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                {hasPermission && cameraDevice ? (
                    <>
                        {cameraMounted && (
                            <>
                                <Camera
                                    // @ts-ignore
                                    ref={camera}
                                    style={StyleSheet.absoluteFill}
                                    isActive={isCameraActive}
                                    device={cameraDevice}
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

                                {cameraPaused && (
                                    <Text
                                        style={{
                                            width: '100%',
                                            backgroundColor: 'rgb(0,0,255)',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        Camera is PAUSED
                                    </Text>
                                )}
                            </>
                        )}

                        {!cameraMounted && (
                            <Text
                                style={{
                                    width: '100%',
                                    backgroundColor: 'rgb(255,255,0)',
                                    textAlign: 'center',
                                }}
                            >
                                Camera is NOT mounted
                            </Text>
                        )}
                    </>
                ) : (
                    <Text
                        style={{
                            width: '100%',
                            backgroundColor: 'rgb(255,0,0)',
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        No camera device or permission
                    </Text>
                )}
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                ></View>

                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <Button onPress={() => setCameraFacing(current => (current === 'front' ? 'back' : 'front'))} title={'Toggle Cam'} />

                    {/* <Button onPress={() => setAutoMode(current => !current)} title={`${autoMode ? 'Disable' : 'Enable'} AutoMode`} /> */}
                </View>
                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <Button onPress={() => setCameraPaused(current => !current)} title={`${cameraPaused ? 'Resume' : 'Pause'} Cam`} />

                    <Button onPress={() => setCameraMounted(current => !current)} title={`${cameraMounted ? 'Unmount' : 'Mount'} Cam`} />
                </View>
            </View>
        </>
    );
}

export default Index;
