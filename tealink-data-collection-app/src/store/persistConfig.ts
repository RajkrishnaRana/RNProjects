import { reduxStorage } from './mmkvStorage';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

const authBlacklistFilter = createBlacklistFilter('auth', ['isAuthenticated', 'userData']);

export const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    whitelist: ['auth'], // <= only persist the 'auth' slice
    transforms: [authBlacklistFilter],
};
