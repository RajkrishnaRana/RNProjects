// import {Dimensions} from 'react-native';

// const width = Dimensions.get('window').width;

// export const isTab = () => {
//     // console.log(width);
//     return width >= 600;
// };

import DeviceInfo from 'react-native-device-info';
export const isTab = DeviceInfo.isTablet();
