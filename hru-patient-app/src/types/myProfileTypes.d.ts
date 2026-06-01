// Health Scheme Interface
interface HealthScheme {
    _id: string;
    name: string;
    sName: string;
    code: string;
}

// Image URL Interface
interface ImgUrl {
    name: string;
    path: string;
}

// Address Interface
interface Location {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
}

interface Address {
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    companyName: string;
    addressLineOne: string;
    addressLineTwo: string;
    location: Location;
    state: string;
    city: string;
    pinCode: string;
    id: string;
    isBillingAdd?: boolean;
    isPrimaryAdd?: boolean;
    isShippingAdd?: boolean;
    type: string; // e.g., "PRIMARY_ADDRESS"
}

// Uploaded Prescription Interface
interface UploadedPrescription {
    id: string;
    ext: string;
    fileName: string;
    path: string;
}

// Uploaded Report Interface
interface UploadedReport {
    id: string;
    ext: string;
    fileName: string;
    path: string;
}

// Doctor Interface
interface Doctor {
    id: string;
    updatedAt: string;
    createdAt: string;
}

// Profile Interface
interface Profile {
    id: string;
    relationship: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string; // ISO date string
    gender: string;
    email: string;
    remarks: string;
    imgUrl: ImgUrl;
    addresses: Address[];
    isActive: boolean;
    hruId: string;
    doctor: Doctor[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    mobileNumber: string;
    uploadedPrescriptions: UploadedPrescription[];
    uploadedReports: UploadedReport[];
    healthScheme: string;
    bloodGroup: string;
}

// Main Document Interface
interface MyProfile {
    _id: string;
    mobileNumber: string;
    userType: string; // e.g., "PATIENT"
    remarks: string;
    doctorIds: string[];
    profiles: Profile[];
    firstName: string;
    lastName: string;
    dob: string; // ISO date string
    gender: string;
    email: string;
    imgUrl: ImgUrl;
    addresses: Address[];
    isActive: boolean;
    loginId: string;
    savedStep: number;
    hruId: string;
    middleName: string;
    refCode: string;
    healthScheme: string;
    bloodGroup: string;
    guardianName: string;
    referralId: string;
    profileImgPath: string;
    healthSchemes: HealthScheme[];
}

// This is AddressBook interface
interface StateCodes {
    stateName: string;
    stateCode: number;
    abrv: string;
}
