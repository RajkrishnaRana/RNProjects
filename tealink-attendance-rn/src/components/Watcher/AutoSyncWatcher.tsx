import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/typedReduxHooks';
import { startOfflineWatcher, stopOfflineWatcher } from '../../store/thunks/syncThunk';

export const AutoSyncWatcher = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(startOfflineWatcher());
        return () => dispatch(stopOfflineWatcher());
    }, [dispatch]);

    return null;
};
