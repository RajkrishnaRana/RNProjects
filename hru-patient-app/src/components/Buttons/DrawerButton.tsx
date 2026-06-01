import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '../../hooks/useNavigation';
import {isTab} from '../../utils/isTab';

interface BackButtonProps {
    iconColor?: string;
}

export default function DrawerButton({iconColor}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <View style={{}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                    source={require('../../assets/icons/menus.png')}
                    style={{
                        height: isTab ? wp(4) : wp(8),
                        width: isTab ? wp(4) : wp(8),
                        alignSelf: 'center',
                        tintColor: iconColor || colors.primary,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({});
