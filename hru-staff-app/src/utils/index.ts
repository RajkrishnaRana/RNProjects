import {useMutation} from '@tanstack/react-query';
import {postData} from '../api';

export const getName = (
    firstName: string | undefined,
    middleName: string | undefined,
    lastName: string | undefined,
    isDoctor?: string | undefined,
) => {
    return `${isDoctor ? isDoctor + ' ' : ''}${firstName}${
        middleName ? ' ' + middleName : ''
    }${' ' + lastName}`;
};
