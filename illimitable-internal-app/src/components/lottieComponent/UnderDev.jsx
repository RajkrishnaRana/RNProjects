import {Text} from 'react-native';
import {font} from '../../common/Font';
import {colors} from '../../common/colors';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const UnderDev = () => {
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOut}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <LottieView
        height={150}
        width={150}
        source={require('../../../assets/Lottie/under_dev.json')}
        autoPlay
        loop
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: font.proximaNovaBold,
          color: colors.darkGrey,
        }}>
        This Page is Under Development
      </Text>
    </Animated.View>
  );
};

export default UnderDev;
