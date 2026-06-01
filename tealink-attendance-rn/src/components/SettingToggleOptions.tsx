import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { wp } from '../utils/dimesion';
import AnimatedSwitch from './AnimatedSwitch';
import { useSharedValue } from 'react-native-reanimated';

interface Props {
    title?: string;
    description?: string;
    state: boolean;
    setState: (state: boolean) => void;
    disable?: boolean;
}

export default function SettingToggleOptions({ title, description, state, setState, disable }: Props) {
    const isOn = useSharedValue(state);

    const handlePress = () => {
        const next = !isOn.value;
        isOn.value = next;
        setState(next);
    };

    // 🔑 Sync external state → shared value
    useEffect(() => {
        isOn.value = state;
    }, [state, isOn]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            <AnimatedSwitch value={isOn} onPress={handlePress} disable={disable} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: 'black',
    },
    description: {
        fontSize: wp(3),
        color: 'grey',
    },
});
