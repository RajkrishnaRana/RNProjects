import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Keyboard, FlatList } from 'react-native';
import { colors } from '../../common/colors';
import IconDown from 'react-native-vector-icons/Entypo';
import IconCrossButton from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Animated, { FadeInDown, FadeOut, FadeOutDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
    setSelected: any;
    placeholder?: string;
    boxStyles?: any;
    inputStyles?: any;
    dropdownStyles?: any;
    dropdownItemStyles?: any;
    dropdownTextStyles?: any;
    maxHeight?: number;
    data: any;
    arrowicon?: boolean;
    closeicon?: boolean;
    search?: boolean;
    searchPlaceholder?: string;
    onSelect?: any;
    label?: string;
    notFoundText?: string;
    disabledItemStyles?: any;
    disabledTextStyles?: any;
    disabledCheckBoxStyles?: any;
    labelStyles?: any;
    badgeStyles?: any;
    badgeTextStyles?: any;
    checkBoxStyles?: any;
    save?: string;
    dropdownShown?: boolean;
    selectedval?: any;
    setSelectedVal?: any;
    isNecessary?: boolean;
    value: any;
}

const MultipleSelectList = ({
    setSelected,
    placeholder = '-- Select Item --',
    boxStyles,
    inputStyles,
    dropdownStyles,
    dropdownItemStyles,
    dropdownTextStyles,
    maxHeight,
    data,
    arrowicon = false,
    closeicon = false,
    search = true,
    searchPlaceholder = 'Search ...',
    onSelect = () => {},
    label,
    notFoundText = 'No data found',
    disabledItemStyles,
    disabledTextStyles,
    disabledCheckBoxStyles,
    labelStyles,
    badgeStyles,
    badgeTextStyles,
    checkBoxStyles,
    save = 'key',
    dropdownShown = false,
    // selectedval,
    // setSelectedVal,
    isNecessary = false,
    value,
}: Props) => {
    const { formData } = useAppSelector(state => state.formData);
    const finalData = formData?.datasources[data];
    // console.log('data', finalData);

    const [selectedval, setSelectedVal] = React.useState<string[]>([]);
    const [_firstRender, _setFirstRender] = React.useState(false);
    const [dropdown, setDropdown] = React.useState(false);

    const [filtereddata, setFilteredData] = React.useState(formData?.datasources[data]);

    // DROPDOWN ANIMATION FUNCTIONS --------------------->
    const slidedown = () => {
        setDropdown(true);
    };
    const slideup = () => {
        setDropdown(false);
    };

    React.useEffect(() => {
        setFilteredData(finalData);
    }, [finalData]);

    React.useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
        onSelect();
    }, [selectedval]);

    React.useEffect(() => {
        if (!_firstRender) {
            if (dropdownShown) slidedown();
            else slideup();
        }
    }, [dropdownShown]);

    React.useEffect(() => {
        if (!value) setSelectedVal([]);
    }, [value]);

    return (
        <Animated.View style={{ gap: hp(0.5) }}>
            {label && (
                <Text style={[styles.label]}>
                    {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
            )}
            {dropdown && search ? (
                <View style={[styles.wrapper, boxStyles]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <TextInput
                            placeholder="Search here..."
                            placeholderTextColor={colors.darkGrey}
                            onChangeText={val => {
                                let result = finalData.filter((item: any) => {
                                    val.toLowerCase();
                                    let row = item.value.toLowerCase();
                                    return row.search(val.toLowerCase()) > -1;
                                });
                                setFilteredData(result);
                            }}
                            style={[
                                {
                                    padding: 0,
                                    flex: 1,
                                    color: 'black',
                                    fontSize: 12,
                                },
                                inputStyles,
                            ]}
                        />
                        {filtereddata.length < 0 && (
                            <TouchableOpacity
                                style={{ flexDirection: 'row' }}
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                            >
                                <IconCrossButton name="circle-with-cross" size={27} color={'white'} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.searchIconContainer}
                            onPress={() => {
                                setFilteredData(finalData);
                                slideup();
                            }}
                        >
                            <IconDown name="chevron-up" size={15} style={styles.searchIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : selectedval?.length > 0 ? (
                <TouchableOpacity
                    style={[styles.wrapper, boxStyles]}
                    onPress={() => {
                        if (!dropdown) {
                            Keyboard.dismiss();
                            slidedown();
                        } else {
                            slideup();
                        }
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' }}>
                            {selectedval?.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={[
                                            {
                                                backgroundColor: colors.green,
                                                borderWidth: 1.5,
                                                borderColor: colors.green,
                                                paddingHorizontal: 20,
                                                paddingVertical: 5,
                                                borderRadius: 50,
                                                marginRight: 10,
                                                marginTop: 10,
                                            },
                                            badgeStyles,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    color: 'white',
                                                    fontSize: 12,
                                                },
                                                badgeTextStyles,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.wrapper, boxStyles]}
                    onPress={() => {
                        if (!dropdown) {
                            Keyboard.dismiss();
                            slidedown();
                        } else {
                            slideup();
                        }
                    }}
                >
                    <Text style={[{ color: 'black', fontSize: 12 }, inputStyles]}>
                        {selectedval ? (placeholder ? placeholder : 'Select option') : selectedval}
                    </Text>
                    <View style={styles.searchIconContainer}>
                        <IconDown name="chevron-down" size={14} style={styles.searchIcon} />
                    </View>
                </TouchableOpacity>
            )}

            {dropdown && (
                <Animated.View style={[styles.dropdown, dropdownStyles]} layout={LinearTransition.springify().damping(15)}>
                    <FlatList
                        contentContainerStyle={{ paddingVertical: 10 }}
                        data={filtereddata}
                        nestedScrollEnabled
                        renderItem={({ item, index }) => {
                            if (item.disabled) {
                                return (
                                    <TouchableOpacity style={[styles.disabledoption, disabledItemStyles]} key={index}>
                                        <View
                                            style={[
                                                {
                                                    width: 15,
                                                    height: 15,
                                                    marginRight: 10,
                                                    borderRadius: 3,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#c4c5c6',
                                                },
                                                disabledCheckBoxStyles,
                                            ]}
                                        >
                                            {selectedval?.includes(item.value) && (
                                                <Image
                                                    source={require('../../assets/Icons/check.png')}
                                                    resizeMode="contain"
                                                    style={{ width: 8, height: 8, paddingLeft: 7 }}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                {
                                                    color: 'black',
                                                    fontSize: 12,
                                                },
                                                disabledTextStyles,
                                            ]}
                                        >
                                            {item.value}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            } else {
                                return (
                                    <TouchableOpacity
                                        style={[styles.option, dropdownItemStyles]}
                                        onPress={() => {
                                            let existing = selectedval?.indexOf(item.value);

                                            if (existing !== -1 && existing !== undefined) {
                                                let sv = [...selectedval];
                                                sv.splice(existing, 1);
                                                setSelectedVal(sv);

                                                let sv2 = [...value];
                                                sv2.splice(existing, 1);
                                                setSelected(sv2);
                                            } else {
                                                if (save === 'value') {
                                                    setSelected([]);
                                                } else {
                                                    console.log(value, item._id);
                                                    const temp = value ? [...value, item._id] : [item._id];
                                                    setSelected(temp);
                                                }

                                                setSelectedVal(val => [...new Set([...val, item.value])]);
                                            }
                                        }}
                                        key={index}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: 15,
                                                    height: 15,
                                                    borderWidth: 1,
                                                    marginRight: 10,
                                                    borderColor: 'gray',
                                                    borderRadius: 3,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                                checkBoxStyles,
                                            ]}
                                        >
                                            {selectedval?.includes(item.value) && (
                                                <Image
                                                    source={require('../../assets/Icons/check.png')}
                                                    resizeMode="contain"
                                                    style={{ width: 8, height: 8, paddingLeft: 7 }}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                {
                                                    color: 'black',
                                                    fontSize: 12,
                                                },
                                                dropdownTextStyles,
                                            ]}
                                        >
                                            {item.value}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        }}
                        ListEmptyComponent={() => (
                            <TouchableOpacity
                                style={[styles.option, dropdownItemStyles]}
                                onPress={() => {
                                    setSelected([]);
                                    setSelectedVal([]);
                                    slideup();
                                    setTimeout(() => setFilteredData(finalData), 800);
                                }}
                            >
                                <Text style={[{ color: 'black' }, dropdownTextStyles]}>{notFoundText}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Selected Options Heading with divider */}
                    {selectedval?.length > 0 && (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingLeft: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        marginRight: 20,
                                        fontWeight: '600',
                                        color: colors.darkGrey,
                                        fontSize: 12,
                                    }}
                                >
                                    Selected Options
                                </Text>
                                <View style={{ height: 1, flex: 1, backgroundColor: 'gray' }} />
                            </View>

                            {/* Selected Options List Horizontal */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 20,
                                    paddingBottom: 20,
                                    paddingTop: 5,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {selectedval?.map((item, index) => {
                                    // console.log(item);
                                    return (
                                        <AnimatedTouchableOpacity
                                            entering={FadeInDown}
                                            key={index}
                                            style={[
                                                {
                                                    backgroundColor: colors.green,
                                                    borderWidth: 1.5,
                                                    borderColor: colors.green,
                                                    paddingLeft: 20,
                                                    paddingRight: 10,
                                                    paddingVertical: 5,
                                                    borderRadius: 50,
                                                    marginRight: 10,
                                                    marginTop: 10,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: wp(2),
                                                },
                                                badgeStyles,
                                            ]}
                                            onPress={() => {
                                                const tempVal = [],
                                                    tempId = [];
                                                for (let i = 0; i < selectedval?.length; i++) {
                                                    if (selectedval[i] !== item) {
                                                        tempVal.push(selectedval[i]);
                                                        tempId.push(value[i]);
                                                    }
                                                }

                                                setSelectedVal(tempVal);
                                                setSelected(tempId);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: 'white',
                                                        fontSize: 12,
                                                    },
                                                    badgeTextStyles,
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                            <EntypoIcons name="cross" size={wp(5)} color="white" />
                                        </AnimatedTouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </Animated.View>
            )}
        </Animated.View>
    );
};

export default memo(MultipleSelectList);

const styles = StyleSheet.create({
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    wrapper: {
        borderRadius: 10,
        borderColor: colors.green,
        paddingLeft: 20,
        paddingRight: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: colors.white,
        elevation: 2,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        overflow: 'hidden',
        backgroundColor: colors.white,
        // position: 'absolute',
        // top: 55,
        // right: 20,
        zIndex: 999,
    },
    option: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabledoption: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
    },
    searchIconContainer: {
        borderRadius: 7,
        backgroundColor: colors.green,
        padding: 7,
        marginLeft: 5,
    },
    searchIcon: {
        alignSelf: 'center',
        color: colors.white,
    },
});
