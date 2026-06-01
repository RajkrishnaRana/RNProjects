import { Alert } from 'react-native';

// TYPES -------------->
type stringOrUndefined = string | undefined | null;

// FUNCTIONS --------------------->
export const imageSelector = (path: stringOrUndefined, gender: stringOrUndefined) => {
    return path
        ? { uri: path }
        : gender === 'MALE'
        ? require('../assets/icons/user.png')
        : gender === 'DOCTOR'
        ? require('../assets/icons/user.png')
        : gender === 'LAB'
        ? require('../assets/images/flask.png')
        : require('../assets/icons/user.png');
};

export const clinicImageSelector = (path: stringOrUndefined) => {
    return path ? { uri: path } : require('../assets/icons/clinic.png');
};

export const getName = (firstName: stringOrUndefined, middleName: stringOrUndefined, lastName: stringOrUndefined, isDoctor?: stringOrUndefined) => {
    return `${isDoctor ? isDoctor + ' ' : ''}${firstName || '-'}${middleName ? ' ' + middleName : ''}${' ' + lastName || '-'}`;
};

export const tokenExpiredMsg = (logout: () => void) => {
    Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [{ text: 'OK', onPress: () => logout() }]);
};

export const slicingText = (text: string, length: number) => {
    return text?.length > length ? `${text?.slice(0, length)}...` : text;
};
