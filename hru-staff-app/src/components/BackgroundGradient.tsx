import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function BackgroundGradient({
    children,
    customStyle,
}: {
    children: React.ReactNode;
    customStyle?: StyleProp<ViewStyle>;
}) {
    return (
        <LinearGradient
            colors={['white', '#d0ece7', '#d0ece7']}
            style={[{flex: 1}, customStyle]}
            start={{x: 0, y: 0}}
            end={{x: 3, y: 1}}>
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({});
