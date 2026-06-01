import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const isSmallDevice = () => {
  return wp(100) < 420;
};
