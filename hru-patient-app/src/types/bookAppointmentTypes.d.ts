type DrExperienceDetails = {
    experienceDetails: string;
    experienceYearFrom: number;
    experienceYearTo: number;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string;
    verifiedBy: string;
};

type DrAppointmentDetails = {
    _id: string;
    appointmentId: string;
    startTime: string;
    totalRating: number;
    appointmentCount: number;
    remarksCount: number;
    patientRatingToDoctor: number;
};

type CertificateImg = {
    name: string;
    path: string;
};

type DrCertificate = {
    specialization: string;
    certificateImg: CertificateImg;
    issuedBy: string;
    year: number;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string;
    verifiedBy: string;
};

type DrAward = {
    awardName: string;
    awardyear: number;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string;
    verifiedBy: string;
};

type AwardsArray = Award[];

type DrExperience = {
    experienceDetails: string;
    experienceYearFrom: number;
    experienceYearTo: number;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string;
    verifiedBy: string;
};

type ExperiencesArray = Experience[];

type DrEducation = {
    instituteName: string;
    universityName: string;
    degree: string;
    educationYear: number;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string;
    verifiedBy: string;
};

type EducationArray = Education[];

type MapLocation = {
    latitude: number;
    longitude: number;
};

type Location = {
    type: string;
    coordinates: [number, number];
};

type AppointmentSlot = {
    day: string;
    from: string;
    to: string;
    appointmentType: string;
    timePerSlot: number;
    patientPerSlot: number;
    appointmentDuration: number;
    uid: string;
    savedAppointment: boolean;
};

type ClinicImage = {
    name: string;
    path: string;
    basePath: string;
};

type Slot = {
    id: number;
    display: string;
    selectable: boolean;
    patientPerSlot: number;
    uid: string;
    openSlots: number;
    endTime: number;
    workAddressId: string;
    outOfOffice: boolean;
    isSelected: boolean;
};

type Timing = {
    id: string;
    slots: Slot[];
    hide: boolean;
    display: string;
    selectable: boolean;
};

type DaySchedule = {
    day: string;
    date: string;
    timings: Timing[];
};

type AppointmentDay = {
    day: string;
    from: string;
    to: string;
    appointmentType: string;
    timePerSlot: number;
    patientPerSlot: number;
    appointmentDuration: number;
    uid: string;
    savedAppointment: boolean;
};

type ClinicInfo = {
    id: string;
    addressType: string;
    workLocation: string;
    locationAddress: string;
    mapLocation: MapLocation;
    location: Location;
    locationPin: string;
    locationCity: string;
    locationState: string;
    locationContact: string;
    consultationFee: number;
    acceptVirtualConsultation: boolean;
    virtualConsultationFee: number;
    aboutClinic: string;
    appointmentSlots: AppointmentSlot[];
    clinicImgPath: string;
    clinicImgBasePath: string;
    imageOfClinic: ClinicImage[];
    dateTimeSlots: DaySchedule[];
    sunday?: AppointmentDay[];
    monday?: AppointmentDay[];
    tuesday?: AppointmentDay[];
    wednesday?: AppointmentDay[];
    thursday?: AppointmentDay[];
    friday?: AppointmentDay[];
    saturday?: AppointmentDay[];
};

type ResponseData = {
    appointmentId: string;
    fee: string;
    mode: string;
    profileId: string;
    workAddressId: string;
    rescheduleAmount: string;
};

// type Slot = {
//     id: number;
//     isSelected: boolean;
//     display: string;
//     selectable: boolean;
//     patientPerSlot: number;
//     uid: string;
//     openSlots: number;
//     endTime: number;
//     workAddressId: string;
//     outOfOffice: boolean;
// };

type Timing = {
    id: string;
    slots: Slot[];
    hide: boolean;
    display: string;
};

type DaySchedule = {
    day: string;
    date: string;
    timings: Timing[];
};

type DateList = { value: string; isSelected: boolean; timings: Timing[] };

type SearchSpecialistDoctors = {
    _id: string;
    name: string;
    type: 'SPECIALITY' | 'DOCTOR';
};

type MostSearchedSpeciality = {
    _id: string; // Unique identifier in string format
    name: string; // Name of the entity (e.g., "DENTIST")
    description: string; // Description field (e.g., "Testing")
    updatedAt: string; // Timestamp in ISO 8601 format
    searchCount: number; // Count of searches (integer value)
    imgUrl: {
        name: string; // Name of the image file
        path: string; // Path to the image file
    };
    specialityImgPath: string; // URL pointing to the specialty image
};

type RecentVisitedDoctor = {
    _id: string; // Unique identifier for the record
    appointmentId: string; // Unique identifier for the appointment
    startTime: string; // ISO 8601 string representing the start time
    totalRating: number; // Total rating as a number
    appointmentCount: number; // Total number of appointments as a number
    patientRatingToDoctor: number; // Rating given by patients as a number
    name: string; // Name of the doctor (e.g., "Ram Sharma")
    specialities: string[]; // Array of specialities (e.g., ["PAEDIATRICIAN"])
    profileImg: {
        name: string; // Name of the image file
        path: string; // Path to the image file
    };
    doctorType: string; // Doctor's title (e.g., "Dr.")
    doctorProfileImgPath: string; // URL pointing to the doctor's profile image
};

type HealthVaultFile = {
    id: string; // Unique identifier for the document
    ext: string; // File extension, e.g., 'pdf'
    fileName: string; // Name of the file
    path: string; // Path to the document in storage
    origin: string; // Source or origin of the document
    isSelected: boolean;
};

type HealthValutFilesObj = {
    patientPrescriptions: HealthVaultFile[];
    patientReports: HealthVaultFile[];
};

type PatientDetails = {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    prefix: string;
    imgUrl: { name: string; path: string };
    profileImgPath: string;
};

type DoctorDetails = {
    _id: string;
    clinicName: string;
};

type PatientRatingDetails = {
    _id: string;
    doctorId: string;
    patientId: string;
    profileId: string;
    workAddressId: string;
    startTime: string;
    endTime: string;
    bookedBy: string;
    status: number;
    bookingId: string;
    isPatientRated: boolean;
    patientRatingToDoctor: number;
    remarks: string;
    patientDetails: PatientDetails;
    doctorDetails: DoctorDetails;
};
