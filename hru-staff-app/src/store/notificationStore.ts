import {create} from 'zustand';

type NotificationStoreState = {
    FCMToken: string | null;
    setFCMToken: (token: string) => void;
};

export const useNotificationStore = create<NotificationStoreState>(set => ({
    FCMToken: null,
    setFCMToken: token => set({FCMToken: token}),
}));
