import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {NotificationFilterProps} from '../types/notificationTypes';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import NotificationIcons from './NotificationIcons';
import {colors} from '../common/colors';
import {memo} from 'react';
import {isTab} from '../utils/isTab';

interface NotificationFilterComponentProps {
    item: NotificationFilterProps;
    index: number;
    filterPress: (key: number) => void;
}

function NotificationFilterComponent({item, index, filterPress}: NotificationFilterComponentProps) {
    return (
        <TouchableOpacity
            style={[styles.filterContainer, {backgroundColor: item.isSelected ? colors.grey : colors.white}]}
            onPress={() => {
                filterPress(index);
            }}>
            <NotificationIcons bgColor={item.color} src={item.imgSrc} />

            <Text style={{fontSize: isTab ? wp(2.5) : wp(4), color: colors.black}}>{item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderRadius: wp(4),
        gap: wp(3),
    },
});

export default memo(NotificationFilterComponent);
