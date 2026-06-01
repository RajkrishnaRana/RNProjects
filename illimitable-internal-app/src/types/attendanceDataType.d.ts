interface Location {
    latitude: number;
    longitude: number;
}

interface InOut {
    id: string;
    location: Location;
    locationDistance: number;
    locationName: string;
    inTime?: boolean; // Optional because it's only present in "in" objects
    outTime?: boolean; // Optional because it's only present in "out" objects
    unAuthorisedWorkLocation?: boolean;
}

declare interface DayData {
    dt: number;
    date: string;
    dayOfWeek: string;
    type: 'WEEKLY OFF' | 'WORKDAY' | 'ABSENT'; // Union type for specific values
    hasIssue: boolean;
    display: string;
    in?: InOut; // Optional because it's only present in "WORKDAY" objects
    out?: InOut; // Optional because it's only present in "WORKDAY" objects
}

// The array type
declare type DayDataArray = DayData[];
