import {useNavigation as useNav} from '@react-navigation/native';
import {NavProp} from '../types/routeTypes';

export const useNavigation = () => useNav<NavProp>();
