import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { isIos } from '../../services/deviceServices';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useNavigation } from '../../hooks/useNavigation';
import { TouchableOpacity } from 'react-native';

interface Props {
    title: string;
    customBackHandler?: () => void;
}

export default function StackHeader({ title, customBackHandler }: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    customBackHandler ? customBackHandler() : navigation.goBack();
                }}
            >
                <EntypoIcons name="chevron-left" size={wp(7)} color="black" />
            </TouchableOpacity>
            <Text style={styles.screenName}>{title}</Text>
            <View style={{ width: wp(6) }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        paddingTop: isIos() ? 0 : (StatusBar.currentHeight ?? 0) + hp(1),
        paddingBottom: hp(1.5),
        backgroundColor: '#fafcfb',
    },
    screenName: {
        fontSize: wp(5),
        color: 'black',
        fontWeight: '600',
    },
});
