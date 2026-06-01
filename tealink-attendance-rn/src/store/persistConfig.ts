import { reduxStorage } from './mmkvStorage';

const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    whitelist: ['auth', 'session', 'setting'],
};

export default persistConfig;
