import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
    const { width, height } = useWindowDimensions();

    return {
        wpHook: (p: number) => (p * width) / 100,
        hpHook: (p: number) => (p * height) / 100,
    };
};
