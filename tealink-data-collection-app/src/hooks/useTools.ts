import { useState } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const useTools = () => {
    const [dropdown, setDropdown] = useState(false);

    const rotation = useSharedValue(0);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${rotation.value * 180}deg`,
                },
            ],
        };
    });

    const toggleRotation = () => {
        rotation.value = withTiming(rotation.value === 0 ? 1 : 0, {
            duration: 200,
        });
        setDropdown(prev => !prev);
    };

    return {
        dropdown,
        animatedIconStyle,
        toggleRotation,
    };
};
