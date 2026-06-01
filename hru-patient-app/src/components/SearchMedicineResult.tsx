import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { dataProps } from '../screens/SearchScreen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import { useNavigation } from '../hooks/useNavigation';
import { isTab } from '../utils/isTab';

export default function SearchMedicineResult({ item }: { item: dataProps }) {
    const navigation = useNavigation();

    // ZUSTAND STATES ---------------------------------------------
    const { setSelectedMedicine } = useMedicineIntakeStore();

    return (
        <TouchableOpacity
            onPress={() => {
                console.log('selected item', item);
                setSelectedMedicine(item);
                navigation.goBack();
            }}
            style={styles.container}
        >
            <FontAwesome5Icon name="capsules" size={isTab ? wp(3) : wp(5)} color={colors.darkBlue} style={{ width: wp(8) }} />
            <Text style={{ color: colors.black, fontSize: isTab ? wp(2) : wp(3.5) }}>{item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        paddingVertical: isTab ? hp(1.2) : hp(2),
        borderBottomWidth: hp(0.1),
        borderColor: colors.grey,
    },
});
