import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export const wp = (p: number) => (p * width) / 100;
export const hp = (p: number) => (p * height) / 100;
