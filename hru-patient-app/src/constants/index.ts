//All the states
export interface StateCodes {
    stateName: string;
    stateCode: number;
    abrv: string;
}
export const StateNameCodes: StateCodes[] = [
    {
        stateName: 'Andaman and Nicobar Islands',
        stateCode: 35,
        abrv: 'AN',
    },
    {
        stateName: 'Andhra Pradesh',
        stateCode: 37,
        abrv: 'AD',
    },
    {
        stateName: 'Arunachal Pradesh',
        stateCode: 12,
        abrv: 'AR',
    },
    {
        stateName: 'Assam',
        stateCode: 18,
        abrv: 'AS',
    },
    {
        stateName: 'Bihar',
        stateCode: 10,
        abrv: 'BR',
    },
    {
        stateName: 'Chandigarh',
        stateCode: 4,
        abrv: 'CH',
    },
    {
        stateName: 'Chattisgarh',
        stateCode: 22,
        abrv: 'CG',
    },
    {
        stateName: 'Dadra and Nagar Haveli',
        stateCode: 26,
        abrv: 'DN',
    },
    {
        stateName: 'Daman and Diu',
        stateCode: 25,
        abrv: 'DD',
    },
    {
        stateName: 'Delhi',
        stateCode: 7,
        abrv: 'DL',
    },
    {
        stateName: 'Goa',
        stateCode: 30,
        abrv: 'GA',
    },
    {
        stateName: 'Gujarat',
        stateCode: 24,
        abrv: 'GJ',
    },
    {
        stateName: 'Haryana',
        stateCode: 6,
        abrv: 'HR',
    },
    {
        stateName: 'Himachal Pradesh',
        stateCode: 2,
        abrv: 'HP',
    },
    {
        stateName: 'Jammu and Kashmir',
        stateCode: 1,
        abrv: 'JK',
    },
    {
        stateName: 'Jharkhand',
        stateCode: 20,
        abrv: 'JH',
    },
    {
        stateName: 'Karnataka',
        stateCode: 29,
        abrv: 'KA',
    },
    {
        stateName: 'Kerala',
        stateCode: 32,
        abrv: 'KL',
    },
    {
        stateName: 'Lakshadweep Islands',
        stateCode: 31,
        abrv: 'LD',
    },
    {
        stateName: 'Madhya Pradesh',
        stateCode: 23,
        abrv: 'MP',
    },
    {
        stateName: 'Maharashtra',
        stateCode: 27,
        abrv: 'MH',
    },
    {
        stateName: 'Manipur',
        stateCode: 14,
        abrv: 'MN',
    },
    {
        stateName: 'Meghalaya',
        stateCode: 17,
        abrv: 'ML',
    },
    {
        stateName: 'Mizoram',
        stateCode: 15,
        abrv: 'MZ',
    },
    {
        stateName: 'Nagaland',
        stateCode: 13,
        abrv: 'NL',
    },
    {
        stateName: 'Odisha',
        stateCode: 21,
        abrv: 'OD',
    },
    {
        stateName: 'Pondicherry',
        stateCode: 34,
        abrv: 'PY',
    },
    {
        stateName: 'Punjab',
        stateCode: 3,
        abrv: 'PB',
    },
    {
        stateName: 'Rajasthan',
        stateCode: 8,
        abrv: 'RJ',
    },
    {
        stateName: 'Sikkim',
        stateCode: 11,
        abrv: 'SK',
    },
    {
        stateName: 'Tamil Nadu',
        stateCode: 33,
        abrv: 'TN',
    },
    {
        stateName: 'Telangana',
        stateCode: 36,
        abrv: 'TS',
    },
    {
        stateName: 'Tripura',
        stateCode: 16,
        abrv: 'TR',
    },
    {
        stateName: 'Uttar Pradesh',
        stateCode: 9,
        abrv: 'UP',
    },
    {
        stateName: 'Uttarakhand',
        stateCode: 5,
        abrv: 'UK',
    },
    {
        stateName: 'West Bengal',
        stateCode: 19,
        abrv: 'WB',
    },
];

// ALL DAYS
interface GetDaysProps {
    key: number;
    value: string;
}
export const getDays: GetDaysProps[] = [
    {
        key: 0,
        value: 'Sunday',
    },
    {
        key: 1,
        value: 'Monday',
    },
    {
        key: 2,
        value: 'Tuesday',
    },
    {
        key: 3,
        value: 'Wednesday',
    },
    {
        key: 4,
        value: 'Thrusday',
    },
    {
        key: 5,
        value: 'Friday',
    },
    {
        key: 6,
        value: 'Saturday',
    },
];

// ALL RELATIONSHIPS
interface relationShipsProps {
    value: string;
    label: string;
}
export const RelationShipsData: relationShipsProps[] = [
    {
        value: 'FATHER',
        label: 'Father',
    },
    {
        value: 'MOTHER',
        label: 'Mother',
    },
    {
        value: 'HUSBAND',
        label: 'Husband',
    },
    {
        value: 'WIFE',
        label: 'Wife',
    },
    {
        value: 'SON',
        label: 'Son',
    },
    {
        value: 'DAUGHTER',
        label: 'Daughter',
    },
    {
        value: 'BROTHER',
        label: 'Brother',
    },
    {
        value: 'SISTER',
        label: 'Sister',
    },
    {
        value: 'GRANDCHILD',
        label: 'Grandchild',
    },
    {
        value: 'OTHER',
        label: 'Other',
    },
];

// ALL HEALTH SCHEMES
interface HealthSchemesProps {
    value: string;
    label: string;
}
export const HealthSchemesData: HealthSchemesProps[] = [
    {
        value: 'RGHS',
        label: 'RGHS',
    },
    {
        value: 'ECLHS',
        label: 'ECLHS',
    },
];
