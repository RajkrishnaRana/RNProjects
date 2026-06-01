import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

interface BigButtonProps {
    onPress: () => void;
    title: string | React.ReactNode;
    loading?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    customTextStyle?: StyleProp<TextStyle>;
}

function BigButton({
    onPress,
    title,
    loading,
    customStyle,
    customTextStyle,
}: BigButtonProps) {
    return (
        <AnimatedTouchableOpacity
            // entering={FadeInDown.duration(300).springify()}
            // exiting={FadeOut.duration(300)}
            style={[styles.loginButton, customStyle]}
            disabled={loading}
            onPress={onPress}>
            {loading ? (
                <ActivityIndicator color={colors.white} size={wp(6)} />
            ) : React.isValidElement(title) ? (
                <>{title}</>
            ) : (
                <Text
                    style={[
                        {
                            color: colors.white,
                            fontSize: wp(5),
                            fontWeight: '700',
                        },
                        customTextStyle,
                    ]}>
                    {title}
                </Text>
            )}
        </AnimatedTouchableOpacity>
    );
}

export default memo(BigButton);

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: hp(7),
        paddingVertical: hp(1.5),
    },
});
