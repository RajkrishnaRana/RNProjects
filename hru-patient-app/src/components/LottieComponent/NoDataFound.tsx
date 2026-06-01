import {Text} from 'react-native';
import {colors} from '../../common/colors';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {isTab} from '../../utils/isTab';

const NoDataFound = () => {
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
                height={isTab ? 250 : 150}
                width={isTab ? 250 : 150}
                source={require('../../../assets/Lottie/noDataFound.json')}
                autoPlay
                loop
            />
            <Text
                style={{
                    fontSize: isTab ? 35 : 20,
                    color: colors.darkGrey,
                }}>
                No Data Found !
            </Text>
        </Animated.View>
    );
};

export default NoDataFound;
