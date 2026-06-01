import {Image, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
// import Modal from 'react-native-modal';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {NotificationDataProps, NotificationFilterProps} from '../../types/notificationTypes';
import FilterComponent from '../NotificationFliterComponent';
import Animated, {SlideInUp} from 'react-native-reanimated';
import {isTab} from '../../utils/isTab';

interface NotificationFilterModalProps {
    setNotificationFilterData: (data: NotificationFilterProps[]) => void;
    notificationFilterDataState: NotificationFilterProps[];
    setNotificationData: Dispatch<SetStateAction<NotificationDataProps[]>>;
    data: any;
}

export default function NotificationFilterModal({
    notificationFilterDataState,
    setNotificationFilterData,
    setNotificationData,
    data,
}: NotificationFilterModalProps) {
    const [isModalVisible, setModalVisible] = useState(false);

    function filterPress(key: number) {
        let itemType = '';

        const notificationFilterData: NotificationFilterProps[] = notificationFilterDataState.map((item, index) => {
            if (index === key) itemType = item.value;
            return {
                ...item,
                isSelected: index === key ? true : false,
            };
        });

        const filteredData = itemType === '' ? data : data.filter((item: NotificationDataProps) => item.type === itemType);

        setNotificationFilterData(notificationFilterData);
        setNotificationData(filteredData);

        setModalVisible(!isModalVisible);
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
                <Image source={require('../../assets/icons/filter.png')} style={styles.logo} />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="fade"
                // animationType="fade"
                // animationIn={'fadeInUpBig'}
                // animationOut={'fadeOutDown'}
                // backdropColor={'#000'}
                // backdropOpacity={0.5}
                // onBackdropPress={() => {
                //     setModalVisible(!isModalVisible);
                // }}
                transparent>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onPress={() => setModalVisible(!isModalVisible)}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={styles.modalContent}>
                            <Text style={styles.headerText}>Filters : </Text>

                            <View style={styles.line} />
                            <View style={{}}>
                                {notificationFilterDataState.map((item, index) => (
                                    <FilterComponent key={item.id} index={index} item={item} filterPress={filterPress} />
                                ))}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: colors.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: wp(6),
    },
    logo: {
        height: isTab ? wp(4) : wp(7),
        width: isTab ? wp(4) : wp(7),
        tintColor: colors.primary,
    },
    headerText: {
        fontSize: isTab ? wp(3) : wp(6),
        color: colors.primary,
        fontWeight: 'bold',
    },
    line: {
        height: 2.5,
        backgroundColor: colors.darkBlue,
        marginVertical: isTab ? hp(1) : hp(2),
        borderRadius: 10,
    },
});
