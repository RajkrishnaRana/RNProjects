import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';

export default function ListEmptyComponent({
    customText,
    customStyle,
    image,
    imageStyle,
}: {
    customText?: string;
    customStyle?: StyleProp<ViewStyle>;
    image?: ImageSourcePropType;
    imageStyle?: StyleProp<ImageStyle>;
}) {
    return (
        <View style={[styles.container, customStyle]}>
            {image && <Image source={image} style={imageStyle} />}
            <Text style={styles.text}>{customText || 'No appointments found for the date range'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: { color: colors.darkGrey, marginTop: 10 },
});
