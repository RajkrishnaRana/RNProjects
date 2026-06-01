import {FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors} from '../common/colors';
import {CarouselData} from '../constants/CarouselData';
import SlideItem from '../components/SlideItem';
import Pagination from '../components/Pagination';
import BigButton from '../components/BigButton';
import {useNavigation} from '../hooks/useNavigation';
import Animated, {
    AnimatedStyle,
    Easing,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useStartupCarousalStore} from '../store/startupCarousalStore';
import {isTab} from '../utils/isTab';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function StartupCarousalScreen() {
    const setIsFirstTimeAppOpen = useStartupCarousalStore(state => state.setIsFirstTimeAppOpen);

    const navigation = useNavigation();
    const scrollX = useSharedValue(0);
    const buttonWidth = useSharedValue(isTab ? '30%' : '50%');
    const buttonText = useSharedValue('Next');
    const [buttonTextState, setButtonTextState] = useState('Next');
    const buttonYOffset = useSharedValue(0);

    const flatListRef = useRef<FlatList>(null); // Create a ref for the FlatList

    const [paginationIndex, setPaginationIndex] = useState(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            scrollX.value = e.contentOffset.x;
        },
    });

    const onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]}) => {
        if (viewableItems.length > 0) {
            if (viewableItems[0].index !== null && viewableItems[0].index !== undefined) {
                setPaginationIndex(viewableItems[0].index);
                const index = viewableItems[0].index;
                if (index === CarouselData.length - 1) {
                    // When the last page is reached
                    buttonWidth.value = withTiming(isTab ? '50%' : '90%', {
                        duration: 300,
                        easing: Easing.out(Easing.ease),
                    });
                    buttonText.value = 'Get Started';
                    buttonYOffset.value = withTiming(hp(5), {duration: 500}); // Shift down
                } else {
                    // Reset to initial state
                    buttonWidth.value = withTiming(isTab ? '30%' : '50%', {
                        duration: 300,
                        easing: Easing.out(Easing.ease),
                    });
                    buttonText.value = 'Next';
                    buttonYOffset.value = withTiming(0, {duration: 500}); // Reset position
                }
            }
        }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const viewabilityConfigCallbackPairs = useRef([{viewabilityConfig, onViewableItemsChanged}]);

    const handleNextPress = () => {
        const nextIndex = paginationIndex + 1;
        if (nextIndex < CarouselData.length) {
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        } else {
            navigation.replace('Home');
            setIsFirstTimeAppOpen();
        }
    };

    const animatedButtonStyle = useAnimatedStyle<any>(() => {
        return {
            width: buttonWidth.value,
            transform: [{translateY: buttonYOffset.value}],
        };
    });

    useDerivedValue(() => {
        runOnJS(setButtonTextState)(buttonText.value);
    });

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}>
            <Animated.FlatList
                ref={flatListRef} // Attach the ref to the FlatList
                data={CarouselData}
                renderItem={({item, index}) => <SlideItem item={item} index={index} scrollX={scrollX} customImgStyle={styles.img} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                onScroll={onScrollHandler}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
            <Pagination data={CarouselData} scrollX={scrollX} paginationIndex={paginationIndex} customContainerStyle={styles.pagination} />

            <View
                style={{
                    marginBottom: hp(2),
                    paddingHorizontal: wp(1.5),
                    alignItems: 'center',
                }}>
                <AnimatedTouchableOpacity style={[styles.buttonContainer, animatedButtonStyle]} onPress={handleNextPress}>
                    <Text style={styles.buttonText}>{buttonTextState}</Text>
                </AnimatedTouchableOpacity>
                {paginationIndex !== CarouselData.length - 1 && (
                    <BigButton
                        onPress={() => {
                            navigation.replace('Home');
                            setIsFirstTimeAppOpen();
                        }}
                        title="Skip"
                        customStyle={styles.skipButton}
                        customTextStyle={{color: colors.primary, fontSize: isTab ? wp(2.5) : wp(4)}}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    skipButton: {
        marginTop: isTab ? 0 : 10,
        marginBottom: 10,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
        width: isTab ? '30%' : '50%',
    },
    img: {
        width: isTab ? wp(60) : wp(80),
        height: isTab ? wp(70) : wp(90),
        borderWidth: 0,
        marginTop: hp(20),
        marginBottom: hp(8),
    },
    buttonContainer: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: hp(1.5),
        position: 'absolute',
        bottom: hp(9),
    },
    buttonText: {color: colors.white, fontSize: isTab ? wp(2.5) : wp(5), fontWeight: '700'},
    pagination: {
        bottom: hp(20),
    },
});
