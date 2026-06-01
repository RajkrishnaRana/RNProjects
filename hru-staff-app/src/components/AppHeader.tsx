import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface Props {
    title: string;
}

export default function AppHeader({title}: Props) {
    return (
        <View>
            <Text>AppHeader</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
