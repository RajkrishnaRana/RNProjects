// BirthdayCheer.tsx
import React, {useEffect, useImperativeHandle, forwardRef, useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export interface BirthdayCheerRef {
    show: () => void;
}

type Props = {name?: string};

export const BirthdayCheer = forwardRef<BirthdayCheerRef, Props>((props, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({show: () => setVisible(true)}), []);

    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => setVisible(false), 5000); // exactly 3 s
        return () => clearTimeout(t);
    }, [visible]);

    // extract first-name (everything before first space)
    const firstName = props.name?.split(' ')[0] ?? 'there';

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.outer}>
                {/* Confetti behind the text */}
                <LottieView source={require('../assets/Lottie/confetti.json')} autoPlay loop style={StyleSheet.absoluteFillObject} />

                {/* Cheerful birthday text */}
                <View style={styles.card}>
                    <Text style={styles.title}>🎉 Happy Birthday, {firstName}! 🎂</Text>
                    <Text style={styles.sub}>Wishing you an amazing year ahead 🥳</Text>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)', // transparent dim
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 32,
        paddingVertical: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    title: {fontSize: wp(5), fontWeight: 'bold', color: '#ff3b81', marginBottom: 6},
    sub: {fontSize: wp(4), color: '#555'},
});
