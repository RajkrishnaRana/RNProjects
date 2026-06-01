import { Provider } from 'react-redux';
import MainRoute from './src/navigations/MainRoute';
import { persistor, store } from './src/store';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from './src/screens/SplashScreen';
import OfflineRibbon from './src/components/OfflineRibbon';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnReconnect: true,
            retry: 2, // Retry failed requests twice
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={<SplashScreen />} persistor={persistor}>
                    <StatusBar animated={true} backgroundColor="transparent" translucent={true} hidden={false} barStyle="dark-content" />
                    <MainRoute />
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    );
}

export default App;
