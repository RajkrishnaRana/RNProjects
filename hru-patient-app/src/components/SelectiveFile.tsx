import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Octicons from 'react-native-vector-icons/Octicons';
import {isTab} from '../utils/isTab';

const SelectiveFile = ({type, item, onPress}: {type?: 'DoctorName'; item: any; onPress: () => void}) => {
    // console.log(item);

    return (
        <TouchableOpacity
            style={[
                styles.selectedFile,
                {
                    backgroundColor: item.isSelected ? colors.blueWhite : colors.white,
                },
            ]}
            onPress={onPress}>
            {item.isSelected ? (
                <Octicons name="check-circle-fill" size={isTab ? wp(3) : wp(5.2)} color={colors.darkBlue} />
            ) : (
                <Image source={require('../assets/icons/circle.png')} style={styles.rememberMeIcon} />
            )}
            <Text
                style={{
                    fontSize: isTab ? wp(2) : wp(3.5),
                    color: item.isSelected ? colors.darkBlue : colors.darkGrey,
                    // fontWeight: item.isSelected ? '500' : '400',
                }}>
                {type === 'DoctorName' && item?.name}
                {!type && item?.fileName}
                {!type && item?.ext && `.${item?.ext}`}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    selectedFile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        borderRadius: wp(3),
        marginBottom: isTab ? hp(0.5) : hp(1),
        paddingHorizontal: wp(3),
        paddingVertical: isTab ? hp(0.5) : hp(1),
    },
    rememberMeIcon: {
        width: isTab ? wp(2.5) : wp(4),
        height: isTab ? wp(2.5) : wp(4),
    },
});

export default SelectiveFile;
