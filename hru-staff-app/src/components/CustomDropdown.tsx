import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import React, {memo, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomDropdownProps {
    data: any[];
    label?: string | null;
    customDropdownStyle?: StyleProp<ViewStyle>;
    customLabelStyle?: StyleProp<TextStyle>;
    customSelectedTextStyle?: StyleProp<TextStyle>;
    value: string;
    setValue: (value: any) => void;
    customPlaceholder?: string;
    customLabelField?: string;
    customValueField?: string;
}

function CustomDropdown({
    data,
    label,
    customDropdownStyle,
    customLabelStyle,
    customSelectedTextStyle,
    value,
    setValue,
    customPlaceholder = 'Select item',
    customLabelField = 'label',
    customValueField = 'value',
}: CustomDropdownProps) {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View>
            {label && (
                <Text style={[styles.label, customLabelStyle]}>{label}</Text>
            )}
            <Dropdown
                style={[
                    customDropdownStyle,
                    isFocus && {
                        borderColor: colors.darkBlue,
                        borderWidth: wp(0.5),
                        borderRadius: wp(4),
                    },
                ]}
                containerStyle={styles.containerStyle}
                itemContainerStyle={{
                    borderRadius: 10,
                    paddingHorizontal: wp(2),
                }}
                searchPlaceholderTextColor={colors.grey}
                placeholderStyle={{fontSize: wp(3.5), color: colors.grey}}
                itemTextStyle={[{color: colors.black}]}
                inputSearchStyle={styles.searchBoxStyle}
                selectedTextStyle={[
                    customSelectedTextStyle,
                    styles.selectedTextStyle,
                ]}
                iconStyle={styles.dropdownIcon}
                activeColor={colors.lightGrey}
                search={false}
                data={data}
                maxHeight={hp(40)}
                labelField={customLabelField}
                valueField={customValueField}
                placeholder={!isFocus ? customPlaceholder : 'Selecting...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    if (item !== null) setValue(item);
                    setIsFocus(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(4),
        marginBottom: 5,
        color: colors.black,
        fontWeight: 'bold',
    },
    containerStyle: {
        borderRadius: 10,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        // width: wp(70),
    },
    searchBoxStyle: {
        borderColor: colors.darkBlue,
        borderRadius: 10,
    },
    selectedTextStyle: {
        color: colors.darkBlue,
        marginLeft: wp(1),
    },
    dropdownIcon: {
        height: wp(5.5),
        width: wp(5.5),
        marginRight: wp(2),
        tintColor: colors.darkBlue,
    },
});

export default memo(CustomDropdown);
