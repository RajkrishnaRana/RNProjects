import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const checkInternet = async () => {
    try {
        // Create a timeout promise that rejects after 3000ms
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 3000);
        });

        // Race the fetch call against the timeout
        const response = await Promise.race([fetch('https://8.8.8.8', { method: 'HEAD' }), timeoutPromise]);

        // Type guard to ensure response is a Response object
        if (response instanceof Response) {
            return response.ok;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const OfflineRibbon = ({ onNavigationChange }: any) => {
    const [isConnected, setIsConnected] = useState(true);
    const [showRibbon, setShowRibbon] = useState(false);

    useEffect(() => {
        const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
            const hasInternet = state.isConnected ? await checkInternet() : false;
            setIsConnected(hasInternet);
            setShowRibbon(!hasInternet);
        });

        // Initial check
        checkInternet().then(isOnline => {
            setIsConnected(isOnline);
            setShowRibbon(!isOnline);
        });

        return () => {
            unsubscribeNetInfo();
        };
    }, [onNavigationChange, isConnected]);

    const handleDismiss = () => {
        setShowRibbon(false);
    };

    if (!showRibbon) return null;

    return (
        <Animated.View style={styles.ribbon} entering={SlideInDown} exiting={SlideOutDown}>
            <Text style={styles.text}>You are offline</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
                <Ionicons name="close" size={wp(5)} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    ribbon: {
        position: 'absolute',
        bottom: 10,
        marginHorizontal: 8,
        width: width - 16,
        borderRadius: 15,
        backgroundColor: '#ff4444',
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    text: {
        color: '#fff',
        fontSize: wp(3.5),
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
});

export default OfflineRibbon;
