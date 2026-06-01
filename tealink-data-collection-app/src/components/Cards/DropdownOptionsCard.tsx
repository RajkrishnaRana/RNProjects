import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../common/colors';
import { hp, wp } from '../../utils/dimension';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const DropdownOptionsCard = ({
    title,
    navigation,
    activeRoute,
    icon,
}: {
    title: string;
    navigation: () => void;
    activeRoute: boolean;
    icon?: React.ReactNode;
}) => {
    return (
        <AnimatedTouchableOpacity
            entering={SlideInLeft.springify().damping(20)}
            exiting={SlideOutLeft.springify().damping(20)}
            onPress={navigation}
            style={[styles.optionContainer, { backgroundColor: activeRoute ? colors.green : 'white' }]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {icon && icon}
                <Text style={[styles.option, { color: activeRoute ? 'white' : 'black' }]}>{title}</Text>
            </View>
            <FontAwesome6Icon name="chevron-right" size={wp(3)} color={activeRoute ? 'white' : colors.black} />
        </AnimatedTouchableOpacity>
    );
};

export default DropdownOptionsCard;

const styles = StyleSheet.create({
    optionContainer: {
        paddingVertical: hp(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: wp(3),
        borderBottomRightRadius: wp(3),
        marginRight: wp(3),
        marginBottom: hp(1),
        paddingHorizontal: wp(3),
    },
    option: {
        fontSize: wp(3.5),
        color: 'black',
        fontWeight: '600',
        maxWidth: wp(42),
    },
});
