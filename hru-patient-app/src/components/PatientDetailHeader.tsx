import {Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {imageSelector} from '../utils';
import moment from 'moment';
import BackgroundGradient from './BackgroundGradient';
import {isTab} from '../utils/isTab';

interface Props {
    item: {
        label: string;
        value: string;
        hruId: string;
        profileImgPath: string;
        relationship: string;
        dob: string;
        proflieId: string;
    };
}

export default function PatientDetailHeader({item}: Props) {
    return (
        <BackgroundGradient customStyle={{marginBottom: hp(2), borderRadius: wp(3)}}>
            <View style={styles.profileSection}>
                <Image source={imageSelector(item?.profileImgPath, 'MALE')} style={styles.profileImage} />
                <View>
                    <View style={{flexDirection: 'row', marginBottom: hp(0.5)}}>
                        <Text style={styles.detailHeader}>
                            Report For :&nbsp; <Text style={styles.name}>{item?.label}</Text>{' '}
                        </Text>
                    </View>

                    <View style={{flexDirection: isTab ? 'row' : 'column', gap: isTab ? wp(3) : hp(0.4)}}>
                        <Text style={[styles.detailHeader, {marginBottom: isTab ? hp(0.5) : 0}]}>
                            Relation :&nbsp;
                            <Text style={styles.detailText}>{item?.relationship}</Text>
                        </Text>
                        <Text style={styles.detailHeader}>
                            Age :&nbsp;
                            <Text style={styles.detailText}>{moment().diff(item?.dob, 'years')}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: isTab ? wp(2) : wp(3),
        // backgroundColor: colors.transparentBlue,
        borderRadius: wp(5),
        // marginBottom: hp(2),
    },
    profileImage: {
        width: isTab ? wp(9) : wp(15),
        height: isTab ? wp(9) : wp(15),
        borderRadius: wp(10),
        marginRight: wp(4),
    },
    customDropdownStyle: {
        width: wp(50),
    },
    customSelectedTextStyle: {
        color: colors.darkBlue,
        fontWeight: 'bold',
        fontSize: wp(3.7),
    },
    detailHeader: {
        fontSize: isTab ? wp(2.3) : wp(4),
        // fontWeight: 'bold',
        color: colors.black,
    },
    detailText: {
        fontSize: isTab ? wp(2.3) : wp(3.5),
        color: colors.darkGrey,
        // fontWeight: 'normal',
    },
    name: {
        fontSize: isTab ? wp(2.3) : wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
});
