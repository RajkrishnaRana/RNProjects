import {StyleSheet, View, Text} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';

export const Details = ({
    header,
    details,
}: {
    header: string | undefined;
    details: string | undefined;
}) => {
    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.detailHeader}>{header || ''}</Text>
            <Text style={[styles.detailHeader, {width: wp(5)}]}> : </Text>
            <Text style={styles.details}>{details || ''}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        flexDirection: 'row',
    },
    detailHeader: {
        width: wp(35),
        fontWeight: 'bold',
        fontSize: wp(3.5),
        color: colors.black,
    },
    details: {
        fontSize: wp(3.5),
        textAlign: 'left',
        width: wp(45),
        color: colors.darkGrey,
    },
});
