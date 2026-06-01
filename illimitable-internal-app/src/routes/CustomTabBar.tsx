import {StyleSheet, useWindowDimensions, View} from 'react-native';
import React, {useEffect} from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useLinkBuilder} from '@react-navigation/native';
import {PlatformPressable} from '@react-navigation/elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps) {
    const {buildHref} = useLinkBuilder();
    const insets = useSafeAreaInsets();
    const bottomHeight = {bottom: insets.bottom + hp(1)};

    // 🔹 Track current active index (animated)
    // const activeIndex = useSharedValue(state.index);

    // 🔹 Ref to measure tab container (optional, but more robust)
    // For simplicity, we'll assume equal spacing
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const TAB_COUNT = state.routes.length;
    const CONTAINER_PADDING = wp(2) * 2; // left + right
    const CONTAINER_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING;
    const TAB_WIDTH = CONTAINER_WIDTH / TAB_COUNT;

    // Compute center x of each tab (relative to container left)
    // const tabCenterX = (index: number) => {
    //     'worklet';
    //     return wp(2) + (index + 0.5) * TAB_WIDTH;
    // };

    // const translateX = useDerivedValue(() => {
    //     const center = activeIndex.value;
    //     return center - wp(6); // center the wp(12) circle
    // });

    // const animatedHighlightStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [{translateX: withTiming(translateX.value, {duration: 250})}],
    //     };
    // });

    // Sync with navigation state
    // useEffect(() => {
    //     activeIndex.value = withTiming(state.index, {duration: 200});
    // }, [state.index, activeIndex]);

    return (
        <View style={[styles.container, bottomHeight]}>
            <BlurView style={styles.blurView} overlayColor="" blurAmount={20} />
            <View style={styles.tabContainer}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const icon = options.tabBarIcon?.({
                        focused: isFocused,
                        color: isFocused ? Colors.WHITE : Colors.PRIMARY,
                        size: wp(5), // Adjust the size as needed
                    });

                    return (
                        <PlatformPressable
                            key={index}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={isFocused ? {selected: true} : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}>
                            <AnimatedGradient
                                colors={isFocused ? [Colors.PRIMARY, Colors.LIGHT_BLUE] : ['transparent', 'transparent']}
                                style={[styles.highlight]}
                            />
                            {icon}
                        </PlatformPressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: wp(2),
        right: wp(2),
        height: hp(8), // Adjust the height as needed
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255, 0.1)',
        paddingVertical: wp(2),
        borderRadius: wp(10), // Make sure the container has rounded corners
        overflow: 'hidden', // Ensure the blur effect respects the rounded corners
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: wp(10), // Rounded corners for the blur view
    },
    tabContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    tabButton: {
        position: 'absolute',
        zIndex: 0,
        top: hp(-1.5),
        right: wp(-3),
        height: wp(12),
        width: wp(12),
        borderRadius: wp(10), // Ensure tab buttons have rounded corners as well
    },
    highlight: {
        position: 'absolute',
        width: wp(12),
        height: wp(12),
        top: hp(-1.6),
        borderRadius: wp(10),
        padding: wp(2),
        left: wp(-3.5),
        // left: 0, // animate from left edge of container
        // zIndex: 0,
    },
});
