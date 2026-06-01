import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BigButton from '../BigButton';

import { useNavigation } from '../../hooks/useNavigation';
import { isIos } from '../../utils/platform';

export default function UploadPrescriptionSection({ data }: { data: any }) {
    const navigation = useNavigation();

    const uploadPrescription = () => navigation.push('PrescriptionUploadScreen', { data: data });

    return (
        <LinearGradient
            colors={[colors.backgroundColor, colors.backgroundColor, colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadPrescriptionContainer}
        >
            <View style={styles.firstContainer}>
                <Image source={require('../../assets/icons/reportBoards.png')} style={styles.img} />
                <View style={{ gap: isIos() ? hp(0.2) : hp(0.3) }}>
                    <Text style={styles.uploadPrescriptionHeader}>Can't read Prescription ?</Text>
                    <Text style={styles.description}>Upload your prescription and we will scan it for you</Text>
                </View>
            </View>
            <BigButton title="Upload" onPress={uploadPrescription} customStyle={styles.buttonStyle} customTextStyle={{ fontSize: wp(3) }} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    uploadPrescriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: isIos() ? wp(2) : wp(4),
        marginVertical: isIos() ? hp(1) : hp(2),
        borderRadius: wp(3),
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        paddingVertical: isIos() ? hp(0) : hp(1.5),
        paddingHorizontal: isIos() ? wp(2) : wp(3),
        elevation: 1,
    },
    firstContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isIos() ? wp(0.2) : wp(1),
        // backgroundColor: 'red',
    },
    img: {
        width: isIos() ? wp(12) : wp(10),
        height: isIos() ? wp(25) : wp(10),
        tintColor: colors.primary,
        resizeMode: isIos() ? 'contain' : 'none',
    },
    uploadPrescriptionHeader: {
        fontSize: wp(3.7),
        color: colors.black,
        fontWeight: 'bold',
    },
    description: {
        fontSize: wp(3.1),
        color: colors.darkGrey,
        width: wp(45),
    },
    buttonStyle: {
        width: wp(20),
        backgroundColor: colors.primary,
        borderRadius: wp(5),
        marginTop: 0,
        marginRight: isIos() ? wp(1.8) : 0,
    },
});
