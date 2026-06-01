import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import {isTab} from '../../utils/isTab';

type TimingCardsProps = {
    item: Timing;
    index: number;
    handleOnPressForTimings: (index: number, timingIndex: number) => void;
};

const TimingCards = ({item, index, handleOnPressForTimings}: TimingCardsProps) => {
    return (
        <>
            <View style={{marginVertical: isTab ? hp(1) : hp(1.5)}}>
                <Text style={styles.subTitle}>TIMINGS : {item?.display}</Text>
            </View>

            <View style={styles.chooseTimeContainer}>
                <FlashList
                    data={item?.slots || []}
                    estimatedItemSize={100} // Adjust based on approximate slot height
                    renderItem={({item: slot, index: timingIndex}) => {
                        const currentTime = new Date().valueOf();
                        const isDisabled = currentTime > slot.id || !slot.selectable;
                        return (
                            <TouchableOpacity
                                disabled={isDisabled}
                                style={[
                                    styles.timeContainer,
                                    {
                                        backgroundColor: slot?.isSelected ? colors.darkBlue : colors.white,
                                        opacity: isDisabled ? 0.5 : 1,
                                    },
                                ]}
                                onPress={() => handleOnPressForTimings(index, timingIndex)}>
                                <Text
                                    style={[
                                        styles.dateItem,
                                        {
                                            color: slot?.isSelected ? colors.white : colors.darkBlue,
                                        },
                                    ]}>
                                    {slot?.display}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(slot, index) => slot?.id?.toString() || index.toString()}
                    numColumns={4}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    subTitle: {
        fontWeight: 'bold',
        color: colors.darkBlue,
        fontSize: isTab ? wp(2.5) : wp(4),
        textAlign: 'center',
    },
    timeContainer: {
        borderColor: colors.grey,
        borderWidth: wp(0.2),
        borderRadius: wp(5),
        paddingVertical: hp(0.5),
        alignItems: 'center',
        width: wp(20),
        margin: hp(1),
        // elevation: 2,
        alignSelf: 'center',
    },
    chooseTimeContainer: {
        backgroundColor: colors.white,
        // backgroundColor: colors.red,
        borderRadius: wp(5),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        elevation: 2,
    },
    dateItem: {
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
});

export default memo(TimingCards);
