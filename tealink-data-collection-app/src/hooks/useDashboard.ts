import { useEffect, useState } from 'react';
import { useAppDispatch } from './typedReduxHooks';
import { setFormData } from '../store/slices/formSlice';

export const useDashboard = (data: any) => {
    const dispatch = useAppDispatch();

    // LOCAL STATES ------------->
    const [refreshLoading, setRefreshLoading] = useState(false);

    useEffect(() => {
        dispatch(setFormData(data));
    }, [data]);

    return { refreshLoading, setRefreshLoading };
};
