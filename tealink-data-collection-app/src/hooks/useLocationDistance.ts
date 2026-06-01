import { useMemo, useRef, useState } from 'react';
import { locationServices } from '../services/locationServices';

interface Location {
    latitude: number;
    longitude: number;
}

export const useLocationDistance = () => {
    const [start, setStart] = useState<Location>();
    const [end, setEnd] = useState<Location>();
    const [finalEnd, setFinalEnd] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const watchIdRef = useRef<number | null>(null);

    const { measureDistance, watchLocation, clearLocation } = locationServices;

    const handleLocationPress = async () => {
        await watchLocation(isWatching, watchIdRef, setIsWatching, setLoading, setStart, setEnd, setFinalEnd);
    };

    const clearLocations = () => {
        clearLocation(watchIdRef);
        setStart(undefined);
        setEnd(undefined);
        setIsWatching(false);
        setFinalEnd(false);
    };

    const distance = useMemo(() => {
        if (!start || !end) return '0.000';
        console.log({ start, end });
        return measureDistance(start, end);
    }, [start, end, measureDistance]);

    return {
        start,
        end,
        finalEnd,
        loading,
        distance,
        clearLocations,
        handleLocationPress,
    };
};
