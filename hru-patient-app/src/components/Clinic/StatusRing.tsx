import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const StatusRing = ({images, size = 100, thickness = 3, gap = 3}) => {
    const count = images.length;
    const section = (360 - gap * count) / count; // degrees per section

    return (
        <View style={[styles.container, {width: size, height: size}]}>
            {images.map((uri, i) => {
                const rotate = i * (section + gap);
                return (
                    <View
                        key={i}
                        style={[
                            styles.section,
                            {
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                borderWidth: thickness,
                                borderColor: '#25D366',
                                // borderTopColor: '#25D366', // colour only the wanted arc
                                transform: [{rotate: `${rotate}deg`}],
                            },
                        ]}
                    />
                );
            })}

            {/* photo inside the ring */}
            {/* <Image source={{uri: images[0]}} style={[styles.img, {width: size - 2 * thickness}]} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    section: {position: 'absolute'},
    img: {
        borderRadius: 999,
        // backgroundColor: '#fff',
        height: '100%',
    },
});

export default StatusRing;
