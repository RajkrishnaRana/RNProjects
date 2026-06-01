import { FlatList, ListRenderItem, StyleSheet, Text, ViewToken } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated, { SharedValue, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Pagination from '../components/Pagination';
import { isIos } from '../utils/platform';
import { isTab } from '../utils/isTab';

interface Props {
    data: any;
    customRatingColor?: string;
    emptyListText?: string;
    autoScrollEnabled?: boolean;
    renderItem: ListRenderItem<any> | SharedValue<ListRenderItem<any> | null | undefined> | null | undefined;
    paginationBlocked?: boolean;
    pagingEnabled?: boolean;
}

export default function HorizontalList({
    data,
    renderItem,
    customRatingColor,
    emptyListText,
    autoScrollEnabled = false,
    paginationBlocked = false,
    pagingEnabled = true,
}: Props) {
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);

    // LOCAL STATES ------------------------------------------------------->
    const [paginationIndex, setPaginationIndex] = useState(0);

    // SETUP FOR ANIMATED PAGINATION -------------------------------------->
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            scrollX.value = e.contentOffset.x;
        },
    });

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            if (viewableItems[0].index !== null && viewableItems[0].index !== undefined) {
                setPaginationIndex(viewableItems[0].index);
            }
        }
    };

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

    // AUTO-SCROLL LOGIC -------------------------------------------------->
    useEffect(() => {
        if (!autoScrollEnabled || !data || data?.length <= 1) return; // Don't auto-scroll if disabled or insufficient items

        const interval = setInterval(() => {
            let nextIndex = paginationIndex + 1;
            if (nextIndex >= data?.length) {
                nextIndex = 0; // Loop back to the first item
            }
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, 7000); // 10 seconds

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [autoScrollEnabled, paginationIndex, data?.length]);

    return (
        <>
            <Animated.FlatList
                ref={flatListRef}
                contentContainerStyle={styles.doctorListContainer}
                data={data}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={pagingEnabled}
                snapToAlignment="start"
                onScroll={onScrollHandler}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                ListEmptyComponent={<Text>{emptyListText || 'No data found'}</Text>}
                decelerationRate={isIos() ? 0.1 : 0.7}
            />

            {!paginationBlocked && (
                <Pagination
                    data={data}
                    paginationIndex={paginationIndex}
                    scrollX={scrollX}
                    customContainerStyle={styles.paginationContainer}
                    customColor={customRatingColor}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    doctorListContainer: {
        flexGrow: 1,
        marginTop: isTab ? hp(1) : hp(2),
        paddingBottom: hp(1),
    },
    paginationContainer: {
        // marginTop: isTab ? hp(1) : hp(1.5),
        position: 'static',
    },
});
