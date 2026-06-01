import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function BlurryImageBackground({ children, customBlur }: { children: React.ReactNode; customBlur?: number }) {
    return (
        <ImageBackground
            source={require('../../assets/images/tealink-login.png')}
            resizeMode="cover"
            style={{ flex: 1 }}
            blurRadius={customBlur || 10}
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({});
