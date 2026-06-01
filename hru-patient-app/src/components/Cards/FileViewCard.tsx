import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DocumentPickerResponse} from '@react-native-documents/picker';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {isTab} from '../../utils/isTab';

interface Props {
    item: DocumentPickerResponse;
    onPress: () => void;
}

export default function FileViewCard({item, onPress}: Props) {
    // console.log(item);

    return (
        <View style={styles.container}>
            <Text style={styles.fileName}>{item.name}</Text>
            <TouchableOpacity onPress={onPress}>
                <EntypoIcons name="circle-with-cross" size={isTab ? wp(3) : wp(5)} color={colors.red} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.blueWhite,
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.7),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    fileName: {
        fontSize: isTab ? wp(2) : wp(3),
        color: colors.darkBlue,
        width: wp(68),
    },
});
