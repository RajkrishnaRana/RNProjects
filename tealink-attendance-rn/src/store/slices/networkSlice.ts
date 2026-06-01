import { createSlice } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch } from '../index';

interface NetworkState {
    online: boolean;
}

const initialState: NetworkState = {
    online: false,
};

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setOnlineStatus: (state, action) => {
            state.online = action.payload;
        },
    },
});

export const { setOnlineStatus } = networkSlice.actions;

// Thunk to start the network listener
export const startNetworkListener = () => (dispatch: AppDispatch) => {
    return NetInfo.addEventListener(state => {
        dispatch(setOnlineStatus(Boolean(state.isConnected && state.isInternetReachable)));
    });
};

export default networkSlice.reducer;
