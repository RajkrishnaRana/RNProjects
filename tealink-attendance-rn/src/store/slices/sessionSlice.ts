import { createSlice } from '@reduxjs/toolkit';

interface SessionState {
    isAuthenticated: boolean;
}

const initialState: SessionState = {
    isAuthenticated: false,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        logoutSession: state => {
            state.isAuthenticated = false;
        },
        loginSession: (state) => {
            state.isAuthenticated = true;
        },
    },
});

export const { logoutSession, loginSession } = sessionSlice.actions;
export default sessionSlice.reducer;
