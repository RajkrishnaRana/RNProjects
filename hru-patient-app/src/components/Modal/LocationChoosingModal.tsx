// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React from 'react';
// import Modal from 'react-native-modal';
// import {LocationList, useCurrentLocationStore} from '../../store/currentLocationStore';
// import {colors} from '../../common/colors';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {queryClient} from '../../../App';
// import {isTab} from '../../utils/isTab';

// export default function LocationChoosingModal() {
//     const {locationModal, setLocationModal, locationList, nearestLocation, setNearestLocation} = useCurrentLocationStore();

//     const locationPress = (item: LocationList) => {
//         setNearestLocation(item);
//         queryClient.clear();
//         setLocationModal(false);
//     };

//     return (
//         <Modal
//             isVisible={locationModal}
//             animationIn={'fadeInUp'}
//             animationOut={'fadeOutDown'}
//             onBackdropPress={() => setLocationModal(false)}
//             backdropOpacity={0.5}
//             style={styles.modal}>
//             <View style={styles.modalContent}>
//                 <Text style={styles.textHeading}>Select Your Region</Text>

//                 {locationList?.map((item, index) => {
//                     const isSelected = nearestLocation?.city === item.city;

//                     return (
//                         <TouchableOpacity style={styles.location} key={index} onPress={() => locationPress(item)}>
//                             <Image
//                                 source={isSelected ? require('../../assets/icons/check.png') : require('../../assets/icons/circle.png')}
//                                 style={{height: isTab ? wp(4) : wp(5), width: isTab ? wp(4) : wp(5)}}
//                             />
//                             <Text
//                                 style={[
//                                     styles.locationText,
//                                     {
//                                         color: isSelected ? colors.primary : colors.black,
//                                     },
//                                 ]}>
//                                 {item.city}
//                             </Text>
//                         </TouchableOpacity>
//                     );
//                 })}
//             </View>
//         </Modal>
//     );
// }

// const styles = StyleSheet.create({
//     modalContent: {
//         height: 'auto',
//         backgroundColor: colors.white,
//         paddingVertical: wp(2),
//         borderTopStartRadius: wp(5),
//         borderTopEndRadius: wp(5),
//         paddingHorizontal: wp(5),

//         // margin: wp(6),
//     },
//     textHeading: {
//         fontSize: isTab ? wp(3.5) : wp(5),
//         color: colors.darkBlue,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: hp(2),
//         marginTop: hp(1),
//     },
//     modal: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         paddingHorizontal: 0,
//         marginHorizontal: 0,
//         marginBottom: 0,
//     },
//     location: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: wp(3),
//         marginBottom: hp(1.5),
//     },
//     locationText: {
//         fontSize: isTab ? wp(3.5) : wp(4.5),
//         color: colors.darkBlue,
//         fontWeight: 'bold',
//     },
// });

import {Image, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {LocationList, useCurrentLocationStore} from '../../store/currentLocationStore';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {queryClient} from '../../../App';
import {isTab} from '../../utils/isTab';

export default function LocationChoosingModal() {
    const {locationModal, setLocationModal, locationList, nearestLocation, setNearestLocation} = useCurrentLocationStore();

    const locationPress = (item: LocationList) => {
        setNearestLocation(item);
        queryClient.clear();
        setLocationModal(false);
    };

    const renderLocationItem = ({item}: {item: LocationList}) => {
        const isSelected = nearestLocation?.city === item.city;

        return (
            <TouchableOpacity style={[styles.location, isTab && {width: '48%'}]} onPress={() => locationPress(item)}>
                <Image
                    source={isSelected ? require('../../assets/icons/check.png') : require('../../assets/icons/circle.png')}
                    style={{height: isTab ? wp(3) : wp(5), width: isTab ? wp(3) : wp(5)}}
                />
                <Text
                    style={[
                        styles.locationText,
                        {
                            color: isSelected ? colors.primary : colors.black,
                        },
                    ]}>
                    {item.city}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            isVisible={locationModal}
            animationIn={'fadeInUp'}
            animationOut={'fadeOutDown'}
            onBackdropPress={() => setLocationModal(false)}
            backdropOpacity={0.5}
            style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={styles.textHeading}>Select Your Region</Text>
                <FlatList
                    data={locationList}
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={isTab ? 2 : 1}
                    columnWrapperStyle={isTab && styles.columnWrapper}
                    key={isTab ? 'two-columns' : 'one-column'}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        height: 'auto',
        backgroundColor: colors.white,
        paddingVertical: wp(2),
        borderTopStartRadius: wp(5),
        borderTopEndRadius: wp(5),
        paddingHorizontal: wp(5),
    },
    textHeading: {
        fontSize: isTab ? wp(2.5) : wp(5),
        color: colors.darkBlue,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: hp(2),
        marginTop: hp(1),
    },
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 0,
        marginHorizontal: 0,
        marginBottom: 0,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isTab ? wp(1) : wp(3),
        marginBottom: hp(1.5),
    },
    locationText: {
        fontSize: isTab ? wp(2.5) : wp(4.5),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: hp(1.5),
    },
});
