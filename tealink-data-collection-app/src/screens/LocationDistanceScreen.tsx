import { ActivityIndicator, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundGradient from '../components/BackgroundGradient';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../utils/dimension';
import { useLocationDistance } from '../hooks/useLocationDistance';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const LocationCard = ({ title, lat, long }: { title: string; lat: number; long: number }) => {
    const openMap = () => {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latLng = `${lat},${long}`;
        const label = title; // optional: label for the pin
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url as string).catch(err => {
            console.error('Failed to open map:', err);
            // Fallback: open in browser (Google Maps)
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
            Linking.openURL(fallbackUrl).catch(e => console.error('Fallback failed:', e));
        });
    };

    return (
        <AnimatedTouchableOpacity style={styles.locationCardContainer} entering={FadeInDown.springify()} exiting={FadeOutDown} onPress={openMap}>
            <Text style={styles.locationCardTitle}>{title}</Text>

            <Image source={require('../assets/Icons/google-maps.png')} style={styles.img} />
        </AnimatedTouchableOpacity>
    );
};

const GradientWrapper = ({ children, style }: { children: React.ReactNode; style?: any }) => {
    return (
        <LinearGradient colors={['#60B864', '#4DB052']} useAngle angle={45} style={style}>
            {children}
        </LinearGradient>
    );
};

export default function LocationDistanceScreen() {
    const { start, end, finalEnd, distance, loading, clearLocations, handleLocationPress } = useLocationDistance();

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <GradientWrapper style={styles.distanceContainer}>
                    <Text style={styles.distance}>{distance}</Text>
                    <Text style={styles.description}>Kilometers</Text>
                </GradientWrapper>

                <TouchableOpacity onPress={start && finalEnd ? clearLocations : handleLocationPress}>
                    <GradientWrapper style={styles.button}>
                        {loading ? (
                            <ActivityIndicator size={wp(10)} color="white" />
                        ) : (
                            <Text style={styles.buttonText}>{start && finalEnd ? 'CLEAR' : start ? 'END' : 'START'}</Text>
                        )}
                    </GradientWrapper>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    {start && <LocationCard title="Start Point" lat={start?.latitude} long={start?.longitude} />}
                    {finalEnd && end && <LocationCard title="End Point" lat={end?.latitude} long={end?.longitude} />}
                </View>
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    button: {
        height: wp(43),
        width: wp(43),
        borderRadius: wp(25),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    buttonText: {
        color: 'white',
        fontSize: wp(6),
        fontWeight: 'bold',
    },
    distanceContainer: {
        height: wp(43),
        width: wp(85),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.06)',
        marginBottom: hp(10),
    },
    distance: {
        color: 'white',
        fontSize: wp(13),
        fontWeight: 'bold',
    },
    description: {
        color: 'white',
        fontSize: wp(5),
        fontWeight: '500',
    },
    locationCardContainer: {
        backgroundColor: 'white',
        padding: wp(3),
        borderRadius: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp(40),
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    locationCardTitle: {
        fontSize: wp(3.5),
        color: 'black',
        fontWeight: '500',
    },
    img: {
        height: wp(6),
        width: wp(6),
    },
    buttonContainer: { flexDirection: 'row', gap: wp(10), marginTop: hp(10) },
});
