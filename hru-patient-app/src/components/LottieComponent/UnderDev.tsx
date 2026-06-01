import {Text} from 'react-native';
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
                height: 150,
                width: 150,
            }}>
            <LottieView
                // height={150}
                // width={150}
                source={require('../../assets/LottieFiles/under_dev.json')}
                autoPlay
                loop
            />
            <Text
                style={{
                    fontSize: 20,
                    color: colors.darkGrey,
                }}>
                This Page is Under Development
            </Text>
        </Animated.View>
    );
};

export default UnderDev;
