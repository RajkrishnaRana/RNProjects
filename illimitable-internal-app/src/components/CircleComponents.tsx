import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, {FadeInDown, useAnimatedProps, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';
import {useEffect} from 'react';
import AnimateableText from 'react-native-animateable-text';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    percentage: number;
    color: string;
    children?: React.ReactNode;
    textValue: number;
    leaveBalanceOrNot?: boolean;
    customTextStyle?: StyleProp<TextStyle>;
    left: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size,
    strokeWidth,
    percentage,
    color,
    children,
    textValue,
    leaveBalanceOrNot = false,
    customTextStyle,
    left,
}) => {
    const isFloat = Number.isFinite(left) && !Number.isInteger(left);
    // console.log('percentage', percentage);
    // Validate props
    if (!size || size <= 0 || !strokeWidth || strokeWidth <= 0 || isNaN(percentage)) {
        return null; // Render nothing if props are invalid
    }

    const radius = (size - strokeWidth) / 2.1;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(percentage / 100, {duration: 1500});
        return () => {
            // Reset or cancel the animation on unmount
            progress.value = 0; // Reset to initial value
        };
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    const progressText = useDerivedValue(() => {
        const raw = textValue * progress.value; // e.g. 5.5
        return isFloat ? raw.toFixed(1) : raw.toFixed(0); // "5.5", "2.0", "0.5"
    });

    return (
        <View
            style={{
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red',
            }}>
            <Svg width={size} height={size}>
                <Circle stroke="#E6E6E6" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
                <AnimatedCircle
                    stroke={color}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                    animatedProps={animatedProps}
                />
            </Svg>
            <Animated.View style={styles.circleContent} entering={FadeInDown.springify()}>
                {/* <Text style={styles.balanceNumber}>{textValue}</Text> */}
                {/* {children} */}
                <AnimateableText text={progressText as any} style={customTextStyle || styles.balanceNumber} />
                {leaveBalanceOrNot && <Text style={styles.balanceText}>Leave Balance</Text>}
            </Animated.View>
        </View>
    );
};

interface SmallCircularProgress {
    data?: any;
    size: number;
    maxCount: number;
    days: number;
    title: string;
    strokeWidth?: number;
    percentage?: number;
    color: string;
    children?: React.ReactNode;
}

export const SmallCircularProgress: React.FC<SmallCircularProgress> = ({maxCount, size, days, color, title}) => {
    // if (isNaN(maxCount) || isNaN(days)) {
    //     return null; // Render nothing if data is invalid
    // }
    // console.log('maxCount', maxCount, 'days', days);
    const left = Math.max((maxCount ?? 0) - (days ?? 0), 0);
    const pct = maxCount === 0 ? 0 : (left / maxCount) * 100;

    return (
        <View style={styles.smallCircleContainer}>
            <CircularProgress size={size} strokeWidth={4} percentage={pct} color={color} textValue={Number(maxCount)} left={Number(left)} />
            <Text style={styles.smallCircleTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mainCircleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginVertical: hp(1.5),
    },
    circleContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallCircleContainer: {
        alignItems: 'center',
    },
    smallCircleValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    smallCircleTitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        textAlign: 'center',
    },
    balanceNumber: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
    },
    balanceText: {
        fontSize: wp(3.5),
        color: '#888',
    },
});
