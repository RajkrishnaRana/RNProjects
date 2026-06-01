import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {isTab} from '../../utils/isTab';

const CustomRating = ({
    maxRating = 5,
    onRatingChange,
    prevRating, // New prop for previous rating
    customStartSize = isTab ? wp(2.5) : wp(4.5),
    customColor = colors.primary,
}: {
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    prevRating?: number; // New prop
    customStartSize?: number;
    customColor?: string;
}) => {
    const [rating, setRating] = useState(prevRating || 0);
    const scaleValues = Array.from({length: maxRating}, () => useSharedValue(1)); // Shared values for each star

    // To set the coming rating
    useEffect(() => {
        if (prevRating !== undefined) {
            setRating(prevRating);
        }
    }, [prevRating]);

    const handlePress = (index: number) => {
        if (prevRating !== undefined) return; // Prevent interaction if prevRating exists

        setRating(index);
        if (onRatingChange) {
            onRatingChange(index);
        }

        // Trigger bounce animation
        scaleValues[index - 1].value = 1.75;
        setTimeout(() => {
            scaleValues[index - 1].value = 1;
        }, 200);
    };

    return (
        <View style={styles.ratingContainer}>
            {Array.from({length: maxRating}, (_, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    transform: [{scale: withSpring(scaleValues[index].value)}],
                }));

                return (
                    <TouchableWithoutFeedback key={index} onPress={() => handlePress(index + 1)} disabled={prevRating !== undefined}>
                        <Animated.View style={animatedStyle}>
                            <Icon name={index < rating ? 'star' : 'staro'} size={customStartSize} color={customColor} style={styles.star} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
    },
    star: {
        marginRight: 6,
    },
});

export default CustomRating;
