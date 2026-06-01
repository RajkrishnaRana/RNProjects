import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { locationServices } from '../services/locationServices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLocationValue } from '../hooks/useLocationValue';

type Props = {
    label: string;
    isNecessary?: boolean;
    value: Location | undefined;
    setValue: (value: string) => void;
};

export default function LocationView({ label, isNecessary, value, setValue }: Props) {
    const { loading, handleLocationPress, handleViewMap } = useLocationValue();

    return (
        <View style={{ gap: hp(0.5) }}>
            {label && (
                <Text style={styles.label}>
                    {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
            )}

            <View style={styles.container}>
                <TouchableOpacity style={[styles.camContainer, { flex: 1 }]} onPress={() => handleLocationPress(setValue)}>
                    {loading ? (
                        <ActivityIndicator size={wp(5)} color={colors.green} />
                    ) : value ? (
                        <Text style={styles.locationText}>Tap to update your current location</Text>
                    ) : (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>Tap to capture your current location</Text>
                            <MaterialIcons name="add-location-alt" size={wp(6)} color="grey" />
                        </View>
                    )}
                </TouchableOpacity>

                {value && (
                    <TouchableOpacity style={styles.mapIconContainer} onPress={() => handleViewMap(value)}>
                        <Image source={require('../assets/Icons/map.png')} style={styles.img} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', gap: wp(3), alignItems: 'center' },
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    camContainer: {
        backgroundColor: 'white',
        paddingVertical: hp(1),
        borderRadius: wp(3),
        alignItems: 'center',
        elevation: 2,
    },
    locationText: {
        fontSize: wp(3.5),
        color: 'black',
    },
    mapIconContainer: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        backgroundColor: 'white',
        borderRadius: wp(2),
        elevation: 2,
    },
    img: {
        height: wp(6),
        width: wp(6),
    },
});
