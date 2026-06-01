import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type Handler = (isForeground: boolean) => void;

export const useAppForeground = (onChange: Handler) => {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
            if (next === 'active' && appState.current !== 'active') {
                appState.current = next;
                onChange(true); // ← foreground
            } else if (next === 'background' && appState.current === 'active') {
                appState.current = next;
                onChange(false); // ← background
            }
        });
        return () => sub.remove();
    }, [onChange]);
};
