import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import GreenGradientBackground from '../Backgrounds/GreenGradientBackground';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import { hp, wp } from '../../utils/dimesion';

interface Props {
    title: string;
    description: string;
    children?: React.ReactNode;
    customFunc?: () => void;
    customSecondFunc?: () => void;
}

export default function StackHeader({ title, description, children, customFunc, customSecondFunc }: Props) {
    const navigation = useNavigation();
    const onPress = () => {
        customFunc && customFunc();
        customSecondFunc && customSecondFunc();
        navigation.goBack();
    };

    return (
        <GreenGradientBackground>
            <View style={styles.statusBar} />
            <StatusBar animated={true} backgroundColor="transparent" translucent={true} hidden={false} barStyle="light-content" />

            {/* Drawer Menu and Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.menuIconContainer} onPress={onPress}>
                    <Lucide name="arrow-left" size={18} color={colors.white} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerText}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>

            {/* Custom Component */}
            {children && children}
        </GreenGradientBackground>
    );
}

const styles = StyleSheet.create({
    statusBar: { height: StatusBar.currentHeight ?? hp(5), backgroundColor: 'rgba(0,0,0,0.2)' },
    headerContainer: {
        marginTop: 10,
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        gap: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    menuIconContainer: {
        padding: 6,
        backgroundColor: colors.transparentWhiteBackground,
        borderRadius: 9,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    description: {
        fontSize: 10,
        color: colors.white,
    },
});
