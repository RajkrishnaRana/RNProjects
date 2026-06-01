import {Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageViewing from 'react-native-image-viewing';
import {useNavigation} from '../hooks/useNavigation';
import useChooseAClinic from '../hooks/useChooseAClinic';
import {clinicImageSelector} from '../utils';
import moment from 'moment';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {FlashList} from '@shopify/flash-list';
import HorizontalList from '../screens/HorizontalList';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {isIos} from '../utils/platform';
import {isTab} from '../utils/isTab';

function CliniqueCard({item, responseData, rescheduleAmount}: {item: ClinicInfo; responseData?: ResponseData; rescheduleAmount: string}) {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [fullImage, setFullImage] = useState();

    console.log('responseData----------------->', responseData);

    // LOCAL STATES ----------------------------------->
    // const [index, setIndex] = useState(0);

    // LOCAL FUNCTIONS ----------------------------------------->
    const {imageBasePath, clinicImgArr, clinicName, clinicInfoArray, aboutClinic, scheduleArr} = useChooseAClinic(item);

    const handlePress = () =>
        navigation.push('ClinicAppointment', {
            data: item,
            resheduleResponse: responseData,
            rescheduleAmount: rescheduleAmount,
        });

    const handleLocationPress = () => {
        // item?.mapLocation;
        const url = isIos()
            ? `maps://?q=${item?.mapLocation?.latitude},${item?.mapLocation?.longitude}&ll=${item?.mapLocation?.latitude},${item?.mapLocation?.longitude}&z=15`
            : `https://www.google.com/maps?q=${item?.mapLocation?.latitude},${item?.mapLocation?.longitude}}`;
        Linking.openURL(url);
    };

    const getNextAppointment = () => {
        const today = new Date().valueOf();
        const dateTimeSlots = item?.dateTimeSlots;

        for (let i = 0; i < dateTimeSlots?.length; i++) {
            const timings = dateTimeSlots[i].timings;

            for (let j = 0; j < timings?.length; j++) {
                const endTime = timings[j].id.split('_')[1];

                if (today < Number(endTime)) {
                    const slots = timings[j].slots;

                    for (let k = 0; k < slots?.length; k++) {
                        if (today < slots[k].id) {
                            const date = moment(slots[k].id);

                            const isToday = date.isSame(today, 'day');
                            const time = date.format('h:mm A');

                            return isToday ? `Today, ${time}` : `${date.format('MMM D')}, ${time}`;
                        }
                    }
                }
            }
        }
    };

    const selectedClinicForReshedule = () => {
        const workAddressId = responseData?.workAddressId;
        const clinicId = item?.id;

        return workAddressId === clinicId;
    };

    const handleAddressCopy = (text: string) => {
        Clipboard.setString(text);
        Vibration.vibrate(20);
        isIos() && Toast.show('Copied to clipboard', Toast.SHORT);
        Toast.show('Copied address successfully', Toast.SHORT);
    };

    useEffect(() => setFullImage(clinicImageSelector(imageBasePath)), [imageBasePath]);

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={handlePress}
            style={[{marginBottom: isTab ? hp(1) : hp(2)}, selectedClinicForReshedule() && styles.selectedContainer]}>
            <View
                style={[
                    styles.container,
                    // isTab && {width: isExpanded ? 'auto' : wp(50)},
                    selectedClinicForReshedule() && {
                        borderTopEndRadius: wp(4),
                        borderTopRightRadius: wp(4),
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                    },
                ]}>
                {isExpanded ? (
                    <>
                        {clinicImgArr?.length > 0 ? (
                            <HorizontalList
                                data={clinicImgArr}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[styles.clinicImgContainer, {width: wp(87), marginRight: wp(1)}]}
                                        onPress={() => {
                                            setFullImage(item);
                                            setIsVisible(true);
                                        }}>
                                        <Image
                                            source={item}
                                            style={{
                                                height: imageBasePath ? hp(20) : wp(30),
                                                width: imageBasePath ? wp(87) : wp(30),
                                                borderRadius: wp(5),
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <TouchableOpacity activeOpacity={0.9} style={styles.clinicImgContainer} onPress={() => setIsVisible(true)}>
                                <Image
                                    source={clinicImageSelector(imageBasePath)}
                                    style={{
                                        height: imageBasePath ? hp(20) : wp(30),
                                        width: imageBasePath ? wp(89) : wp(30),
                                        borderRadius: wp(5),
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: isTab ? wp(3) : wp(5),
                            }}>
                            <Image
                                source={clinicImageSelector(imageBasePath)}
                                style={{
                                    height: isTab ? wp(12) : wp(20),
                                    width: isTab ? (imageBasePath ? wp(20) : wp(12)) : wp(20),
                                    borderRadius: wp(2),
                                    marginHorizontal: imageBasePath ? 0 : isTab ? wp(4.5) : wp(0),
                                }}
                            />

                            <View style={{gap: hp(0.5)}}>
                                <Text style={styles.headerText}>{clinicName}</Text>

                                <Text
                                    style={{
                                        color: colors.darkGrey,
                                        width: isTab ? wp(65) : wp(80),
                                        fontSize: isTab ? wp(1.8) : wp(3.5),
                                        // backgroundColor: 'red',
                                    }}>
                                    {clinicInfoArray[0].detail.length < (isTab ? 70 : 30)
                                        ? clinicInfoArray[0].detail
                                        : clinicInfoArray[0].detail.substring(0, isTab ? 70 : 30) + '...'}
                                </Text>

                                <Text
                                    style={{
                                        color: colors.darkGrey,
                                        fontSize: isTab ? wp(1.8) : wp(3.5),
                                    }}>
                                    Next appointment :{' '}
                                    <Text
                                        style={{
                                            // fontWeight: 'bold',
                                            color: colors.darkBlue,
                                        }}>
                                        {getNextAppointment()}
                                    </Text>
                                </Text>

                                <View
                                    style={{
                                        backgroundColor: colors.darkBlue,
                                        paddingVertical: isTab ? wp(0.5) : wp(1),
                                        borderRadius: wp(5),
                                        marginTop: isTab ? hp(-1) : hp(1),
                                        width: isTab ? wp(20) : wp(30),
                                        alignItems: 'center',
                                        marginLeft: isTab ? wp(50) : wp(40),
                                    }}>
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontWeight: 'bold',
                                            fontSize: isTab ? wp(2) : wp(3.5),
                                        }}>
                                        Book Now
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: isTab ? wp(1) : wp(2),
                                marginTop: isTab ? hp(0.5) : hp(1),
                                alignSelf: 'center',
                            }}
                            onPress={() => setIsExpanded(prev => !prev)}>
                            <Text style={{color: colors.darkBlue, fontSize: isTab ? wp(2) : wp(3.5)}}>Expand</Text>
                            <FontAwesome5Icon name="chevron-down" size={isTab ? wp(2.5) : wp(5)} color={colors.darkBlue} />
                        </TouchableOpacity>
                    </>
                )}

                <ImageViewing images={[fullImage]} imageIndex={0} visible={isVisible} onRequestClose={() => setIsVisible(false)} />

                {isExpanded && (
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{clinicName}</Text>

                        <TouchableOpacity style={styles.ratingContainer} onPress={handleLocationPress}>
                            {/* <Image
                                source={require('../assets/icons/location.png')}
                                style={{
                                    height: wp(4),
                                    width: wp(4),
                                }}
                                tintColor={colors.primary}
                            /> */}
                            <Text
                                style={{
                                    color: colors.darkBlue,
                                    textDecorationLine: 'underline',
                                    fontSize: isTab ? wp(2) : wp(3.5),
                                    fontWeight: 'bold',
                                }}>
                                View map
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isExpanded && (
                    <View style={{marginHorizontal: wp(3), marginTop: isTab ? hp(0) : hp(1)}}>
                        {clinicInfoArray?.map((item, index) => (
                            <Pressable
                                key={index}
                                style={({pressed}) => [styles.detailContainer, pressed && {backgroundColor: colors.lightGrey}]}
                                onLongPress={() => handleAddressCopy(item.detail)}
                                disabled={index !== 0}>
                                <Image
                                    source={item.imgSrc}
                                    style={{height: isTab ? wp(2) : wp(3.5), width: isTab ? wp(2) : wp(3.5)}}
                                    tintColor={colors.darkBlue}
                                />
                                <Text
                                    style={{
                                        color: colors.darkGrey,
                                        width: wp(80),
                                        fontSize: isTab ? wp(2) : wp(3.2),
                                    }}>
                                    {item.detail}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                {isExpanded && (
                    <View style={[{marginHorizontal: wp(3), marginTop: hp(1)}, isTab && {gap: hp(0.5)}]}>
                        <FlashList
                            data={scheduleArr}
                            keyExtractor={(item, index) => index.toString()} // or item.id if available
                            estimatedItemSize={50} // adjust based on your item height
                            renderItem={({item}) => (
                                <View style={styles.dayContainer}>
                                    <Text style={styles.day}>{item?.day?.substring(0, 3)}</Text>
                                    <Text style={styles.colon}>:</Text>
                                    <Text style={styles.descriptionText}>{item?.value}</Text>
                                </View>
                            )}
                            numColumns={isTab ? 2 : 1}
                        />
                    </View>
                )}

                {isExpanded && (
                    <View style={{marginHorizontal: wp(3), marginTop: isTab ? hp(1) : hp(1.5)}}>
                        <Text style={styles.subHeadingText}>About Clinic:</Text>
                        <Text style={{color: colors.darkGrey, fontSize: isTab ? wp(2) : wp(3.5)}}>{aboutClinic}</Text>
                    </View>
                )}

                {isExpanded && (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: hp(1.5),
                        }}>
                        <TouchableOpacity style={styles.expandContainer} onPress={() => setIsExpanded(prev => !prev)}>
                            <Text
                                style={{
                                    color: colors.darkBlue,
                                    fontWeight: 'bold',
                                    fontSize: isTab ? wp(2) : wp(3.5),
                                }}>
                                Collapse
                            </Text>
                            <FontAwesome5Icon name="chevron-up" size={isTab ? wp(2.5) : wp(4.5)} color={colors.darkBlue} />
                        </TouchableOpacity>
                        <View style={[styles.expandContainer, {backgroundColor: colors.darkBlue}]}>
                            <Text
                                style={{
                                    color: colors.white,
                                    fontWeight: 'bold',
                                    fontSize: isTab ? wp(2) : wp(3.5),
                                }}>
                                Book Now
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            {selectedClinicForReshedule() && (
                <View style={styles.selectedExtraContainer}>
                    <Text style={styles.selectedContainerText}>Your Selected Clinic</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(4),
        // borderWidth: wp(0.1),
        backgroundColor: colors.white,
        padding: wp(3),
        // marginHorizontal: wp(3),
        // borderWidth: wp(0.3),
        borderColor: colors.darkBlue,
    },
    selectedContainer: {
        borderWidth: wp(0.5),
        borderColor: colors.primary,
        borderRadius: wp(4),
    },
    clinicImgContainer: {
        height: hp(20),
        width: wp(89),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 3,
        backgroundColor: colors.white,
    },
    headerText: {
        fontSize: isTab ? wp(2.2) : wp(4),
        color: colors.black,
        fontWeight: 'bold',
        width: wp(60),
        // backgroundColor: 'red',
    },
    headerContainer: {
        marginHorizontal: wp(3),
        marginTop: isTab ? hp(0.5) : hp(1.5),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ratingContainer: {
        // flexDirection: 'row',
        gap: wp(0.5),
        borderRadius: wp(5),
        height: wp(9),
        // width: wp(9),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.transparentBlue,
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
    },
    ratingText: {
        fontSize: wp(3.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    detailContainer: {
        flexDirection: 'row',
        gap: wp(1),
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    dayContainer: {
        flexDirection: 'row',
        width: wp(80),
        alignItems: 'center',
        // backgroundColor: colors.black,
    },
    day: {
        color: colors.darkGrey,
        fontWeight: 'bold',
        width: isTab ? wp(4) : wp(8),
        fontSize: isTab ? wp(1.8) : wp(3.05),
    },
    colon: {paddingHorizontal: isTab ? wp(0.5) : wp(1), fontWeight: 'bold'},
    descriptionText: {
        color: colors.black,
        fontSize: isTab ? wp(1.6) : wp(3),
        ...(isTab && {width: wp(36)}),
        // backgroundColor: 'red',
    },
    subHeadingText: {
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: 'bold',
    },
    expandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(3),
        borderRadius: wp(2),
        borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        width: wp(40),
        paddingVertical: isTab ? wp(1) : wp(2),
    },
    selectedExtraContainer: {
        paddingVertical: hp(1),
        backgroundColor: colors.primary,
        borderBottomEndRadius: wp(4),
        borderBottomStartRadius: wp(4),
    },
    selectedContainerText: {
        color: colors.white,
        fontSize: wp(3.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default memo(CliniqueCard);
