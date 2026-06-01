import {
    CameraPosition,
    DrawableFrame,
    useCameraDevice,
    useCameraFormat,
    useCameraPermission,
    Camera as VisionCamera,
} from 'react-native-vision-camera';
import { Face, Contours, Landmarks, FrameFaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { ClipOp, Skia, TileMode } from '@shopify/react-native-skia';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import { useAppDispatch } from '../typedReduxHooks';
import { setFirstImg, setImage, setNonPluckingImg, setPluckingImg } from '../../store/slices/captureImgSlice';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const MIN_VISIBILITY = 0.75;
const EYE_CLOSED = 0.3;
const EYE_OPEN = 0.7;
const SMILE_THRESHOLD = 0.75;

export const useFaceDetection = (navigation: any, blinkingEnabled: boolean, smileDetectionEnabled: boolean, routeName: string | undefined) => {
    const { width, height } = useWindowDimensions();
    const dispatch = useAppDispatch();

    // 3:4 square size — use this for all face detection coordinate calculations
    const squareSize = Math.min(width, height);
    const previewWidth = width;
    const previewHeight = (width * 4) / 3;

    // LOCAL STATES --------------------------->
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraFacing, setCameraFacing] = useState<CameraPosition>('back');
    const [torch, setTorch] = useState<'off' | 'on'>('off');
    const [message, setMessage] = useState('');
    const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
        performanceMode: 'fast',
        classificationMode: 'all',
        contourMode: 'all',
        landmarkMode: 'all',
        windowWidth: previewWidth,
        windowHeight: previewHeight,
    }).current;
    const isFocused = useIsFocused();
    const cameraDevice = useCameraDevice(cameraFacing);
    const camera = useRef<VisionCamera>(null);
    const format = useCameraFormat(cameraDevice, [
        { videoAspectRatio: 4 / 3 },
        { videoResolution: { width: 640, height: 480 } }, // ← prefer 3:4
        { fps: 30 },
        { videoStabilizationMode: 'auto' },
        { autoFocusSystem: 'contrast-detection' }, // better in low light
    ]);
    /* 1.  session id once per camera open ---------------- */
    // const sessionId = useRef(Date.now()).current; // stays constant

    // Boundary ref to prevent to times navigation.goBack()
    const isCapturingRef = useRef(false);

    // First capture ref
    const firstCaptureRef = useRef(true);

    // countdown timer
    const countDown = useRef<NodeJS.Timeout | null>(null);
    const remainingSec = useRef(3);

    // blink state and refs
    const blinkCount = useRef(0);
    const wasLeftEyeClosed = useRef(false); // previous frame state
    const faceLostRef = useRef(true); // start as “lost” so first detection resets

    // Smile detection refs
    const hasSmiledRef = useRef(false);
    const smiledThisSession = useRef(false); // per face-session

    // face rectangle position
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

    // function pairedName(suffix: 'A' | 'B') {
    //     return `PAIR_${sessionId}_${suffix}.jpg`;
    // }

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

    // Capture image after timer
    // Enhanced validation with stricter face area coverage check
    function fullFaceVisible(face: Face, previewW: number, previewH: number): boolean {
        const { bounds } = face;

        // 1. Check if face bounds are substantially within preview
        const faceLeft = bounds.x;
        const faceRight = bounds.x + bounds.width;
        const faceTop = bounds.y;
        const faceBottom = bounds.y + bounds.height;

        // Face must be at least 90% inside the preview
        const horizontalMargin = bounds.width * 0.1;
        const verticalMargin = bounds.height * 0.1;

        const faceFullyInFrame =
            faceLeft >= -horizontalMargin &&
            faceRight <= previewW + horizontalMargin &&
            faceTop >= -verticalMargin &&
            faceBottom <= previewH + verticalMargin;

        if (!faceFullyInFrame) {
            return false;
        }

        // 2. Check BOTH eye landmarks exist
        const leftEye = face.landmarks?.LEFT_EYE;
        const rightEye = face.landmarks?.RIGHT_EYE;

        if (!leftEye || !rightEye) {
            console.log('Missing eye landmarks');
            return false;
        }

        // 3. Check eye probabilities (if available)
        const leftProb = face.leftEyeOpenProbability;
        const rightProb = face.rightEyeOpenProbability;

        if (leftProb !== undefined && rightProb !== undefined) {
            // If probabilities are available, use them
            if (leftProb < MIN_VISIBILITY || rightProb < MIN_VISIBILITY) {
                console.log('Eye visibility too low:', leftProb, rightProb);
                return false;
            }
        }

        // 4. Check nose and mouth landmarks (critical for full face)
        const noseBase = face.landmarks?.NOSE_BASE;
        const mouthLeft = face.landmarks?.MOUTH_LEFT;
        const mouthRight = face.landmarks?.MOUTH_RIGHT;
        const mouthBottom = face.landmarks?.MOUTH_BOTTOM;

        if (!noseBase || !mouthLeft || !mouthRight || !mouthBottom) {
            console.log('Missing nose/mouth landmarks');
            return false;
        }

        // 5. Verify critical landmarks are within bounds
        const landmarksToCheck = [leftEye, rightEye, noseBase, mouthLeft, mouthRight, mouthBottom];

        for (const landmark of landmarksToCheck) {
            if (landmark.x < 0 || landmark.x > previewW || landmark.y < 0 || landmark.y > previewH) {
                console.log('Landmark out of bounds:', landmark);
                return false;
            }
        }

        // 6. Check face coverage - ensure eyes are reasonably spaced (not edge case)
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const minEyeDistance = bounds.width * 0.2; // Eyes should be at least 20% of face width apart

        if (eyeDistance < minEyeDistance) {
            console.log('Eyes too close - possible side profile:', eyeDistance);
            return false;
        }

        return true;
    }

    async function captureNow() {
        if (!camera.current) return;
        if (isCapturingRef.current) return; // ← GUARD: prevent double capture
        isCapturingRef.current = true; // ← LOCK immediately

        try {
            const photo = await camera.current.takeSnapshot({
                quality: 85,
            });

            const resized = await ImageResizer.createResizedImage(
                photo.path,
                480, // width  — 3:4 → 480×640
                640, // height
                'JPEG', // JPEG compresses much better than WEBP for photos
                35, // quality 30–40 hits ~25–35kb range
                0, // no rotation
                undefined, // outputPath — let library handle temp path
                false, // keepMeta — false strips EXIF, saves extra kb
                { mode: 'cover', onlyScaleDown: true },
            );

            // Read b64 from resized file, NOT original
            const b64 = await RNBlobUtil.fs.readFile(resized.path, 'base64');
            const dataUri = `data:image/jpeg;base64,${b64}`;

            // Save images based on screen
            if (routeName === 'Plucking In Time') {
                dispatch(setImage({ base64: dataUri, photoPath: resized.path }));

                // For showing the image purpose
                // await RNBlobUtil.MediaCollection.copyToMediaStore(
                //     {
                //         name: `photo_${Date.now()}.jpg`,
                //         parentFolder: 'MyAppImages',
                //         mimeType: 'image/jpeg',
                //     },
                //     'Image',
                //     resized.path,
                // );
            } else if (routeName === 'Record Non Plucking') {
                dispatch(setNonPluckingImg({ image: { base64: dataUri, photoPath: resized.path } }));
            } else if (routeName === 'Bluetooth') {
                dispatch(setPluckingImg({ image: { base64: dataUri, photoPath: resized.path } }));
            }
        } catch (e) {
            console.log('capture error', e);
            isCapturingRef.current = false; // ← unlock on error so user can retry
        } finally {
            navigation.goBack('Plucking In Time');
        }
    }

    function clearCountdown() {
        if (countDown.current) clearInterval(countDown.current);
        countDown.current = null;
        remainingSec.current = 3;
        setMessage('');
    }

    function startCountdown() {
        if (countDown.current) return; // already running
        remainingSec.current = 0;
        setMessage('Hold still…');

        countDown.current = setInterval(() => {
            remainingSec.current -= 1;
            if (remainingSec.current > 0) {
                setMessage(`Hold still… ${remainingSec.current}`);
            } else {
                clearCountdown();
                captureNow(); // time’s up → shoot
            }
        }, 200);
    }

    // Blink detection
    function updateBlinkMessage(count: number, smiled = false) {
        if (smiled) {
            setMessage('Great! Hold still…');
            return;
        }
        if (count >= 1 && !smiled) {
            setMessage('Blinks: 1/1 ✔  Now Smile 🙂');
            return;
        }
        setMessage(`Blinks: ${count}/2`);
    }
    function checkBlink(leftProb: number) {
        if (!wasLeftEyeClosed.current && leftProb < EYE_CLOSED) {
            wasLeftEyeClosed.current = true;
        } else if (wasLeftEyeClosed.current && leftProb > EYE_OPEN) {
            wasLeftEyeClosed.current = false;
            blinkCount.current += 1;
            updateBlinkMessage(blinkCount.current); // <-- update text
        }
    }

    /**
     * Handle detection result
     *
     * @param {Face[]} faces Detection result
     * @param {Frame} frame Current frame
     * @returns {void}
     */
    async function handleFacesDetected(faces: Face[]) {
        // First capture (initial snapshot)
        if (camera.current && firstCaptureRef.current) {
            try {
                const photo = await camera.current.takeSnapshot({ quality: 85 });

                const resized = await ImageResizer.createResizedImage(
                    photo.path,
                    480, // width  — 3:4 → 480×640
                    640, // height
                    'JPEG', // JPEG compresses much better than WEBP for photos
                    35, // quality 30–40 hits ~25–35kb range
                    0, // no rotation
                    undefined, // outputPath — let library handle temp path
                    false, // keepMeta — false strips EXIF, saves extra kb
                    { mode: 'cover', onlyScaleDown: true },
                );

                // Read b64 from resized file, NOT original
                const b64 = await RNBlobUtil.fs.readFile(resized.path, 'base64');
                const dataUri = `data:image/jpeg;base64,${b64}`;

                // Save images based on screen
                if (routeName === 'Plucking In Time') {
                    dispatch(setFirstImg({ base64: dataUri, photoPath: resized.path }));
                } else if (routeName === 'Record Non Plucking') {
                    dispatch(setNonPluckingImg({ firstImg: { base64: dataUri, photoPath: resized.path } }));
                } else if (routeName === 'Bluetooth') {
                    dispatch(setPluckingImg({ firstImg: { base64: dataUri, photoPath: resized.path } }));
                }
                firstCaptureRef.current = false;
            } catch (e) {
                console.log('First capture error:', e);
            }
        }

        // No faces detected
        if (faces.length <= 0) {
            aFaceW.value = 0;
            aFaceH.value = 0;
            aFaceX.value = 0;
            aFaceY.value = 0;

            if (!faceLostRef.current) {
                faceLostRef.current = true;
                blinkCount.current = 0;
                wasLeftEyeClosed.current = false;
                smiledThisSession.current = false;
                hasSmiledRef.current = false;
                isCapturingRef.current = false; // ← reset so retry works after error
                clearCountdown();
                setMessage('No face detected');
            }
            return;
        }

        // Multiple faces detected
        if (faces.length > 1) {
            blinkCount.current = 0;
            wasLeftEyeClosed.current = false;
            smiledThisSession.current = false;
            hasSmiledRef.current = false;
            clearCountdown();
            // setMessage('Multiple faces detected. Only one person should be in the frame.');
            return;
        }

        // Single face detected - update bounding box
        const face = faces[0];
        const { bounds, leftEyeOpenProbability = 1, smilingProbability = 0 } = face;

        aFaceW.value = bounds.width;
        aFaceH.value = bounds.height;
        aFaceX.value = bounds.x;
        aFaceY.value = bounds.y;

        // ⚠️ SINGLE VALIDATION POINT - Check if full face is visible
        if (!fullFaceVisible(face, previewWidth, previewHeight) && !blinkingEnabled) {
            // Reset states immediately
            blinkCount.current = 0;
            wasLeftEyeClosed.current = false;
            smiledThisSession.current = false;
            faceLostRef.current = true;
            clearCountdown();
            setMessage('Position your full face in frame with both eyes visible');
            return; // ⛔ STOP HERE - no further processing
        }

        // Face is now valid and fully visible
        faceLostRef.current = false;

        // Show initial instructions based on mode
        if (blinkCount.current === 0) {
            if (blinkingEnabled && smileDetectionEnabled) {
                setMessage('Blink twice then smile 🙂');
            } else if (blinkingEnabled) {
                setMessage('Start blinking...');
            } else if (smileDetectionEnabled) {
                setMessage('Now please smile 🙂');
            } else {
                setMessage('Hold still for capture');
            }
        }

        // Process blink detection
        if (blinkingEnabled) {
            checkBlink(leftEyeOpenProbability);
        }

        // Process smile detection
        if (!smiledThisSession.current && smilingProbability > SMILE_THRESHOLD && smileDetectionEnabled) {
            smiledThisSession.current = true;
            updateBlinkMessage(blinkCount.current, true);
        }

        // Final gate - determine if we should start countdown
        let shouldCapture = false;

        if (blinkingEnabled && smileDetectionEnabled) {
            shouldCapture = blinkCount.current >= 2 && smiledThisSession.current;
        } else if (blinkingEnabled && !smileDetectionEnabled) {
            shouldCapture = blinkCount.current >= 1;
        } else if (!blinkingEnabled && smileDetectionEnabled) {
            shouldCapture = smiledThisSession.current;
        } else {
            // Neither enabled - capture immediately
            shouldCapture = true;
        }

        if (shouldCapture && !countDown.current) {
            startCountdown();
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

    useEffect(() => {
        if (hasPermission) return;
        requestPermission();
    }, [hasPermission, requestPermission]);

    return {
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
        torch,
        setTorch,
        format,
        squareSize,
        previewWidth,
        previewHeight,
    };
};
