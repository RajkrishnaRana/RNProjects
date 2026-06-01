import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import React, {memo, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {Colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
    search?: boolean;
    modal?: boolean;
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
    search = false,
    modal = false,
}: CustomDropdownProps) {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View>
            {label && <Text style={[styles.label, customLabelStyle]}>{label}</Text>}
            <Dropdown
                style={[
                    customDropdownStyle,
                    isFocus && {
                        borderColor: Colors.LIGHT_BLUE,
                        borderWidth: wp(0.5),
                        borderRadius: wp(10),
                    },
                ]}
                containerStyle={styles.containerStyle}
                itemContainerStyle={{
                    borderRadius: wp(5),
                    paddingHorizontal: wp(2),
                }}
                searchPlaceholderTextColor={Colors.GREY}
                placeholderStyle={{fontSize: wp(3.5), color: Colors.BLACK}}
                itemTextStyle={[{color: Colors.BLACK}]}
                inputSearchStyle={styles.searchBoxStyle}
                selectedTextStyle={[styles.selectedTextStyle, customSelectedTextStyle]}
                iconStyle={styles.dropdownIcon}
                activeColor={Colors.LIGHT_GREY}
                mode={modal ? 'modal' : 'default'}
                data={data}
                search={search}
                maxHeight={hp(40)}
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
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(4),
        marginBottom: hp(1),
        color: Colors.BLACK,
        fontWeight: 'bold',
    },
    containerStyle: {
        borderRadius: wp(2.8),
        paddingHorizontal: wp(3),
        paddingVertical: hp(3),
        width: wp(70),
    },
    searchBoxStyle: {
        borderColor: Colors.LIGHT_BLUE,
        borderRadius: wp(2.5),
    },
    selectedTextStyle: {
        color: Colors.LIGHT_BLUE,
        fontWeight: 'bold',
        marginLeft: wp(1),
        fontSize: wp(4.5),
    },
    dropdownIcon: {
        height: wp(5.5),
        width: wp(5.5),
        marginRight: wp(2),
        tintColor: Colors.LIGHT_BLUE,
    },
});

export default memo(CustomDropdown);
