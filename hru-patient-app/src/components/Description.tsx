import {Text, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {isTab} from '../utils/isTab';

export const Description = ({header, body}: {header: string; body: string}) => {
    return (
        <View
            style={{
                flexDirection: 'row',
            }}>
            <Text
                style={{
                    fontSize: isTab ? wp(2.2) : wp(3.5),
                    color: colors.darkGrey,
                    fontWeight: 'bold',
                    width: isTab ? wp(20) : wp(35),
                }}>
                {header}
            </Text>
            <Text style={{width: wp(4), color: colors.darkGrey}}> : </Text>
            <Text
                style={{
                    width: isTab ? wp(65) : wp(40),
                    fontSize: isTab ? wp(2.2) : wp(3.5),
                    fontWeight: '600',
                    color: colors.black,
                }}>
                {body}
            </Text>
        </View>
    );
};
