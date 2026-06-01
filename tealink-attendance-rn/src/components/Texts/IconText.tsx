import { Image, ImageSourcePropType, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import { wp } from '../../utils/dimesion';

interface Props {
    image?: boolean;
    title: string | number;
    icon: React.ReactNode | ImageSourcePropType;
    customStyle?: StyleProp<ViewStyle>;
}

export default function IconText({ image = false, title, icon, customStyle }: Props) {
    return (
        <View style={[customStyle, styles.container]}>
            {image ? <Image source={icon as ImageSourcePropType} style={styles.img} /> : (icon as React.ReactNode)}
            <Text style={styles.iconText}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    iconText: {
        fontSize: wp(3.2),
        fontWeight: 'bold',
        color: colors.green,
    },
    img: {
        height: wp(4),
        width: wp(4),
        tintColor: colors.darkGrey,
    },
});
