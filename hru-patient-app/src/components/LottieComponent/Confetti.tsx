import {Image, StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import LottieView from 'lottie-react-native';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import BigButton from '../BigButton';
import {isTab} from '../../utils/isTab';

export default function Confetti({
    discountPrice,
    isConfettiVisible,
    setIsConfettiVisible,
    bookingPrice,
    consultantFee,
}: {
    discountPrice: string | undefined;
    isConfettiVisible: boolean;
    setIsConfettiVisible: Dispatch<SetStateAction<boolean>>;
    bookingPrice: string | undefined;
    consultantFee: string | undefined;
}) {
    return (
        <Modal
            isVisible={isConfettiVisible}
            animationIn={'fadeInUp'}
            animationOut={'fadeOutDown'}
            onBackdropPress={() => setIsConfettiVisible(false)}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: wp(5),
            }}>
            <View
                style={{
                    backgroundColor: colors.white,
                    borderRadius: wp(5),
                    width: wp(80),
                    paddingHorizontal: wp(5),
                }}>
                <Image
                    source={require('../../assets/images/confetti.png')}
                    style={{
                        height: isTab ? wp(12) : wp(30),
                        width: isTab ? wp(12) : wp(30),
                        marginVertical: hp(5),
                        alignSelf: 'center',
                    }}
                />

                <Text
                    style={{
                        fontSize: isTab ? wp(2.5) : wp(4.5),
                        color: colors.black,
                        marginBottom: hp(1),
                    }}>
                    Hurray!, ₹{discountPrice} discount applied
                </Text>
                <Text style={{fontSize: isTab ? wp(2) : wp(3.5), color: colors.black}}>
                    Now You have to pay only{' '}
                    <Text
                        style={{
                            // fontWeight: 'bold',
                            color: colors.darkGrey,
                            textDecorationLine: 'line-through',
                        }}>
                        ₹{consultantFee}{' '}
                    </Text>
                    <Text style={{fontWeight: 'bold', color: colors.green}}> ₹{bookingPrice}</Text> to book your appointment
                </Text>

                <BigButton
                    title="OK"
                    onPress={() => setIsConfettiVisible(false)}
                    customStyle={{
                        marginTop: hp(5),
                        marginBottom: hp(3),
                        width: wp(30),
                        paddingVertical: hp(1),
                        alignSelf: 'flex-end',
                    }}
                    customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({});
