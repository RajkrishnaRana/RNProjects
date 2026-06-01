import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../common/colors';
import { android_ripple_value } from '../../constants/screenOptions';

interface Props {
    title: string;
    description?: string;
    navigation?: any;
    customIcon?: React.ReactNode;
    customIconContainerColor?: string;
    cutomDescriptionTextColor?: string;
    customTextColor?: string;
}

export default function SectionIconHeader({
    title,
    description,
    navigation,
    customIcon,
    customIconContainerColor,
    customTextColor,
    cutomDescriptionTextColor,
}: Props) {
    return (
        <View style={styles.headerContainer}>
            <Pressable
                android_ripple={android_ripple_value}
                style={[styles.menuIconContainer, { backgroundColor: customIconContainerColor || colors.transparentWhiteBackground }]}
                onPress={() => (navigation ? navigation.goBack() : {})}
            >
                {customIcon ? customIcon : <Lucide name="arrow-left" size={18} color={colors.white} />}
            </Pressable>
            <View>
                <Text style={[styles.headerText, { color: customTextColor || colors.white }]}>{title}</Text>
                <Text style={[styles.description, { color: cutomDescriptionTextColor || colors.white }]}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    menuIconContainer: {
        padding: 8,
        borderRadius: 9,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 10,
    },
});
