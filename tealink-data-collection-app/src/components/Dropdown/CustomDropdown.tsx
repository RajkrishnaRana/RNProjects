import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { memo, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAppSelector } from '../../hooks/typedReduxHooks';

interface CustomDropdownProps {
    data: string | any[];
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
    isSelectFullObj = false,
    exceptFormData = false,
}: CustomDropdownProps) {
    const [isFocus, setIsFocus] = useState(false);

    const { formData } = useAppSelector(state => state.formData);
    // console.log('formData', formData);

    return (
        <View style={[customContainerStyle, { gap: hp(0.8) }]}>
            {label && (
                <Text style={[styles.label, customLabelStyle]}>
                    {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
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
                itemContainerStyle={{
                    borderRadius: 10,
                    paddingHorizontal: wp(2),
                }}
                searchPlaceholderTextColor={colors.grey}
                placeholderStyle={{
                    fontSize: wp(3.5),
                    color: colors.grey,
                    marginLeft: wp(2),
                    fontWeight: 'bold',
                }}
                itemTextStyle={[{ color: colors.black }]}
                inputSearchStyle={styles.searchBoxStyle}
                selectedTextStyle={[customSelectedTextStyle, styles.selectedTextStyle]}
                iconStyle={styles.dropdownIcon}
                activeColor={colors.grey}
                mode={mode ? 'default' : 'modal'}
                data={exceptFormData ? data : formData?.datasources[data as string]}
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
                    if (item !== null) isSelectFullObj ? setValue(item) : setValue(item._id);
                    setIsFocus(false);
                }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    dropdown: {
        backgroundColor: colors.white,
        borderWidth: wp(0.001),
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

        // width: wp(70),
    },
    searchBoxStyle: {
        borderColor: colors.black,
        borderRadius: 10,
    },
    selectedTextStyle: {
        color: colors.black,
        marginLeft: wp(2),
        // fontWeight: 'bold',
        fontSize: wp(4),
    },
    dropdownIcon: {
        height: wp(5),
        width: wp(5),
        marginRight: wp(2),
        tintColor: colors.black,
    },
});

export default memo(CustomDropdown);
