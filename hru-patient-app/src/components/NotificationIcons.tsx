import { Image, ImageProps, StyleSheet, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import { isTab } from '../utils/isTab';
import { isIos } from '../utils/platform';

interface NotificationIconsProps {
    bgColor: string;
    src: ImageProps;
}

export default function NotificationIcons({ bgColor, src }: NotificationIconsProps) {
    const backgroundColor = bgColor || colors.primary;
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image
                source={src}
                style={{ height: isTab ? wp(2) : isIos() ? 18 : wp(3), width: isTab ? wp(2) : isIos() ? 18 : wp(3) }}
                tintColor={colors.white}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: isTab ? wp(5) : wp(8),
        width: isTab ? wp(5) : wp(8),
        borderRadius: wp(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
