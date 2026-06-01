import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { useAuthStore } from '../store/authStore';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomSidebarMenu from './CustomNavigations/CustomSidebarMenu';
import OtpScreen from '../screens/OtpVerificationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import MyProfileScreen from '../screens/Profile/MyProfileScreen';
import AddressBookScreen from '../screens/AddressBook/AddressBookScreen';
import FamilyMembersScreen from '../screens/FamilyMembers/FamilyMembersScreen';
import HealthVaultScreen from '../screens/HealthVault/HealthVaultScreen';
import AppointmentsScreen from '../screens/Appointment/AppointmentsScreen';
import DisputesScreen from '../screens/Dispute/DisputesScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ReferralPointsScreen from '../screens/ReferralPointsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import EditDispute from '../screens/Dispute/EditDispute';
import AppointmentDetailScreen from '../screens/Appointment/AppointmentDetailScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import ClinicScreen from '../screens/BookAppointment/ClinicScreen';
import ClinicAppointmentScreen from '../screens/BookAppointment/ClinicAppointmentScreen';
import PaymentScreen from '../screens/BookAppointment/PaymentScreen';
import PaymentSuccessfull from '../screens/BookAppointment/PaymentSuccessfull';
import SuccessfulRegistrationScreen from '../screens/SuccessfulRegistrationScreen';
import AppHeader from '../components/AppHeaders/AppHeader';
import StackAppBar from '../components/AppHeaders/StackAppBar';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import StartupCarousalScreen from '../screens/StartupCarousalScreen';
import { useStartupCarousalStore } from '../store/startupCarousalStore';
import ReportScreen from '../screens/HealthVault/ReportScreen';
import PrescriptionScreen from '../screens/HealthVault/PrescriptionScreen';
import InvoiceScreen from '../screens/HealthVault/InvoiceScreen';
import SpecialitiesDoctorListScreen from '../screens/BookAppointment/SpecialitiesDoctorListScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AddMembersScreen from '../screens/FamilyMembers/AddFamilyMembersScreen';
import AddAddressScreen from '../screens/AddressBook/AddAddressScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import VerifyBookingScreen from '../screens/BookAppointment/VerifyBookingScreen';
import MedicineIntakeScreen from '../screens/MedicineIntakeScreen';
import MedicineRefillScreen from '../screens/MedicineRefillScreen';
import SearchScreen from '../screens/SearchScreen';
import PdfViewScreen from '../screens/PdfViewScreen';
import GooglePlacesAutocompleteScreen from '../screens/GooglePlacesAutocompleteScreen';
import { StatusBar } from 'react-native';
import { isIos } from '../utils/platform';
import PatientVaultDetailsScreen from '../screens/HealthVault/PatientVaultDetailsScreen';
import CreateMedicineItakeScreen from '../screens/CreateMedicineItakeScreen';
import MedicineIntakeSearchScreen from '../screens/MedicineIntakeSearchScreen';
import CreateMedicineRefillScreen from '../screens/CreateMedicineRefillScreen';
import SplashScreen2 from '../screens/SplashScreen2';
import LabAppointmentsScreen from '../screens/Lab/LabAppointmentsScreen';
import LabAppointmentDetailsScreen from '../screens/Lab/LabAppointmentDetailsScreen';
import PatientFeedbackScreen from '../screens/PatientFeedbackScreen';
import MedsIntakeHandler from '../components/MedsIntakeHandler';
import LabSearchPage from '../screens/Lab/LabSearchPage';
import LabDetailsPage from '../screens/Lab/LabDetailsPage';
import PrescriptionUploadScreen from '../screens/Lab/PrescriptionUploadScreen';
import TestDetailsScreen from '../screens/Lab/TestDetailsScreen';
import AllTopRatedDoctors from '../screens/AllTopRatedDoctors';
import CartButton from '../components/Buttons/CartButton';
import CartScreen from '../screens/Lab/CartScreen';
import LabBookingTimingScreen from '../screens/Lab/LabBookingTimingScreen';
import VerifyLabBookingScreen from '../screens/Lab/VerifyLabBookingScreen';
import OfflineRibbon from '../components/OfflineRibbon';
import { postData } from '../api';
import { BASE_URL } from '../config';
import { isTab } from '../utils/isTab';
import OrderLabFromPrescriptionScreen from '../screens/OrderLabFromPrescriptionScreen';
import ClinicProfileScreen from '../screens/Clinic/ClinicProfileScreen';
import PharmacyOrdersScreen from '../screens/Pharmacy/PharmacyOrdersScreen';
import MedSearchPage from '../screens/Lab/MedSearchPage';
import MedSearchByTypePage from '../screens/Lab/MedSearchByTypePage';
import PharmacyCartButton from '../components/Buttons/PharmacyCartButton';
import PharmacyCartScreen from '../screens/Pharmacy/PharmacyCartScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['myapp://'],
    config: {
        screens: {
            Home: {
                path: 'home',
                screens: {
                    DASHBOARD: 'dashboard',
                    'MY PROFILE': 'profile',
                    'ADDRESS BOOK': 'address-book',
                    'FAMILY MEMBERS': 'family-members',
                    'HEALTH VAULT': 'health-vault',
                    APPOINTMENTS: 'appointments',
                    DISPUTES: 'disputes',
                    ORDERS: 'orders',
                    'BOOK APPOINTMENT': 'book-appointment',
                    'REFERRAL POINTS': 'referral-points',
                    'MEDICINE INTAKE': 'medicine-intake/:medicineId?', // Deep link for MedicineIntakeScreen
                    'MEDICINE REFILL': 'medicine-refill',
                    'LAB APPOINTMENTS': 'lab-appointments',
                },
            },
            EditProfile: 'edit-profile',
            AddAddress: 'add-address',
            AddMembers: 'add-members',
            Notification: 'notification',
            EditDispute: 'edit-dispute',
            AppointmentDetails: 'appointment-details/:id',
            DoctorProfile: 'doctor-profile/:id',
            Clinic: 'clinic',
            ClinicAppointment: 'clinic-appointment',
            Payment: 'payment',
            PaymentSuccessfull: 'payment-successfull',
            PatientVaultDetails: 'patient-vault-details/:id',
            Reports: 'reports',
            Prescriptions: 'prescriptions',
            Invoices: 'invoices',
            SpecialitiesBasedDoctors: 'specialities-doctors',
            VerifyBooking: 'verify-booking',
            Search: 'search',
            PDFView: 'pdf-view',
            GooglePlaces: 'google-places',
            CreateMedicineItakeScreen: 'create-medicine-intake',
            MedicineIntakeSearchScreen: 'medicine-intake-search',
            CreateMedicineRefillScreen: 'create-medicine-refill',
            StartupCarousal: 'startup-carousal',
            Login: 'login',
            Signup: 'signup',
            SuccessfullSignup: 'successful-signup',
            ForgotPassword: 'forgot-password',
            OtpScreen: 'otp',
            ResetPassword: 'reset-password',
            LabAppointmentDetails: 'lab-appointment-details/:id',
            PatientFeedback: 'patient-feedback',
        },
    },
};

function CustomHeader(props: any) {
    return <AppHeader {...props} />;
}

function CustomDrawer(props: any) {
    return <CustomSidebarMenu {...props} />;
}

function DrawerNavigator() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return (
        <Drawer.Navigator
            screenOptions={{
                swipeEnabled: isAuthenticated,
                drawerStyle: {
                    width: isTab ? wp(50) : wp(80),
                    paddingTop: isIos() ? 0 : StatusBar.currentHeight ?? 0,
                },
                header: CustomHeader, // Use AppHeader as the custom header
            }}
            drawerContent={CustomDrawer}
        >
            <Drawer.Screen name="DASHBOARD" component={DashboardScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="MY PROFILE" component={MyProfileScreen} />
            <Drawer.Screen name="ADDRESS BOOK" component={AddressBookScreen} />
            <Drawer.Screen name="FAMILY MEMBERS" component={FamilyMembersScreen} />
            <Drawer.Screen name="HEALTH VAULT" component={HealthVaultScreen} />
            <Drawer.Screen name="APPOINTMENTS" component={AppointmentsScreen} />
            <Drawer.Screen name="DISPUTES" component={DisputesScreen} />
            <Drawer.Screen name="ORDERS" component={OrdersScreen} />
            <Drawer.Screen name="BOOK APPOINTMENT" component={BookAppointmentScreen} />
            <Drawer.Screen name="REFERRAL POINTS" component={ReferralPointsScreen} />
            <Drawer.Screen name="MEDICINE INTAKE" component={MedicineIntakeScreen} />
            <Drawer.Screen name="MEDICINE REFILL" component={MedicineRefillScreen} />
            <Drawer.Screen name="LAB APPOINTMENTS" component={LabAppointmentsScreen} />
            <Drawer.Screen name="PHARMACY ORDERS" component={PharmacyOrdersScreen} />
        </Drawer.Navigator>
    );
}

// NAVIGATION STACK AFTER LOGIN
/* Header wrappers ------------------------------------------------------- */
const Header = ({ title, rightIcon, backbuttonDisable }: any) => (
    <StackAppBar title={title} rightIcon={rightIcon} backbuttonDisable={backbuttonDisable} />
);

/* Pre-built instances for the simple cases ------------------------------- */
const EditProfileHeader = () => <Header title="Edit Profile" />;
const AddAddressHeader = () => <Header title="Add New Address" />;
const AddMembersHeader = () => <Header title="Add New Member" />;
const DisputeDetailsHeader = () => <Header title="Dispute Details" />;
const EditDisputeHeader = () => <Header title="Edit Dispute" />;
const AppointmentDetailsHeader = () => <Header title="Appointment Details" />;
const DoctorProfileHeader = () => <Header title="Doctor Profile" />;
const ClinicHeader = () => <Header title="Choose a Clinic" />;
const ClinicAppointmentHeader = () => <Header title="Book an Appointment" />;
const PaymentHeader = () => <Header title="Payment Methods" />;
const PatientDetailsHeader = () => <Header title="Patient Details" />;
const ReportsHeader = () => <Header title="Your Reports" />;
const PrescriptionsHeader = () => <Header title="Your Prescriptions" />;
const InvoicesHeader = () => <Header title="Your Invoices" />;
const SpecialitiesHeader = () => <Header title="Specialities Doctors" />;
const VerifyBookingHeader = () => <Header title="Verify Your Booking" />;
const SearchHeader = () => <Header title="Search" />;
const PDFViewHeader = () => <Header title="PDF View" />;
const GooglePlacesHeader = () => <Header title="Select Address" />;
const CreateMedicineIntakeHeader = () => <Header title="Create Medicine Intake" />;
const MedicineSearchHeader = () => <Header title="Searched Medicine" rightIcon={<PharmacyCartButton />} />;   //this cart component will change with <PharmacyCart /> component
const CreateMedicineRefillHeader = () => <Header title="Create Medicine Refill" />;
const LabAppointmentDetailsHeader = () => <Header title="Lab Appointment Details" />;
const PatientFeedbackHeader = () => <Header title="Patient Feedbacks" />;
const LabSearchHeader = () => <Header title="Lab Search Result" rightIcon={<CartButton />} />;
const LabDetailsHeader = () => <Header title="Lab Details" rightIcon={<CartButton />} />;
const PrescriptionUploadHeader = () => <Header title="Upload your Prescriptions" />;
const TestDetailsHeader = () => <Header title="Lab Test Details" rightIcon={<CartButton />} />;
const CartHeader = () => <Header title="My Cart" />;
const LabBookingTimingsHeader = () => <Header title="Select Your Timings for Lab" />;
const VerifyLabBookingHeader = () => <Header title="Verify your Booking" />;
const OrderLabFromPrescriptionHeader = () => <Header title="Medical Prescription" />;
const ClinicProfileHeader = () => <Header title="ClinicProfile" />;

/* Screens --------------------------------------------------------------- */
function AppStack() {
    const isFirstTimeAppOpen = useStartupCarousalStore(s => s.isFirstTimeAppOpen);

    return (
        <Stack.Navigator initialRouteName={isFirstTimeAppOpen ? 'StartupCarousal' : 'Home'}>
            <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />

            {/* --- User screens --- */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ header: EditProfileHeader }} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ header: AddAddressHeader }} />
            <Stack.Screen name="AddMembers" component={AddMembersScreen} options={{ header: AddMembersHeader }} />
            <Stack.Screen name="Disputes" component={DisputesScreen} options={{ header: DisputeDetailsHeader }} />
            <Stack.Screen name="EditDispute" component={EditDispute} options={{ header: EditDisputeHeader }} />
            <Stack.Screen name="AppointmentDetails" component={AppointmentDetailScreen} options={{ header: AppointmentDetailsHeader }} />
            <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} options={{ header: DoctorProfileHeader }} />
            <Stack.Screen name="Clinic" component={ClinicScreen} options={{ header: ClinicHeader }} />
            <Stack.Screen name="ClinicAppointment" component={ClinicAppointmentScreen} options={{ header: ClinicAppointmentHeader }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ header: PaymentHeader }} />
            <Stack.Screen name="PaymentSuccessfull" component={PaymentSuccessfull} options={{ headerShown: false }} />
            <Stack.Screen name="PatientVaultDetails" component={PatientVaultDetailsScreen} options={{ header: PatientDetailsHeader }} />
            <Stack.Screen name="Reports" component={ReportScreen} options={{ header: ReportsHeader }} />
            <Stack.Screen name="Prescriptions" component={PrescriptionScreen} options={{ header: PrescriptionsHeader }} />
            <Stack.Screen name="Invoices" component={InvoiceScreen} options={{ header: InvoicesHeader }} />
            <Stack.Screen name="SpecialitiesBasedDoctors" component={SpecialitiesDoctorListScreen} options={{ header: SpecialitiesHeader }} />
            <Stack.Screen name="VerifyBooking" component={VerifyBookingScreen} options={{ header: VerifyBookingHeader }} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ header: SearchHeader }} />
            <Stack.Screen name="PDFView" component={PdfViewScreen} options={{ header: PDFViewHeader }} />
            <Stack.Screen name="GooglePlaces" component={GooglePlacesAutocompleteScreen} options={{ header: GooglePlacesHeader }} />
            <Stack.Screen name="CreateMedicineItakeScreen" component={CreateMedicineItakeScreen} options={{ header: CreateMedicineIntakeHeader }} />
            <Stack.Screen name="MedicineIntakeSearchScreen" component={MedicineIntakeSearchScreen} options={{ header: MedicineSearchHeader }} />
            <Stack.Screen name="CreateMedicineRefillScreen" component={CreateMedicineRefillScreen} options={{ header: CreateMedicineRefillHeader }} />

            {/* --- auth screens --- */}
            <Stack.Screen name="StartupCarousal" component={StartupCarousalScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SuccessfullSignup" component={SuccessfulRegistrationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />

            {/* --- lab screens --- */}
            <Stack.Screen name="LabAppointmentDetails" component={LabAppointmentDetailsScreen} options={{ header: LabAppointmentDetailsHeader }} />
            <Stack.Screen name="PatientFeedback" component={PatientFeedbackScreen} options={{ header: PatientFeedbackHeader }} />
            <Stack.Screen name="LabSearch" component={LabSearchPage} options={{ header: LabSearchHeader }} />
            <Stack.Screen name="LabDetails" component={LabDetailsPage} options={{ header: LabDetailsHeader }} />
            <Stack.Screen name="PrescriptionUploadScreen" component={PrescriptionUploadScreen} options={{ header: PrescriptionUploadHeader }} />
            <Stack.Screen name="TestDetails" component={TestDetailsScreen} options={{ header: TestDetailsHeader }} />
            <Stack.Screen name="AllTopRatedDoctors" component={AllTopRatedDoctors} options={{ headerShown: false }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ header: CartHeader }} />
            <Stack.Screen name="LabBookingTimings" component={LabBookingTimingScreen} options={{ header: LabBookingTimingsHeader }} />
            <Stack.Screen name="VerifyLabBooking" component={VerifyLabBookingScreen} options={{ header: VerifyLabBookingHeader }} />
            <Stack.Screen name="OrderLabFromPrescription" component={OrderLabFromPrescriptionScreen} options={{ header: OrderLabFromPrescriptionHeader }} />
            <Stack.Screen name="ClinicProfile" component={ClinicProfileScreen} options={{ header: ClinicProfileHeader }} />

            {/* --- medicine screens --- */}
            <Stack.Screen name="MedSearch" component={MedSearchPage} options={{ header: MedicineSearchHeader }} />
            <Stack.Screen name="MedSearchByType" component={MedSearchByTypePage} options={{ header: MedicineSearchHeader }} />
            {/* ================================================== pharmacy cart screen */}
            <Stack.Screen name="MedCart" component={PharmacyCartScreen} options={{ header: CartHeader }} />    

            {/* --- extras --- */}
            <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default function MainRoute() {
    const [showSplash, setShowSplash] = useState(true);
    const [navigationState, setNavigationState] = useState(0);
    const { token, logout } = useAuthStore();

    useEffect(() => {
        const checkTokenExpiration = async () => {
            try {
                const url = `${BASE_URL}/hru/Patientappapi/patientappointmentlistdaterange`;
                const response = await postData(url, {
                    token,
                    start: new Date().valueOf(),
                    end: new Date().valueOf(),
                });

                if (response?.tokenExpired) {
                    logout();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
                // Optionally handle errors (e.g., show error message or retry)
            }
        };

        checkTokenExpiration();
    }, [token, logout]);

    if (showSplash) {
        return <SplashScreen2 setLoading={setShowSplash} />;
    }

    return (
        <NavigationContainer
            linking={linking}
            onStateChange={() => {
                setNavigationState(prev => prev + 1);
            }}
        >
            <AppStack />
            <MedsIntakeHandler />
            <OfflineRibbon onNavigationChange={navigationState} />
        </NavigationContainer>
    );
}

// function AppStack() {
//     const isFirstTimeAppOpen = useStartupCarousalStore(state => state.isFirstTimeAppOpen);

//     return (
//         <Stack.Navigator initialRouteName={isFirstTimeAppOpen ? 'StartupCarousal' : 'Home'}>
//             <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
//             <Stack.Screen
//                 name="EditProfile"
//                 component={EditProfileScreen}
//                 options={{
//                     header: () => <StackAppBar title="Edit Profile" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="AddAddress"
//                 component={AddAddressScreen}
//                 options={{
//                     header: () => <StackAppBar title="Add New Address" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="AddMembers"
//                 component={AddMembersScreen}
//                 options={{
//                     header: () => <StackAppBar title="Add New Member" />,
//                 }}
//             />
//             <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
//             <Stack.Screen
//                 name="EditDispute"
//                 component={EditDispute}
//                 options={{
//                     header: () => <StackAppBar title="Dispute Details" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="AppointmentDetails"
//                 component={AppointmentDetailScreen}
//                 options={{
//                     header: () => <StackAppBar title="Appointment Details" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="DoctorProfile"
//                 component={DoctorProfileScreen}
//                 options={{
//                     header: () => <StackAppBar title="Doctor Profile" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Clinic"
//                 component={ClinicScreen}
//                 options={{
//                     header: () => <StackAppBar title="Choose a Clinic" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="ClinicAppointment"
//                 component={ClinicAppointmentScreen}
//                 options={{
//                     header: () => <StackAppBar title="Book an Appointment" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Payment"
//                 component={PaymentScreen}
//                 options={{
//                     header: () => <StackAppBar title="Payment Methods" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="PaymentSuccessfull"
//                 component={PaymentSuccessfull}
//                 options={{
//                     // header: () => (
//                     //     <StackAppBar
//                     //         title="Payment Successfull"
//                     //         backbuttonDisable
//                     //     />
//                     // ),
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="PatientVaultDetails"
//                 component={PatientVaultDetailsScreen}
//                 options={{
//                     header: () => <StackAppBar title="Patient Details" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Reports"
//                 component={ReportScreen}
//                 options={{
//                     header: () => <StackAppBar title="Your Reports" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Prescriptions"
//                 component={PrescriptionScreen}
//                 options={{
//                     header: () => <StackAppBar title="Your Prescriptions" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Invoices"
//                 component={InvoiceScreen}
//                 options={{
//                     header: () => <StackAppBar title="Your Invoices" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="SpecialitiesBasedDoctors"
//                 component={SpecialitiesDoctorListScreen}
//                 options={{
//                     header: () => <StackAppBar title="Specialities Doctors" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="VerifyBooking"
//                 component={VerifyBookingScreen}
//                 options={{
//                     header: () => <StackAppBar title="Verify Your Booking" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="Search"
//                 component={SearchScreen}
//                 options={{
//                     header: () => <StackAppBar title="Search " />,
//                 }}
//             />
//             <Stack.Screen
//                 name="PDFView"
//                 component={PdfViewScreen}
//                 options={{
//                     header: () => <StackAppBar title="PDF View" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="GooglePlaces"
//                 component={GooglePlacesAutocompleteScreen}
//                 options={{
//                     header: () => <StackAppBar title="Select Address" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="CreateMedicineItakeScreen"
//                 component={CreateMedicineItakeScreen}
//                 options={{
//                     header: () => <StackAppBar title="Create Medicine Intake" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="MedicineIntakeSearchScreen"
//                 component={MedicineIntakeSearchScreen}
//                 options={{
//                     header: () => <StackAppBar title="Search Medicine" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="CreateMedicineRefillScreen"
//                 component={CreateMedicineRefillScreen}
//                 options={{
//                     header: () => <StackAppBar title="Create Medicine Refill" />,
//                 }}
//             />

//             {/* Auth Stack Screens */}
//             <Stack.Screen
//                 name="StartupCarousal"
//                 component={StartupCarousalScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="Login"
//                 component={LoginScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="Signup"
//                 component={SignUpScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="SuccessfullSignup"
//                 component={SuccessfulRegistrationScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="ForgotPassword"
//                 component={ForgotPasswordScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="OtpScreen"
//                 component={OtpScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="ResetPassword"
//                 component={ResetPasswordScreen}
//                 options={{
//                     headerShown: false,
//                 }}
//             />

//             {/* Lab Screens */}
//             <Stack.Screen
//                 name="LabAppointmentDetails"
//                 component={LabAppointmentDetailsScreen}
//                 options={{
//                     header: () => <StackAppBar title="Lab Appointment Details" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="PatientFeedback"
//                 component={PatientFeedbackScreen}
//                 options={{
//                     header: () => <StackAppBar title="Patient Feedbacks" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="LabSearch"
//                 component={LabSearchPage}
//                 options={{
//                     header: () => <StackAppBar title="Lab Search Result" rightIcon={<CartButton />} />,
//                 }}
//             />
//             <Stack.Screen
//                 name="LabDetails"
//                 component={LabDetailsPage}
//                 options={{
//                     header: () => <StackAppBar title="Lab Details" rightIcon={<CartButton />} />,
//                 }}
//             />
//             <Stack.Screen
//                 name="PrescriptionUploadScreen"
//                 component={PrescriptionUploadScreen}
//                 options={{
//                     header: () => <StackAppBar title="Upload your Prescriptions" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="TestDetails"
//                 component={TestDetailsScreen}
//                 options={{
//                     header: () => <StackAppBar title="Lab Test Details" rightIcon={<CartButton />} />,
//                 }}
//             />
//             <Stack.Screen
//                 name="AllTopRatedDoctors"
//                 component={AllTopRatedDoctors}
//                 options={{
//                     headerShown: false,
//                 }}
//             />
//             <Stack.Screen
//                 name="Cart"
//                 component={CartScreen}
//                 options={{
//                     header: () => <StackAppBar title="My Cart" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="LabBookingTimings"
//                 component={LabBookingTimingScreen}
//                 options={{
//                     header: () => <StackAppBar title="Select Your Timings for Lab" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="VerifyLabBooking"
//                 component={VerifyLabBookingScreen}
//                 options={{
//                     header: () => <StackAppBar title="Verify your Booking" />,
//                 }}
//             />
//             <Stack.Screen
//                 name="OrderLabFromPrescription"
//                 component={OrderLabFromPrescriptionScreen}
//                 options={{ header: () => <StackAppBar title="Medical Prescription" /> }}
//             />
//             <Stack.Screen name="ClinicProfile" component={ClinicProfileScreen} options={{ header: () => <StackAppBar title="ClinicProfile" /> }} />
//         </Stack.Navigator>
//     );
// }
