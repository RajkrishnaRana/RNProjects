import {useNavigation as useNav} from '@react-navigation/native';
import {StackNavProp} from '../types/routes';

export const useNavigation = () => useNav<StackNavProp>();
