import {AppointmentPostDataType} from '../screens/Appointment/AppointmentsScreen';
import {ForgotPasswordDataType} from '../screens/ForgotPasswordScreen';
import {
    DeletefileParams,
    PrescriptionScreenProps,
} from '../screens/HealthVault/PrescriptionScreen';
import {LoginDataType} from '../screens/LoginScreen';
import {OtpVerificationScreenProps} from '../screens/OtpVerificationScreen';

type tokenDataType = {token: string | null};

export type PostDataType =
    | LoginDataType
    | ForgotPasswordDataType
    | tokenDataType
    | OtpVerificationScreenProps
    | PrescriptionScreenProps
    | AppointmentPostDataType
    | DeletefileParams
    | ShareReportDataType
    | FormData
    | string;
