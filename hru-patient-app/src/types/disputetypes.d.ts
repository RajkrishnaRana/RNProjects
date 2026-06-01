interface DisputeFile {
    name: string;
    path: string;
}

interface Dispute {
    comments: {
        commentId: string;
        commentBy: string;
        commentDescription: string;
        commentDate: string;
        commentImg?: {name: string; path: string};
        commentImgPath?: string;
    }[];
    complainAgainst: string;
    disputeType: string;
    disputeDescription: string;
    dateOfDispute: string; // ISO 8601 format
    status: string;
    disputeRaisedBy: string;
    disputeId: string;
    disputeFile: DisputeFile;
    resolvedDate: string; // ISO 8601 format
    disputeImgPath: string;
    disputeDescription: string;
}

interface DoctorDetails {
    _id: string;
    workLocation: string;
}

interface DisputeObj {
    _id: string;
    doctorId: string;
    workAddressId: string;
    bookingId: string;
    dispute: Dispute;
    doctorDetails: DoctorDetails;
    labDetails?: {
        labName: string;
        _id: string;
    };
}
