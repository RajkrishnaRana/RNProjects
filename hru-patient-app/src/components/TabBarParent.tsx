import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CustomTabBar from '../routes/CustomNavigations/CustomTabBar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuthStore } from '../store/authStore';
import { isTab } from '../utils/isTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIos } from '../utils/platform';

export default function TabBarParent({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
    const insets = useSafeAreaInsets();

    const marginBottom = useMemo(() => {
        if (!isAuthenticated) {
            return 0;
        }
        const tabBarHeight = isTab ? hp(4.6) : isIos() ? hp(5) : hp(7.5);
        return tabBarHeight + insets.bottom;
    }, [isAuthenticated, insets.bottom]);

    return (
        <>
            <View style={[styles.container, { marginBottom }]}>{children}</View>
            {isAuthenticated && <CustomTabBar />}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
