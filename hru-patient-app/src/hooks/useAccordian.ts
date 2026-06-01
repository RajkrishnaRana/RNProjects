import {useState} from 'react';
import {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

export const useAccordian = (initialState: boolean) => {
    const [dropdown, setDropdown] = useState(initialState);

    const rotation = useSharedValue(initialState ? 1 : 0);
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
