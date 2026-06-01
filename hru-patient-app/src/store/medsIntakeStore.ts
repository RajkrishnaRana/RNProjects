import {create} from 'zustand';

interface NotificationState {
    type: 'Intake' | 'Refill' | null;
    showModal: boolean;
    timeStamp: string | null;
    medicineName: string | null;
    notificationId: string | null;
    medicineId: string | null;
    medicineDosage: string | null;
    medicineUnit: string | null;
    medicineQuantity: string | null;
    setNotificationData: (data: {
        showModal: boolean;
        timeStamp: string | null;
        medicineName: string | null;
        notificationId: string | null;
        medicineId: string | null;
        medicineDosage: string | null;
        medicineUnit: string | null;
        type: 'Intake' | 'Refill' | null;
        medicineQuantity: string | null;
    }) => void;
    clearNotificationData: () => void;
}

export const useMedsIntakeStore = create<NotificationState>(set => ({
    type: null,
    showModal: false,
    timeStamp: null,
    medicineName: null,
    notificationId: null,
    medicineId: null,
    medicineDosage: null,
    medicineUnit: null,
    medicineQuantity: null,
    setNotificationData: data => set(data),
    clearNotificationData: () =>
        set({
            showModal: false,
            timeStamp: null,
            medicineName: null,
            notificationId: null,
            medicineId: null,
            medicineDosage: null,
            medicineUnit: null,
            type: null,
            medicineQuantity: null,
        }),
}));
