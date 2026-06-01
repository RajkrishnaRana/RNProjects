import {ImageSourcePropType, StyleSheet, Text, View, Image, Dimensions, ImageStyle, StyleProp} from 'react-native';
import React from 'react';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {isTab} from '../utils/isTab';

interface CarouselDataType {
    id: number;
    img: ImageSourcePropType;
    header: string;
    subHeader: string;
    description: string;
}

interface Props {
    item: CarouselDataType;
    index: number;
    scrollX: SharedValue<number>;
    customImgStyle?: StyleProp<ImageStyle>;
}

export default function SlideItem({item, index, scrollX, customImgStyle}: Props) {
    const {width} = Dimensions.get('screen');

    // const rnAnimatedStyle = useAnimatedStyle(() => {
    //   return {
    //     transform: [
    //       {
    //         translateX: interpolate(
    //           scrollX.value,
    //           [(index - 1) * width, index * width, (index + 1) * width],
    //           [-width * 0.25, 0, width * 0.25],
    //           Extrapolation.CLAMP,
    //         ),
    //       },
    //       {
    //         scale: interpolate(
    //           scrollX.value,
    //           [(index - 1) * width, index * width, (index + 1) * width],
    //           [0.8, 1, 0.8],
    //           Extrapolation.CLAMP,
    //         ),
    //       },
    //     ],
    //   };
    // });

    return (
        <Animated.View style={[{width: width, alignItems: 'center'}]}>
            <Image source={item.img} style={[styles.imgStyle, customImgStyle]} />

            {/* <Text style={styles.subHeaderText}>{item.header}</Text>
      <Text style={styles.headerText}>{item.subHeader}</Text>
      <Text style={styles.descriptionText}>{item.description}</Text> */}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    imgStyle: {
        width: isTab ? wp(40) : wp(65),
        height: isTab ? wp(80) : wp(100),
        borderWidth: 1,
        marginTop: hp(5),
    },
    subHeaderText: {
        color: colors.lightBlack,
        fontSize: wp(5),
        fontWeight: 'bold',
    },
    headerText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: wp(6),
        paddingBottom: hp(2),
    },
    descriptionText: {
        color: colors.darkGrey,
        fontSize: wp(3.5),
        paddingHorizontal: wp(10),
        textAlign: 'center',
    },
});
