import {
    ListRenderItem,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    ViewToken,
} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import Animated, {
    SharedValue,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import {FlatList} from 'react-native';
import Pagination from './Pagination';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Props {
    data: any;
    paginationAvailable?: boolean;
    customContainerStyle?: StyleProp<ViewStyle>;
    scrollX: SharedValue<number>;
    renderItem:
        | ListRenderItem<any>
        | SharedValue<ListRenderItem<any> | null | undefined>
        | null
        | undefined;
}

export default function AnimatedFlatlist({
    data,
    customContainerStyle,
    paginationAvailable,
    renderItem,
    scrollX,
}: Props) {
    const flatListRef = useRef<FlatList>(null);

    const [paginationIndex, setPaginationIndex] = useState(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            scrollX.value = e.contentOffset.x;
        },
    });

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: ViewToken[];
    }) => {
        if (viewableItems.length > 0) {
            if (
                viewableItems[0].index !== null &&
                viewableItems[0].index !== undefined
            ) {
                setPaginationIndex(viewableItems[0].index);
                const index = viewableItems[0].index;
            }
        }
    };

    const viewabilityConfigCallbackPairs = useRef([
        {viewabilityConfig, onViewableItemsChanged},
    ]);

    return (
        <>
            <Animated.FlatList
                ref={flatListRef}
                contentContainerStyle={styles.doctorListContainer}
                data={data}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="start"
                onScroll={onScrollHandler}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
            />

            {paginationAvailable && (
                <Pagination
                    data={data}
                    scrollX={scrollX}
                    paginationIndex={paginationIndex}
                    customContainerStyle={styles.paginationContainer}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    doctorListContainer: {
        flexGrow: 1,
        marginTop: hp(2),
        paddingBottom: hp(1),
    },
    paginationContainer: {
        marginTop: hp(1.5),
        position: 'static',
    },
});
