import {Image, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isTab} from '../utils/isTab';

const imageSourcesData = [
    require('../assets/icons/patient.png'), // 0
    require('../assets/icons/date-time.png'), // 1
    require('../assets/icons/id.png'), // 2
    require('../assets/icons/location.png'), // 3
    require('../assets/icons/phone.png'), // 4
    require('../assets/icons/doctor.png'), // 5
    require('../assets/icons/scholar.png'), // 6
    require('../assets/icons/feedback.png'), // 7
    require('../assets/icons/calendar.png'), // 8
    require('../assets/icons/heart.png'), //9
    require('../assets/icons/star.png'), //10
    require('../assets/icons/feedback.png'), //11
    require('../assets/images/drugs.png'), //12
    require('../assets/icons/email.png'), //13
    require('../assets/icons/running.png'), //14
    require('../assets/icons/rupee-symbol.png'), //15
    require('../assets/icons/inpatient.png'), //16
];

interface Props {
    index?: number;
    text: string | number | undefined;
    boldText?: string;
    customStyles?: StyleProp<ViewStyle>;
    customLogoStyles?: StyleProp<ImageStyle>;
    customTextStyles?: StyleProp<TextStyle>;
    customLogo?: React.ReactNode;
}

const IconText = ({index, text, customStyles, customLogoStyles, customTextStyles, customLogo, boldText}: Props) => (
    <View style={[styles.detailContainer, customStyles]}>
        {index === undefined ? customLogo : <Image source={imageSourcesData[index!]} style={[styles.logo, customLogoStyles]} />}
        <Text style={[styles.text, customTextStyles]}>
            <Text style={{fontWeight: 'bold', color: colors.black}}>{boldText}</Text>
            {text}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    detailContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginTop: hp(0.5),
        gap: isTab ? wp(0) : wp(0.5),
        alignItems: 'center',
    },
    logo: {
        height: isTab ? wp(2) : wp(3.5),
        width: isTab ? wp(2) : wp(3.5),
        // marginTop: hp(0.4),
        tintColor: colors.primary,
        marginRight: isTab ? wp(0.8) : wp(1.5),
    },
    text: {
        fontSize: isTab ? hp(1.1) : hp(1.4),
        color: colors.darkGrey,
    },
});

export default IconText;
