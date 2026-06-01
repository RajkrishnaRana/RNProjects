import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';

export default function GreenGradientBackground({ children, customStyle }: { children: React.ReactNode; customStyle?: StyleProp<ViewStyle> }) {
    return (
        <LinearGradient
            colors={[colors.lightGreenShade, colors.lightGreenShade, colors.darkGreenShade]}
            start={{ x: 0.0, y: 0 }}
            end={{ x: 0, y: 1.0 }}
            useAngle
            angle={150}
            style={customStyle}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({});
