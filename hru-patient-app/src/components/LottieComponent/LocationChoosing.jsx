import {Text, View} from 'react-native';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {font} from '../../common/Font';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isTab} from '../../utils/isTab';

const LocationChoosing = () => {
    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOut}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <LottieView height={hp(22)} width={wp(50)} source={require('../../../assets/Lottie/tap.json')} autoPlay loop />
            <Text
                style={{
                    fontSize: isTab ? wp(4) : wp(5),
                    fontFamily: font.proximaNovaBold,
                    color: colors.darkGrey,
                }}>
                Please Choose a Location
            </Text>
        </Animated.View>
    );
};

export default LocationChoosing;
