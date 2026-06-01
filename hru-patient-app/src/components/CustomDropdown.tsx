import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { memo, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isTab } from '../utils/isTab';

interface CustomDropdownProps {
    data: any[];
    label?: string | null;
    customDropdownStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customSelectedTextStyle?: StyleProp<TextStyle>;
    value: string | undefined;
    setValue: (value: any) => void;
    customPlaceholder?: string;
    customLabelField?: string;
    customValueField?: string;
    mode?: boolean;
    searchFeature?: boolean;
    isDisabled?: boolean;
}

function CustomDropdown({
    data,
    label,
    customDropdownStyle,
    customLabelStyle,
    customSelectedTextStyle,
    value,
    setValue,
    customPlaceholder = '-- Select --',
    customLabelField = 'label',
    customValueField = 'value',
    mode = false,
    searchFeature = false,
    isDisabled = false,
}: CustomDropdownProps) {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View>
            {label && <Text style={[styles.label, customLabelStyle]}>{label}</Text>}
            <Dropdown
                disable={isDisabled}
                style={[
                    customDropdownStyle,
                    isFocus && {
                        borderColor: colors.darkBlue,
                        borderWidth: wp(0.5),
                        borderRadius: wp(4),
                    },
                ]}
                containerStyle={[styles.containerStyle, !mode && { width: wp(70) }]}
                itemContainerStyle={styles.itemContainer}
                searchPlaceholderTextColor={colors.grey}
                placeholderStyle={styles.placeholder}
                itemTextStyle={[{ color: colors.black }]}
                inputSearchStyle={styles.searchBoxStyle}
                selectedTextStyle={[customSelectedTextStyle, styles.selectedTextStyle]}
                iconStyle={styles.dropdownIcon}
                activeColor={colors.lightGrey}
                mode={mode ? 'default' : 'modal'}
                data={data}
                search={searchFeature}
                // maxHeight={hp(10)}
                labelField={customLabelField}
                valueField={customValueField}
                placeholder={!isFocus ? customPlaceholder : 'Selecting'}
                searchPlaceholder="Search"
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    if (item !== null) setValue(item);
                    setIsFocus(false);
                }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: isTab ? wp(2) : wp(3),
        marginBottom: 5,
        color: colors.black,
        // fontWeight: '500',
    },
    containerStyle: {
        borderRadius: 10,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),

        // width: wp(70),
    },
    itemContainer: {
        borderRadius: 10,
        paddingHorizontal: wp(2),
    },
    placeholder: {
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.grey,
        marginLeft: wp(2),
        fontWeight: 'bold',
    },
    searchBoxStyle: {
        borderColor: colors.darkBlue,
        borderRadius: 10,
    },
    selectedTextStyle: {
        color: colors.black,
        marginLeft: wp(2),
        // fontWeight: 'bold',
        fontSize: isTab ? wp(2.5) : wp(4),
    },
    dropdownIcon: {
        height: isTab ? wp(4) : wp(5),
        width: isTab ? wp(4) : wp(5),
        marginRight: wp(2),
        tintColor: colors.darkBlue,
    },
});

export default memo(CustomDropdown);
