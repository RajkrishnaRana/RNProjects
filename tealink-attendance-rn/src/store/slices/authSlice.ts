import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    deviceName: string | null;
    userData: UserProfile | null;
    baseURL: string | null;
    userName: string | null;
    password: string | null;
    deviceId: string | null;
    authenticationTime: number | null;
    imageMandatory: boolean;
    disableManualEntry: boolean;
    showMarkOut: boolean;
    batchSameAsDevice: boolean;
    pluckingBatchwise: boolean;
    defaultKamjariFlow: boolean;
    lastSyncTime: string;
    lastVerifiedTimezoneOffset: number;
    lastVerifiedTimezone: string;
}

const initialState: AuthState = {
    deviceName: null,
    userData: null, // <- will hold the login response object
    baseURL: null,
    userName: null,
    password: null,
    deviceId: null,
    authenticationTime: null,
    imageMandatory: false,
    disableManualEntry: false,
    showMarkOut: false,
    batchSameAsDevice: false,
    pluckingBatchwise: false,
    defaultKamjariFlow: false,
    lastSyncTime: '',
    lastVerifiedTimezoneOffset: 0,
    lastVerifiedTimezone: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.userData = null;
        },
        setBaseURL: (state, action) => {
            state.baseURL = action.payload;
        },
        setOfflineInformation: (state, action) => {
            state.authenticationTime = action.payload.authenticationTime;
            state.deviceId = action.payload.deviceId;
        },
        setUserInformation: (state, action) => {
            state.deviceName = action.payload.deviceName;
            state.userData = action.payload.userData;
            state.userName = action.payload.userName;
            state.deviceId = action.payload.deviceId;
            state.authenticationTime = action.payload.authenticationTime;
            state.password = action.payload.password;
            state.lastVerifiedTimezoneOffset = action.payload.lastVerifiedTimezoneOffset;
            state.lastVerifiedTimezone = action.payload.lastVerifiedTimezone;
            state.imageMandatory = action.payload.gardenConfig.imageMandatory ?? false;
            state.disableManualEntry = action.payload.gardenConfig.disableManualEntry ?? false;
            state.showMarkOut = action.payload.gardenConfig.showMarkOut ?? false;
            state.batchSameAsDevice = action.payload.gardenConfig.batchSameAsDevice ?? false;
            state.pluckingBatchwise = action.payload.gardenConfig.pluckingBatchwise ?? false;
            state.defaultKamjariFlow = action.payload.gardenConfig.defaultKamjariFlow ?? false;
        },
        setLastSyncTime: (state, action) => {
            state.lastSyncTime = action.payload;
        },
    },
});

export const { logout, setBaseURL, setUserInformation, setOfflineInformation, setLastSyncTime } = authSlice.actions;
export default authSlice.reducer;
