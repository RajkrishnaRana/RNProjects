import {ImageSourcePropType} from 'react-native';

interface CarouselDataType {
  id: number;
  img: ImageSourcePropType;
  header: string;
  subHeader: string;
  description: string;
}

export const CarouselData: CarouselDataType[] = [
  {
    id: 1,
    img: require('../assets/images/login-slide1.png'),
    header: 'Find and Book Your ideal',
    subHeader: 'Medical Expert',
    description:
      'Find the best doctors and hospitals near you with just one of the best application',
  },
  {
    id: 2,
    img: require('../assets/images/login-slide2.png'),
    header: 'Welcome to HRU',
    subHeader: 'Medical Expert',
    description:
      'Find the best doctors and hospitals near you with just one of the best application',
  },
  {
    id: 3,
    img: require('../assets/images/login-slide3.png'),
    header: 'Welcome to HRU',
    subHeader: 'Medical Expert',
    description:
      'Find the best doctors and hospitals near you with just one of the best application',
  },
  {
    id: 4,
    img: require('../assets/images/login-slide4.png'),
    header: 'Welcome to HRU',
    subHeader: 'Medical Expert',
    description:
      'Find the best doctors and hospitals near you with just one of the best application',
  },
];

export const CarouselData2: CarouselDataType[] = [
  {
    id: 1,
    img: require('../assets/images/sample.png'),
    header: 'Welcome to HRU',
    subHeader: '',
    description: 'This is the first slide of the carousel.',
  },
  {
    id: 2,
    img: require('../assets/images/sample.png'),
    header: 'Welcome to HRU',
    subHeader: '',
    description: 'This is the first slide of the carousel.',
  },
  {
    id: 3,
    img: require('../assets/images/sample.png'),
    header: 'Welcome to HRU',
    subHeader: '',
    description: 'This is the first slide of the carousel.',
  },
];
