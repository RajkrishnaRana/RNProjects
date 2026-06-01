import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSyncing: false,
    syncPercentage: 100,
    pendingCount: 0,
};

const syncSlice = createSlice({
    name: 'sync',
    initialState,
    reducers: {
        setSyncing: (state, action) => {
            state.isSyncing = action.payload;
        },
        setSyncPercentage: (state, action) => {
            state.syncPercentage = action.payload;
        },
        setPendingCount: (state, action) => {
            state.pendingCount = action.payload;
        },
    },
});

export const { setSyncing, setSyncPercentage, setPendingCount } = syncSlice.actions;
export default syncSlice.reducer;
