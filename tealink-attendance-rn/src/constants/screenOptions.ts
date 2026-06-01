import { ImageSourcePropType } from 'react-native';
import { colors } from '../common/colors';

export interface ScreenOptions {
    name: string;
    descriptions: string;
    navigation: string;
    img: ImageSourcePropType;
}

export const screenOptions: ScreenOptions[] = [
    {
        name: 'View Workers',
        descriptions: 'Manage worker information',
        navigation: 'View Workers',
        img: require('../assets/icons/user.png'),
    },
    {
        name: 'Mark In Time',
        descriptions: 'Check in workers',
        navigation: 'Plucking In Time',
        img: require('../assets/icons/clock.png'),
    },
    {
        name: 'Record Plucking Details',
        descriptions: 'Track tea leaf collection',
        navigation: 'Record Plucking',
        img: require('../assets/icons/leaf.png'),
    },
    {
        name: 'Record Non Plucking Details',
        descriptions: 'Track non tea leaf collection',
        navigation: 'Record Non Plucking',
        img: require('../assets/icons/exam.png'),
    },
    {
        name: 'Mark Out Time',
        descriptions: 'Check in workers',
        navigation: 'Mark Out Time',
        img: require('../assets/icons/clock.png'),
    },
    {
        name: 'Print Records',
        descriptions: 'Generate report of records',
        navigation: 'Print Records',
        img: require('../assets/icons/printer.png'),
    },
];

export const android_ripple_value = { color: colors.rippleBlack, borderless: false, radius: 200, foreground: true };
