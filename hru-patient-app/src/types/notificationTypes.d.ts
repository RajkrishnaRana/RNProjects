import { ImageProps } from 'react-native';
import { Source } from 'react-native-fast-image';

type NotificationType =
    | ''
    | 'APPOINTMENT_CREATION'
    | 'APPOINTMENT_RESCHEDULE'
    | 'APPOINTMENT_CANCELATION'
    | 'APPOINTMENT_NO_SHOW'
    | 'APPOINTMENT_CHECKIN'
    | 'PRESCRIBED_APPOINTMENT'
    | 'APPOINTMENT_INVOICE'
    | 'APPOINTMENT_DELAY';

interface NotificationFilterProps {
    id: number;
    name: string;
    value: NotificationType;
    isSelected: boolean;
    imgSrc: ImageProps;
    color: string;
}

interface NotificationDataProps {
    _id: string;
    type: NotificationType;
    category: string;
    icon: string;
    readStatus: boolean;
    notificationCreatedAt: string;
    msg: string;
    callback: string;
}
