type LabProfileImg = {
    name: string;
    path: string;
};

type LabInfo = {
    _id: string;
    labName: string;
    hruId: string;
    labProfileImg: LabProfileImg;
    mobileNumber: string;
    locationAddress: string;
    locationPin: number;
    doctorProfileImgPath: string;
};

// Most Searched Speciality
interface LabPayload {
    token?: string | null;
    latitude: number | undefined;
    longitude: number | undefined;
    searchLocationId: string | undefined;
}

interface MostSearchedLabTest {
    _id: string;
    name: string;
    description: string;
    searchCount: string;
    updatedAt: string;
    labImg?: {
        id: string;
        name: string;
        path: string;
        labTestImgPath: string;
    }[];
}

interface LabSearchData {
    _id: string;
    name: string;
    type: 'TEST';
}

interface MapLocation {
    latitude: number;
    longitude: number;
}

interface Location {
    type: string;
    coordinates: [number, number];
}

interface LabAddress {
    _id: string;
    locationAddress: string;
    locationCity: string;
    locationPin: number;
    locationState: string;
    mapLocation: MapLocation;
    location: Location;
    distance: number;
}

interface LabProfileImg {
    name: string;
    path: string;
}

interface AppointmentSlot {
    day: string;
    from: string;
    to: string;
    timePerSlot: number | string;
    patientPerSlot: number;
    labCategoryIds?: string[];
    uid: string;
    savedAppointment: boolean;
}

interface AppointmentDates {
    sunday: AppointmentSlot[];
    monday: AppointmentSlot[];
    tuesday: AppointmentSlot[];
    wednesday: AppointmentSlot[];
    thursday: AppointmentSlot[];
    friday: AppointmentSlot[];
    saturday: AppointmentSlot[];
}

interface Lab {
    _id: string;
    labName: string;
    defaultLabId: string;
    address: LabAddress[];
    freeSmplAbvCharges: string;
    homeFacilityAvl: string;
    labProfileImg: LabProfileImg;
    pickupCharges: string;
    pickupDropAvl: string;
    clinicName?:string;
    smplCollectinChrges: string;
    pickAvailableUpto: number;
    labProfileImgPath: string;
    avgRating: number;
    totalRatingByPatient: number;
    totalFeedback: number;
    labPrice: number;
    minDistance: number;
    closestAddress: string;
    addressPosMap: Record<string, number>;
    appointmentDates: AppointmentDates;
}

// Location coordinate point
interface LocationPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

// Address interface
interface Address {
    _id: string;
    locationAddress: string;
    locationCity: string;
    locationPin: number;
    locationState: string;
    location: LocationPoint;
}

// Lab profile image interface
interface LabProfileImage {
    name: string;
    path: string;
}

// Test details interface
interface TestDetails {
    _id: string;
    homeCollection: null | string; // Could be more specific based on actual values
    rxRequire: 'Yes' | 'No'; // Assuming it can be Yes or No
    price: number;
    name: string;
    patientPickUp: 'Yes' | 'No';
    labCategoryId: string;
}

// Lab details interface
interface LabDetails {
    _id: string;
    labName: string;
    address: Address[];
    freeSmplAbvCharges: string; // Could be number if you want to parse it
    homeFacilityAvl: 'YES' | 'NO';
    labProfileImg: LabProfileImage;
    pickupCharges: string; // Could be number if you want to parse it
    pickupDropAvl: 'YES' | 'NO';
    smplCollectinChrges: string; // Could be number if you want to parse it
    pickAvailableUpto: number;
    labProfileImgPath: string;
    avgRating: number;
    totalRatingByPatient: number;
    totalFeedback: number;
    labPrice: number;
    minDistance: number;
    defaultLabId: string;
}

// Main lab booking interface
interface LabBooking {
    _id: string;
    labId: string;
    patientId: string;
    testId: string;
    testDetails: TestDetails;
    labDetails: LabDetails;
    createdAt: string; // ISO date string
    createdBy: string;
    companyId: string;
}

// Type alias version
type LabBookingType = {
    _id: string;
    labId: string;
    patientId: string;
    testId: string;
    testDetails: TestDetails;
    labDetails: LabDetails;
    createdAt: string;
    createdBy: string;
    companyId: string;
};

type LabTestCategory = {
    _id: string;
    category: string;
    createdAt: string;
    isActive: boolean;
    name: string;
};
