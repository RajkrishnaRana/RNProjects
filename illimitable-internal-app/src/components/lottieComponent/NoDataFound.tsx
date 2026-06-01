import {Text} from 'react-native';
import {Colors} from '../../common/colors';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface Props {
    customMessage?: Error | string | undefined | null;
}

const NoDataFound = ({customMessage}: Props) => {
    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOut}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <LottieView style={{height: wp(30), width: wp(30)}} source={require('../../assets/Lottie/noDataFound.json')} autoPlay loop />
            <Text
                style={{
                    fontSize: wp(4.2),
                    fontWeight: 'bold',
                    color: Colors.GREY,
                }}>
                {typeof customMessage === 'string' && customMessage ? customMessage : 'No records found !'}
            </Text>
        </Animated.View>
    );
};

export default NoDataFound;
