import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '../../hooks/useNavigation';

interface BackButtonProps {
    iconColor?: string;
    customPosition?: StyleProp<ViewStyle>;
}

export default function BackButton({
    iconColor,
    customPosition,
}: BackButtonProps) {
    const navigation = useNavigation();

    return (
        <View style={customPosition || styles.container}>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.goBack()}>
                <Image
                    source={require('../../assets/icons/back.png')}
                    style={{
                        height: wp(4),
                        width: wp(4),
                        alignSelf: 'center',
                        tintColor: iconColor || colors.primary,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {position: 'absolute', top: hp(5), left: wp(5)},
    buttonContainer: {
        padding: wp(2),
        backgroundColor: colors.white,
        borderColor: colors.primary,
        borderWidth: wp(0.5),
        borderRadius: 50,
    },
});
