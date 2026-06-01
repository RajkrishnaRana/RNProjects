import {useNavigation as useNav} from '@react-navigation/native';
import {CombinedNavProp} from '../types/routeTypes';

export const useNavigation = () => useNav<CombinedNavProp>();
