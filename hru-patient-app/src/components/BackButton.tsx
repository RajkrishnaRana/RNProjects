import {Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '../hooks/useNavigation';
import {isTab} from '../utils/isTab';

interface BackButtonProps {
    iconColor?: string;
    customPosition?: StyleProp<ViewStyle>;
}

export default function BackButton({iconColor, customPosition}: BackButtonProps) {
    const navigation = useNavigation();

    return (
        <View style={customPosition || styles.container}>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.goBack()}>
                <Image
                    source={require('../assets/icons/back.png')}
                    style={{
                        height: isTab ? wp(2.5) : wp(4),
                        width: isTab ? wp(2.5) : wp(4),
                        alignSelf: 'center',
                        tintColor: iconColor || colors.primary,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {position: 'absolute', top: isTab ? hp(3) : hp(5), left: wp(5)},
    buttonContainer: {
        padding: isTab ? wp(1) : wp(2),
        backgroundColor: colors.white,
        borderColor: colors.primary,
        borderWidth: isTab ? wp(0.3) : wp(0.5),
        borderRadius: 50,
    },
});
