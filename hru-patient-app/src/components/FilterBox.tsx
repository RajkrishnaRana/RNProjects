import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {isTab} from '../utils/isTab';

interface FilterBoxProps {
    name: string;
    selected: boolean;
    onPress: () => void;
}

export default function FilterBox({name, selected, onPress}: FilterBoxProps) {
    return (
        <TouchableOpacity
            style={[
                styles.filterBox,
                {
                    backgroundColor: selected ? colors.primary : colors.blueWhite,
                },
            ]}
            onPress={onPress}>
            <Text
                style={{
                    color: selected ? colors.white : colors.darkBlue,
                    fontSize: isTab ? wp(2) : wp(3.5),
                    fontWeight: 'bold',
                }}>
                {name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterBox: {
        height: isTab ? hp(3) : hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        borderRadius: wp(2),
        marginRight: wp(3),
        elevation: 3,
    },
});
