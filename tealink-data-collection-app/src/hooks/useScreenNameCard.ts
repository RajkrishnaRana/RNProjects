import { useNavigation } from './useNavigation';

export const useScreenNameCard = () => {
    const navigation = useNavigation();

    // Function to generate random color pairs (deep and light)
    const generateGreenColorPairs = () => {
        const greenHues = [100, 110, 120, 130, 140]; // Green hues (lime to forest green)
        const colorPairs = greenHues.map(hue => {
            const deepColor = `hsl(${hue}, 70%, 40%)`; // Deep green: high saturation, lower lightness
            const lightColor = `hsl(${hue}, 70%, 80%)`; // Light green: high saturation, higher lightness
            return { deepColor, lightColor };
        });
        return colorPairs;
    };

    // Array of color pairs
    const COLOR_PAIRS = generateGreenColorPairs();

    // Function to get a random color pair
    const getRandomColorPair = () => {
        const randomIndex = Math.floor(Math.random() * COLOR_PAIRS.length);
        return COLOR_PAIRS[randomIndex];
    };

    const imageText = (text: string) => {
        const arr = text.split(' ');
        let res = '';
        for (let i = 0; i < arr.length; i++) {
            res += arr[i][0];

            if (res.length == 2) return res;
        }

        return res;
    };

    const handlePress = (screen: Screen) => {
        navigation.push('Form', { screen });
    };

    return {
        handlePress,
        imageText,
        getRandomColorPair,
    };
};
