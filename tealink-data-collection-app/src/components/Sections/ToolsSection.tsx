import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../../utils/dimension';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../common/colors';
import Animated, { LinearTransition, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useTools } from '../../hooks/useTools';
import { useNavigation } from '../../hooks/useNavigation';
import DropdownOptionsCard from '../Cards/DropdownOptionsCard';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFontAwesomeIcon = Animated.createAnimatedComponent(FontAwesomeIcon);

export default function ToolsSection({ activeRoute }: { activeRoute: string }) {
    const navigation = useNavigation();
    const { dropdown, animatedIconStyle, toggleRotation } = useTools();

    return (
        <Animated.View style={styles.container} layout={LinearTransition.springify().damping(20)}>
            {/* Tools Section Header */}
            <AnimatedTouchableOpacity onPress={toggleRotation} style={styles.toolsContainer}>
                <View style={styles.header}>
                    <FontAwesome6Icon name="gears" size={wp(5)} color={colors.green} />
                    <Text style={styles.heading}>Tools</Text>
                </View>
                <AnimatedFontAwesomeIcon name="chevron-down" size={wp(3.5)} color={colors.green} style={animatedIconStyle} />
            </AnimatedTouchableOpacity>

            {/* Tools Option */}
            {dropdown && (
                <View style={{ marginTop: hp(1) }}>
                    <DropdownOptionsCard
                        activeRoute={activeRoute === 'MeasureDistance'}
                        title="Measure Distance"
                        navigation={() => navigation.navigate('Drawer', { screen: 'MeasureDistance' })}
                    />
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: hp(2),
        backgroundColor: '#e0f9e6ff',
        borderTopRightRadius: wp(3),
        borderBottomRightRadius: wp(3),
    },
    toolsContainer: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        paddingLeft: wp(2),
        gap: wp(2),
    },
    heading: {
        fontSize: wp(4),
        color: colors.green,
        fontWeight: '600',
    },
});
