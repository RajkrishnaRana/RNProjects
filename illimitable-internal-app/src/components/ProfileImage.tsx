import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import {useAuthStore} from '../store/authStore';
import {useNavigation} from '../hooks/useNavigation';
import {trigger} from 'react-native-haptic-feedback';

export default function ProfileImage({setGujuMode}: {setGujuMode: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {name, email} = useAuthStore();
    const navigation = useNavigation();
    const onLongPress = () => {
        setGujuMode((prev: boolean) => !prev);
        trigger('impactLight');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    navigation.push('Profile');
                }}
                onLongPress={onLongPress}
                style={styles.profileImg}>
                <Text style={styles.imgText}>{name ? name.charAt(0) : 'I'}</Text>
            </TouchableOpacity>

            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.attendanceText}>{email}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(5),
        marginTop: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },
    profileImg: {
        height: wp(15),
        width: wp(15),
        borderRadius: wp(10),
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgText: {
        color: Colors.PRIMARY,
        fontSize: wp(8),
        fontWeight: 'bold',
    },
    name: {
        fontSize: wp(4.2),
        color: Colors.WHITE,
    },
    attendanceText: {
        fontSize: wp(4.2),
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
});
