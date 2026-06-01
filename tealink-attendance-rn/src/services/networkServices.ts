import NetInfo from '@react-native-community/netinfo';

const networkServices = {
    isOnline: async (): Promise<boolean> => {
        const state = await NetInfo.fetch();
        return Boolean(state.isConnected && state.isInternetReachable);
    },
};

export default networkServices;
