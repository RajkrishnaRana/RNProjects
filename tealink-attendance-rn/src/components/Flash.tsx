import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, cancelAnimation } from 'react-native-reanimated';

type FlashColor = 'white' | 'black' | string;

interface FlashOverlayProps {
    color?: FlashColor;
    timing: number; // Duration in seconds (how long to keep flashing)
    flashDuration?: number; // Optional: override default 500ms flash (in ms)
    onFlashComplete?: () => void; // Optional: callback when all flashes end
    isAnimationOn: boolean;
}

const FlashOverlay: React.FC<FlashOverlayProps> = ({
    color = 'white',
    timing, // in seconds
    flashDuration = 1000, // default 500ms per flash
    onFlashComplete,
    isAnimationOn,
}) => {
    const flashProgress = useSharedValue(0);
    console.log('flashprops', timing, isAnimationOn);

    useEffect(() => {
        // Only start animation when isAnimationOn is true
        if (!isAnimationOn) {
            // Stop any ongoing animation and reset
            cancelAnimation(flashProgress);
            flashProgress.value = 0;
            return;
        }

        const totalDuration = timing * 1000; // Convert seconds to ms
        const numberOfFlashes = Math.floor(totalDuration / flashDuration);

        // Cancel any ongoing animation
        cancelAnimation(flashProgress);

        let currentAnimation = 0;
        const runNextFlash = () => {
            if (currentAnimation < numberOfFlashes) {
                flashProgress.value = 0;
                flashProgress.value = withSequence(
                    withTiming(1, { duration: 500 }), // Flash in quickly
                    withTiming(0, { duration: 500 }), // Remainder for fade out
                );

                currentAnimation++;

                // Schedule next flash after current one completes
                setTimeout(runNextFlash, flashDuration);
            } else {
                // All flashes completed
                if (onFlashComplete) {
                    onFlashComplete();
                }
            }
        };

        runNextFlash();

        // Cleanup on unmount or timing change
        return () => {
            cancelAnimation(flashProgress);
        };
    }, [isAnimationOn, timing, flashDuration, flashProgress, onFlashComplete]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: flashProgress.value,
        };
    });

    return <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: color }, animatedStyle]} pointerEvents="none" />;
};

const styles = StyleSheet.create({
    overlay: {
        zIndex: 9999,
    },
});

export default FlashOverlay;