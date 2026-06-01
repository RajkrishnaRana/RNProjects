// hooks/useRefetchOnFocus.ts
import {useFocusEffect} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';

export function useRefetchOnFocus(queryKey: readonly unknown[]) {
    const queryClient = useQueryClient();

    useFocusEffect(
        useCallback(() => {
            // only refetch if the query is stale
            queryClient.invalidateQueries({queryKey, refetchType: 'active'});
        }, [queryClient, queryKey]),
    );
}
