import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import IconModal from './Modal/IconModal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { isTab } from '../utils/isTab';

interface DetailsProps {
    title: string;
    value: string;
    isRemote?: boolean;
    highlight?: boolean;
}

function Details({ title, value, isRemote = false, highlight = false }: DetailsProps) {
    return (
        <View style={[styles.flex, highlight && styles.container]}>
            <Text style={[styles.titleText, highlight && styles.highlight]}>{title}:</Text>

            <View style={styles.detailTextContainer}>
                {isRemote && <IconModal />}
                <Text style={[styles.detailText, highlight && styles.highlight]}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flexDirection: 'row' },
    container: {
        backgroundColor: colors.transparentPrimary,
        paddingVertical: hp(0.3),
        marginHorizontal: wp(-3),
        paddingHorizontal: wp(3),
    },
    titleText: {
        textAlign: 'left',
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.black,
        width: isTab ? wp(30) : wp(45),
    },
    highlight: { color: colors.primary, fontWeight: '500' },
    detailTextContainer: {
        flexDirection: 'row',
        gap: wp(1),
        alignItems: 'center',
    },
    detailText: {
        textAlign: 'left',
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.darkGrey,
        width: isTab ? wp(65) : wp(43),
    },
});

export default Details;
