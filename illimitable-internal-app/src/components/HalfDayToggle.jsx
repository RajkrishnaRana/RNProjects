import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
// import Colors from '../constants/Colors';

const HalfDayToggle = ({value, onToggle}) => {
    return (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    value && styles.activeButton,
                    {
                        borderTopLeftRadius: wp(10),
                        borderBottomLeftRadius: wp(10),
                    },
                ]}
                onPress={() => onToggle(true)}>
                <Text style={[styles.toggleText, value && styles.activeText]}>
                    Yes
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    !value && styles.activeButton,
                    {
                        borderTopRightRadius: wp(10),
                        borderBottomRightRadius: wp(10),
                    },
                ]}
                onPress={() => onToggle(false)}>
                <Text style={[styles.toggleText, !value && styles.activeText]}>
                    No
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: wp(10),
        borderWidth: wp(0.5),
        borderColor: Colors.LIGHT_BLUE,
        overflow: 'hidden',
        height: hp(5.5),
    },
    toggleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    activeButton: {
        backgroundColor: Colors.PRIMARY,
    },
    toggleText: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: Colors.PRIMARY,
    },
    activeText: {
        color: '#FFF',
    },
});

export default HalfDayToggle;
