import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import AnimatedSwitch from './AnimatedSwitch';
import { useSharedValue } from 'react-native-reanimated';

interface Props {
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    label: string;
    isNecessary?: boolean;
}

export default function ToggleSwitch({ state, setState, label, isNecessary }: Props) {
    const isOn = useSharedValue(false);

    const toggleSwitch = () => {
        isOn.value = !isOn.value;
        setState(!state);
    };

    useEffect(() => {
        setState(false);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
            </Text>

            <AnimatedSwitch value={isOn} onPress={toggleSwitch} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
});
