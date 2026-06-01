import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workerReducer from './slices/workerSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from './persistConfig';
import persistStore from 'redux-persist/es/persistStore';
import captureImgReducer from './slices/captureImgSlice';
import networkReducer from './slices/networkSlice';
import settingReducer from './slices/settingSlice';
import sessionReducer from './slices/sessionSlice';
import syncReducer from './slices/syncSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    session: sessionReducer,
    worker: workerReducer,
    captureImg: captureImgReducer,
    network: networkReducer,
    setting: settingReducer,
    sync: syncReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: { warnAfter: 100 },
            serializableCheck: {
                warnAfter: 100,
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // redux-persist actions are not serializable
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
