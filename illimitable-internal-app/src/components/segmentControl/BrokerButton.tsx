import {StyleSheet, Text, View, Keyboard, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../common/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface BrokerButtonProps {
    toggleBrokerButton: boolean;
    setToggleBrokerButton: any;
    first: string;
    second: string;
    textStyle: any;
    customStyle?: any;
    touchButtonStyle: any;
}

const BrokerButton = ({
    toggleBrokerButton,
    setToggleBrokerButton,
    first,
    second,
    textStyle,
    customStyle,
    touchButtonStyle,
}: BrokerButtonProps): JSX.Element => {
    return (
        <View
            style={[
                styles.brokerButtonContainer,
                customStyle,
                {borderRadius: wp(20)},
            ]}>
            {/* FIRST BUTTON --------------------------------------------------*/}
            <View
                style={[
                    styles.brokerButtonStyle,
                    {
                        backgroundColor: toggleBrokerButton
                            ? Colors.LIGHT_BLUE
                            : Colors.WHITE,
                        borderRadius: wp(20),
                    },
                ]}>
                <TouchableOpacity
                    style={[touchButtonStyle, styles.touchButton]}
                    onPress={() => {
                        setToggleBrokerButton(true);
                        Keyboard.dismiss();
                    }}>
                    <Text
                        style={[
                            textStyle,
                            {
                                color: toggleBrokerButton
                                    ? Colors.WHITE
                                    : Colors.LIGHT_BLUE,
                            },
                        ]}>
                        {first}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* SECOND BUTTON --------------------------------------------------*/}
            <View
                style={[
                    styles.brokerButtonStyle,
                    {
                        backgroundColor: toggleBrokerButton
                            ? Colors.WHITE
                            : Colors.LIGHT_BLUE,
                        borderRadius: wp(18),
                    },
                ]}>
                <TouchableOpacity
                    style={[touchButtonStyle, styles.touchButton]}
                    onPress={() => {
                        setToggleBrokerButton(false);
                        Keyboard.dismiss();
                    }}>
                    <Text
                        style={[
                            textStyle,
                            {
                                color: toggleBrokerButton
                                    ? Colors.LIGHT_BLUE
                                    : Colors.WHITE,
                            },
                        ]}>
                        {second}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BrokerButton;

const styles = StyleSheet.create({
    brokerButtonContainer: {
        flexDirection: 'row',
        borderColor: Colors.LIGHT_BLUE,
        marginBottom: '3%',
        backgroundColor: Colors.WHITE,
    },
    brokerButtonStyle: {
        flex: 1,
        alignItems: 'center',
    },
    touchButton: {
        padding: 10,
    },
});
