import {Linking, StyleSheet, Text, TouchableOpacity, View, Modal, Image, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../common/colors';

interface Props {
    data: DayData;
}

export default function InOutDetiailModal({data}: Props) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    const openGoogleMaps = (latitude: number | undefined, longitude: number | undefined) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
        <View>
            <TouchableOpacity
                style={[
                    styles.buttonStyle,
                    {
                        borderColor: data?.hasIssue ? Colors.RED : Colors.GREEN,
                    },
                ]}
                onPress={toggleModal}>
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: data?.hasIssue ? Colors.RED : Colors.GREEN,
                        },
                    ]}>
                    Details
                </Text>
            </TouchableOpacity>

            <Modal animationType="fade" visible={isVisible} onRequestClose={toggleModal} transparent>
                <TouchableOpacity style={styles.modalStyle} activeOpacity={1} onPress={toggleModal}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.headerText}>
                                Log in from{' '}
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        color: data?.in?.unAuthorisedWorkLocation ? Colors.RED : Colors.GREEN,
                                    }}>
                                    {data?.in?.locationName}
                                </Text>
                            </Text>
                            <View style={styles.timeLocationContainer}>
                                <View>
                                    <Text style={styles.timeText}>In Time : {data?.display.split('-')[0]}</Text>
                                </View>

                                {data?.in?.location && (
                                    <TouchableOpacity
                                        style={styles.mapButton}
                                        onPress={() => openGoogleMaps(data?.in?.location?.latitude, data?.in?.location?.longitude)}>
                                        <Image source={require('../../assets/icons/google-maps.png')} style={styles.img} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {data?.out?.locationName && <View style={styles.breakline} />}

                            {data?.out?.locationName && (
                                <>
                                    <Text style={styles.headerText}>
                                        Log Out from{' '}
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: data?.out?.unAuthorisedWorkLocation ? Colors.RED : Colors.GREEN,
                                            }}>
                                            {data?.out?.locationName}
                                        </Text>
                                    </Text>

                                    <View style={styles.timeLocationContainer}>
                                        <View>
                                            <Text style={styles.timeText}>Out Time : {data?.display.split('-')[1]}</Text>
                                        </View>

                                        {data?.in?.location && (
                                            <TouchableOpacity
                                                style={styles.mapButton}
                                                onPress={() => openGoogleMaps(data?.out?.location?.latitude, data?.out?.location?.longitude)}>
                                                <Image source={require('../../assets/icons/google-maps.png')} style={styles.img} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        borderWidth: wp(0.5),
        borderRadius: wp(3),
        borderColor: Colors.LIGHT_BLUE,
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
    },
    buttonText: {
        fontSize: wp(3.2),
        fontWeight: 'bold',
        color: Colors.LIGHT_BLUE,
    },
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: Colors.WHITE,
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
        width: wp(90),
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: wp(4),
        color: Colors.GREY,
        textAlign: 'center',
        marginBottom: hp(1),
    },
    breakline: {
        borderWidth: wp(0.1),
        borderStyle: 'dotted',
        borderColor: Colors.GREY,
        marginVertical: hp(2),
    },
    timeLocationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mapButton: {
        width: wp(10),
        height: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(10),
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    img: {
        height: wp(5),
        width: wp(5),
    },
    timeText: {
        fontSize: wp(4),
        fontWeight: 'bold',
    },
});
