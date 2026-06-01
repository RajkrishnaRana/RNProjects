import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isTab} from '../../utils/isTab';

type DateCardsProps = {
    item: DateList;
    index: number;
    handleOnPress: (index: number) => void;
};

const DateCards = ({item, index, handleOnPress}: DateCardsProps) => {
    return (
        <TouchableOpacity
            key={index}
            style={[
                styles.dateContainer,
                {
                    backgroundColor: item?.isSelected ? colors.primary : colors.blueWhite,
                },
            ]}
            onPress={() => handleOnPress(index)}>
            <Text
                style={[
                    styles.dateItem,
                    {
                        color: item?.isSelected ? colors.white : colors.black,
                    },
                ]}>
                {item?.value}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dateContainer: {
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        marginRight: isTab ? wp(2) : wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: isTab ? hp(1) : hp(1.3),
        marginVertical: hp(0.2),
        elevation: 3,
    },
    dateItem: {
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
});

export default memo(DateCards);
