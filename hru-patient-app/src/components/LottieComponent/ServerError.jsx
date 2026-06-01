import {Text} from 'react-native';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {font} from '../../common/Font';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ServerError = () => {
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
        height={250}
        width={250}
        source={require('../../../assets/Lottie/server-error.json')}
        autoPlay
        loop
      />
      <Text
        style={{
          fontSize: wp(4.5),
          fontFamily: font.proximaNovaBold,
          color: colors.darkGrey,
        }}>
        Server Unreachable, Please try again !
      </Text>
    </Animated.View>
  );
};

export default ServerError;
