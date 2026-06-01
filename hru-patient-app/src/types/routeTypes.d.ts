import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { FamilyMemberItem } from '../screens/FamilyMembers/FamilyMembersScreen';
import { MyProfile } from './myProfileTypes';

// Stack navigator route types
export type RootStackParamList = {
    Home: undefined; // This links to the DrawerNavigator
    Login: { isBookingTime?: boolean };
    Signup: { isOtpVerified: boolean };
    StartupCarousal: undefined;
    ForgotPassword: undefined;
    OtpScreen: {
        phoneNumber: string;
        nextRoute: keyof RootStackParamList;
        type?: string;
        patientId?: string;
    };
    MedSearchByType: {
        data: any;
    }
    ResetPassword: { phoneNumber: string };
    Notification: undefined;
    EditProfile: { data: MyProfile };
    AddAddress: { mode: 'add' | 'edit'; item?: Address; stateData: StateCodes[] };
    AddMembers: { mode: 'add' | 'edit'; item?: FamilyMemberItem };
    EditDispute: { item: DisputeObj };
    AppointmentDetails: { id: string; type?: 'lab' | 'patient' };
    DoctorProfile: { id: string; key?: string };
    Clinic: { id: string };
    ClinicAppointment: {
        data: ClinicInfo;
        resheduleResponse?: ResponseData;
        rescheduleAmount: string;
    };
    Payment: undefined;
    PaymentSuccessfull: { type: 'lab' | 'patient' };
    SuccessfullSignup: undefined;
    Reports: { profileId: string };
    Prescriptions: { profileId: string };
    Invoices: { profileId: string };
    SpecialitiesBasedDoctors: { id: string; payload: SpecialiesPayload };
    VerifyBooking: { key: string };
    Search: { data: SearchSpecialistDoctors[]; payload: SpecialiesPayload; type?: 'lab' | 'doctor' | 'pharmacy' };
    PDFView: { fileUrl: string; type?: 'Prescription' | 'DigitalPrescription' | 'Report' | 'Invoice'; _id: string };
    GooglePlaces: {
        addressLineTwo?: boolean;
        stateData: StateCodes[];
        value: string;
    };
    PatientVaultDetails: {
        item: ItemProps;
    };
    CreateMedicineItakeScreen: { queryKey: string };
    CreateMedicineRefillScreen: { queryKey: string };
    LabAppointmentDetails: { id: string };
    PatientFeedback: { data: PatientRatingDetails[] };
    LabSearch: { id: string };
    MedSearch: { id: string };
    LabDetails: { id: string };
    PrescriptionUploadScreen: { data: any };
    TestDetails: { test: any };
    AllTopRatedDoctors: { type: number; data: any };
    LabBookingTimings: { key: string };
    VerifyLabBooking: {
        appointmentDates: DateList[];
        selectedAppointmentTimings: Timing[];
        data: any;
    };
    OrderLabFromPrescriptionScreen: { data: any };
    ClinicProfile: { id: string };
};

// Drawer navigator route types
export type DrawerParamList = {
    DASHBOARD: undefined;
    'MY PROFILE': undefined;
    'ADDRESS BOOK': undefined;
    'FAMILY MEMBERS': undefined;
    'HEALTH VAULT': undefined;
    APPOINTMENTS: undefined;
    DISPUTES: undefined;
    ORDERS: undefined;
    'BOOK APPOINTMENT': undefined;
    'REFERRAL POINTS': undefined;
    'Log Out': undefined;
    'MEDICINE INTAKE': undefined;
    'MEDICINE REFILL': undefined;
    'LAB APPOINTMENTS': undefined;
    'PHARMACY ORDERS': undefined;
};

// Stack navigation prop type
export type StackNavProp = StackNavigationProp<RootStackParamList>;

// Drawer navigation prop type
export type DrawerNavProp = DrawerNavigationProp<DrawerParamList>;

// Combined Nav Prop type
export type CombinedNavProp = StackNavigationProp<RootStackParamList> & DrawerNavigationProp<DrawerParamList>;
