import {ToastAndroid} from 'react-native';

export function inDevelopmentMessage() {
  ToastAndroid.show('Feature development is in progress', ToastAndroid.SHORT);
}
