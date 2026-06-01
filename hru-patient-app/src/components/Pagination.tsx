import { Dimensions, ImageSourcePropType, StyleProp, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { doctorCardProps } from '../screens/BookAppointmentScreen';
import { ViewStyle } from 'react-native';

interface ItemProps {
    id: number;
    img: ImageSourcePropType;
    header: string;
    description: string;
}

interface Props {
    data: ItemProps[] | doctorCardProps[];
    scrollX: SharedValue<number>;
    paginationIndex: number;
    customContainerStyle?: StyleProp<ViewStyle>;
    customColor?: string;
}

export default function Pagination({ data, scrollX, paginationIndex, customContainerStyle, customColor = colors.primary }: Props) {
    const { width } = Dimensions.get('screen');

    return (
        <View style={[styles.container, customContainerStyle]}>
            {data?.map((item, index) => {
                const pgAnimationStyle = useAnimatedStyle(() => {
                    const dotWidth = interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [7, 14, 7],
                        Extrapolation.CLAMP,
                    );

                    return {
                        width: dotWidth,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index === paginationIndex ? customColor : colors.grey,
                            },
                            pgAnimationStyle,
                        ]}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // bottom: hp(20),
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    dot: {
        width: 7,
        height: 7,
        margin: 5,
        borderRadius: 7,
    },
});
