interface AppointmentData {
    appointmentDetails: AppointmentDetails;
    _id: string;
    labDetails: LabDetails;
    patientDetails: PatientDetails;
    collectionAddressDetails?: CollectionAddressDetails;
    displayField?: string;
    appointmentId: string;
    phlebotomist: string;
    otpVerified?: boolean;
    otpVerifiedDate?: string;
    sampleCollectedDate?: string;
    sampleCollectionStatus?: boolean;
}

// Main Appointment Data Array
interface AppointmentDetails {
    _id: string;
    labId: string;
    patientId: string;
    profileId: string;
    workAddressId: string;
    startTime: string; // ISO date string
    bookedBy: string;
    status: number;
    labTests: LabTest[];
    otp: string;
    bookingId: string;
    invoice: Invoice;
    labDetails: LabDetails;
    patientDetails?: PatientDetails;
    displayField?: string;
}

// Lab Test Interface
interface LabTest {
    _id: string;
    testName: string;
    testId: string;
    price?: number | null; // Nullable price (optional or null)
    reportName?: string; // Optional if exists
    reportPath?: string; // Optional if exists
}

// Invoice Interface
interface Invoice {
    labTests: InvoiceLabTest[];
    totalAmt?: string; // Optional if sometimes missing
    totalCharges: string;
    totalPaidAmount?: string; // Optional if sometimes missing
    totalDiscount?: string; // Optional if sometimes missing
    confirmTransaction?: boolean; // Optional if sometimes present
}

// Invoice Lab Test Interface
interface InvoiceLabTest {
    labTestName: string;
    testName: string;
    labTestCharges?: number | null; // Nullable charges (optional or null)
    labTestDiscount: number;
    paidAmount: number;
    labTestPayable?: number | null; // Nullable if sometimes missing
    modeOfPayment?: string; // Optional if exists
    isInvoice: boolean;
    modeOfPaymentExist?: boolean; // Optional if exists
}

// Lab Details Interface
interface LabDetails {
    _id: string;
    labName: string;
    mobileNumber: string;
    hruId: string;
    locationAddress?: string;
}

interface PatientDetails {
    _id: string; // Patient's unique ID
    mobileNumber: string; // Patient's mobile number
    firstName: string; // Patient's first name
    middleName?: string; // Optional middle name (might be empty)
    lastName: string; // Patient's last name
    collectionAddress: string; // Address for collection
    hruId: string;
}

interface CollectionAddressDetails {
    _id: string;
    collectionAddress: string;
    collectionAddressState: string;
    collectionAddressCity: string;
    collectionAddressPin: string;
    locationInfo?: {
        coordinates: [number, number];
        _id: string;
    };
}
