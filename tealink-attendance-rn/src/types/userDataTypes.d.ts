interface UserProfile {
    userId: string;
    companyId: string;
    lastLoginTime: string;
    name: string;
    email: string;
    allowUpdateWorker: boolean;
    allowAssignWorker: boolean;
    privileges: any;
    subscriptionEnd: number;
    appInfo: any;
    roundOff: string;
    includeImageInAllTransaction: boolean;
    companyName: string;
    device: { id: string, name: string };
}

interface Kamjari {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    parent: string;
    type: string;
    isDefault: boolean;
}

interface Section {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
}

interface Worker {
    _id: string;
    workerName: string;
    workerCode: string;
    gender: 'male' | 'female';
    workerType: string;
    book: string;
    irisData: boolean;
    empNo: number;
    div: string;
    profileImage: boolean;
    defaultKamjari: string;
    workerTypeName: 'Permanent';
    bookName: string;
    workerSubType: string | null;
    workerSubTypeName: string;
    kamjariId?: string;
    kamjariName?: string;
    sectionId?: string;
    sectionName?: string;
    workerBookName: string;
}

interface Batch {
    name: string;
    type: string;
    defaultShift: string;
    div: string;
    id: string;
}

interface Book {
    id: string;
    name: string;
}

interface WorkerType {
    name: string;
    subtypes: any[]; // Assuming 'subtypes' is an array of unknown structure, or string[] if they are just names
    paidWeeklyOff: boolean;
    paidHolidaysApplicable: boolean;
    pfApplicable: boolean;
    attendanceIncentiveApplicable: boolean;
    id: string;
    deptAllowanceApplicable: boolean;
}

interface AuthorizedUser {
    _id: string;
    name: string;
    email: string;
}

interface Shift {
    _id: string;
    code: string;
    kamjariId: string;
}

interface UserData {
    status: number;
    msg: string;
    data: {
        userProfile: UserProfile;
        allowUpdateWorker: boolean;
        allowAssignWorker: boolean;
        privileges: unknown;
        subscriptionEnd: number;
        appInfo: unknown;
        roundOff: 'floor';
        includeImageInAllTransaction: boolean;
        gardenConfig: GardenConfig;
        kamjaris: Kamjari[];
        sections: Section[];
        workers: Worker[];
        workerTypes: WorkerType[];
        authorisedUsers: AuthorizedUser[];
        books: Book[];
        batches: Batch[];
        shifts: Shift[];
    };
    now: number;
}
