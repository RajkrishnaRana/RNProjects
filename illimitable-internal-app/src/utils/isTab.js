import {Dimensions, useWindowDimensions} from 'react-native';

const width = Dimensions.get('window').width;

export const isTab = () => {
  // console.log(width);
  return width >= 600;
};
