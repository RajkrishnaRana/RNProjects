import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    loginID: string;
    passWord: string;
    userData: any;
    baseURL: string;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    loginID: '',
    passWord: '',
    userData: null, // <- will hold the login response object
    baseURL: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.userData = action.payload.userData;
            state.loginID = action.payload.loginId;
            state.passWord = action.payload.password;
        },
        logout: state => {
            state.isAuthenticated = false;
            state.userData = null;
        },
        setBaseURL: (state, action) => {
            state.baseURL = action.payload;
        },
    },
});

export const { loginSuccess, logout, setBaseURL } = authSlice.actions;
export default authSlice.reducer;
