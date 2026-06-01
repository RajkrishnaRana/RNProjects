import { useRef, useEffect, useCallback } from 'react';

type Timer = ReturnType<typeof setTimeout>;

export const useDebounce = <T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    const timeoutRef = useRef<Timer | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};