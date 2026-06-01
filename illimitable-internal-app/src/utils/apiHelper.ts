import {Alert} from 'react-native';

export const tokenExpiredMsg = (logout: () => void) => {
    Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [{text: 'OK', onPress: () => logout()}]);
};

export const postData = async (url: string, data?: any, logout?: () => void) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error('Something went wrong');
    }

    const result = await res.json();
    if (result?.tokenExpired && logout) {
        tokenExpiredMsg(logout);
    }

    // if (!result.status) {
    //     throw new Error(result.msg);
    // }

    return result;
};

export const getData = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Something went wrong');
    }

    return res.json();
};
