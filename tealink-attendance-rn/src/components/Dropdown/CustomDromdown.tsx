import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { memo, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../common/colors';
import { hp, wp } from '../../utils/dimesion';
import isTab from '../../utils/isTab';

interface CustomDropdownProps {
    data: any[];
    label?: string | null;
    customDropdownStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customSelectedTextStyle?: StyleProp<TextStyle>;
    value: any;
    setValue: (value: any) => void;
    customPlaceholder?: string;
    customLabelField?: string;
    customValueField?: string;
    mode?: boolean;
    searchFeature?: boolean;
    isDisabled?: boolean;
    customContainerStyle?: StyleProp<ViewStyle>;
    isNecessary?: boolean;
    isSelectFullObj?: boolean;
    exceptFormData?: boolean;
}

function CustomDropdown({
    data,
    label,
    customDropdownStyle,
    customLabelStyle,
    customSelectedTextStyle,
    value,
    setValue,
    customPlaceholder = '-- Select Item --',
    customLabelField = 'value',
    customValueField = '_id',
    mode = true,
    searchFeature = false,
    isDisabled = false,
    customContainerStyle = {},
    isNecessary = false,
}: CustomDropdownProps) {
    const [isFocus, setIsFocus] = useState(false);
    const gap = isTab ? 5 : 3;
    const color = 'red';

    return (
        <View style={[customContainerStyle, { gap }]}>
            {label && (
                <Text style={[styles.label, customLabelStyle]}>
                    {label} {isNecessary && <Text style={{ color }}>*</Text>}
                </Text>
            )}
            <Dropdown
                disable={isDisabled}
                style={[
                    styles.dropdown,
                    customDropdownStyle,
                    isFocus && {
                        borderColor: colors.black,
                        borderWidth: wp(0.5),
                        borderRadius: wp(4),
                    },
                ]}
                containerStyle={[styles.containerStyle, !mode && { width: wp(70) }]}
                itemContainerStyle={styles.itemContainerStyle}
                searchPlaceholderTextColor={colors.grey}
                placeholderStyle={styles.placeholderStyle}
                itemTextStyle={[{ color: colors.black }]}
                inputSearchStyle={styles.searchBoxStyle}
                selectedTextStyle={[customSelectedTextStyle, styles.selectedTextStyle]}
                iconStyle={styles.dropdownIcon}
                activeColor={colors.grey}
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
        fontSize: 12,
        color: colors.green,
        fontWeight: '600',
    },
    dropdown: {
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: colors.lightGreenShade,
        borderRadius: 10,
        paddingHorizontal: 10,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.2),
    },
    containerStyle: {
        borderRadius: 10,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
    },
    placeholderStyle: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.grey,
        marginLeft: wp(2),
        fontWeight: 'bold',
    },
    searchBoxStyle: {
        borderColor: colors.black,
        borderRadius: 10,
    },
    selectedTextStyle: {
        color: colors.black,
        marginLeft: wp(2),
        fontWeight: 'bold',
        fontSize: 12,
    },
    dropdownIcon: {
        height: 10,
        width: 18,
        marginRight: wp(2),
        tintColor: colors.black,
    },
    itemContainerStyle: {
        borderRadius: 10,
        paddingHorizontal: wp(2),
    },
});

export default memo(CustomDropdown);
