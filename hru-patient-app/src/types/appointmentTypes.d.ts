// Transaction Interface
interface Transaction {
    amount: number;
    mode: string; // e.g., "Razorpay"
    total: number;
}

// Body Interface
interface PaymentBody {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// Refund Details Interface
interface AcquirerData {
    arn: string | null;
}

interface RefundDetails {
    acquirer_data: AcquirerData;
    amount: number;
    batch_id: string | null;
    created_at: number; // Unix timestamp
    currency: string; // e.g., "INR"
    entity: string; // e.g., "refund"
    id: string;
    notes: string[];
    payment_id: string;
    receipt: string | null;
    speed_processed: string;
    speed_requested: string;
    status: string; // e.g., "processed"
}

// Patient Details Interface
interface PatientDetails {
    _id: string;
    mobileNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string; // e.g., "Male"
    dob: string; // e.g., "42Y"
    hruId: string;
    prefix: string;
    imgUrl: {
        name: string;
        path: string;
    };
    patientProfileImgPath: string; // URL
}

// Doctor Registration Interface
interface DoctorRegistration {
    regAuthority: string;
    regNo: string;
    regDate: string; // ISO date string
    expDate: string; // ISO date string
    registrationImg: string;
    status: number; // e.g., 1 for active
    acceptOrRejectRef: string;
    regCertificate: string;
    ip: string;
    verifiedAt: string; // ISO date string
    verifiedBy: string;
}

// Doctor Details Interface
interface DoctorDetails {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    registrations: DoctorRegistration[];
    hruId: string;
    profileImg: {
        name: string;
        path: string;
    };
    doctorType: string; // e.g., "Dr."
    mobileNumber: string;
    workLocation: string;
    locationAddress: string;
    locationPin: string;
    locationContact: string;
    doctorProfileImgPath: string; // URL
}

// Main Document Interface
interface AppointmentDataTypes {
    _id: string;
    doctorId: string;
    patientId: string;
    profileId: string;
    workAddressId: string;
    startTime: string; // ISO date string
    bookedBy: string; // e.g., "PATIENT"
    status: number; // e.g., -1 for cancelled
    consultationMode: string; // e.g., "In Clinic Consultation"
    consultationFee: number;
    otp: string;
    bookingId: string;
    amount: number;
    rzrpStatus: string; // e.g., "received"
    transactions: Transaction[];
    body: PaymentBody;
    cancelCheckIn: boolean;
    refundDetails: RefundDetails;
    patientDetails: PatientDetails;
    doctorDetails: DoctorDetails;
    statusTxt: string; // e.g., "Cancelled by Patient"
    startTimeInMs: number; // Unix timestamp
    todayInMs: number; // Unix timestamp
}
