import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { getTimezoneOffset } from '../../utils/dateHelper';
import { logoutSession } from '../../store/slices/sessionSlice';
import { stopOfflineWatcher } from '../../store/thunks/syncThunk';

export default function TimezoneWatcher() {
    const dispatch = useAppDispatch();
    const { lastVerifiedTimezoneOffset } = useAppSelector(state => state.auth);
    const appState = useRef(AppState.currentState);

    // Prevent duplicate alerts if multiple triggers fire in quick succession
    const alertShownRef = useRef(false);

    const onTimezoneChanged = useCallback(() => {
        // Only show alert once per session change
        if (alertShownRef.current) return;
        alertShownRef.current = true;

        Alert.alert(
            'Timezone Changed',
            'Your timezone is different from the last verified session. Please log in again for security.',
            [
                {
                    text: 'LOGOUT',
                    onPress: () => {
                        dispatch(logoutSession());
                        dispatch(stopOfflineWatcher());
                    },
                },
            ],
            { cancelable: false },
        );
    }, [dispatch]);

    // 🔍 Helper to check offset and trigger alert if mismatched
    const verifyTimezoneOffset = useCallback(() => {
        // Only perform check if we have a stored offset to compare against
        if (lastVerifiedTimezoneOffset === undefined || lastVerifiedTimezoneOffset === null) {
            return;
        }

        const currentOffset = getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone);

        if (currentOffset !== lastVerifiedTimezoneOffset) {
            onTimezoneChanged();
        }
    }, [lastVerifiedTimezoneOffset, onTimezoneChanged]);

    // 1️⃣ Initial check when component mounts (app starts)
    useEffect(() => {
        verifyTimezoneOffset();
    }, [verifyTimezoneOffset]);

    // 2️⃣ Check when app returns from background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextState === 'active') {
                verifyTimezoneOffset();
            }
            appState.current = nextState;
        });

        return () => subscription.remove();
    }, [verifyTimezoneOffset]);

    // Reset alert flag when offset changes (e.g., after logout/login)
    useEffect(() => {
        alertShownRef.current = false;
    }, [lastVerifiedTimezoneOffset]);

    return null;
}
