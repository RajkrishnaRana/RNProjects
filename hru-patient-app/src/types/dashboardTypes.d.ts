interface TopRatedDoctorProfile {
    _id: string;
    appointmentId: string;
    startTime: string; // ISO 8601 date string (could also use Date if you plan to parse it)
    totalRating: number;
    totalFeedback: number;
    appointmentCount: number;
    patientRatingToDoctor: number;
    name: string;
    specialities: string[];
    profileImg: {
        name: string;
        path: string;
    };
    doctorType: string;
    doctorProfileImgPath: string;
}
