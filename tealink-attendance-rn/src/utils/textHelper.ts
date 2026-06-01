import uuid from 'react-native-uuid';

export const overFlowText = (text: string, limit: number) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    } else {
        return text;
    }
};

export const makeProfileIconText = (text: string) => {
    if (!text || text.length === 0) return;

    const arr = text.split(' ');
    let res = '';
    for (let i = 0; i < arr.length; i++) {
        res += arr[i][0];

        if (res.length === 2) return res;
    }

    return res;
};

export const getGenderIconName = (gender: string) => {
    const lowerCaseGender = gender.toLocaleLowerCase();
    if (lowerCaseGender === 'female') return 'gender-female';
    if (lowerCaseGender === 'transgender') return 'gender-transgender';
    else return 'gender-male';
};

export const createTransactionId = () => {
    return `${uuid.v4()}${Date.now()}`;
};

export const companyRoundOffOrg = (roundOff: string | null | undefined, value: number): number => {
    // Default to "round" if null or undefined
    const strategy = roundOff ?? 'round';

    let toReturn: number = value;

    if (strategy === 'round') {
        toReturn = Math.round(value);
    } else if (strategy === 'floor') {
        toReturn = Math.floor(value);
    } else if (strategy === 'ceil') {
        toReturn = Math.ceil(value);
    } else if (strategy === 'none') {
        toReturn = value;
    }

    // Mimic Java's (int) truncation: Math.trunc() removes decimal parts
    if (Math.trunc(toReturn) < 0) {
        return 0;
    }

    // Special handling for small positive values that round/truncate to zero
    if (value > 0 && Math.trunc(toReturn) === 0) {
        if (value > 0.5) {
            return 0.5;
        } else {
            // Replicates Java's DecimalFormat with max 1 fraction digit:
            // df.format(value) -> Double.parseDouble()
            return Number(value.toFixed(1));
        }
    }

    // Final return mimics Java's (int) cast truncation
    return Math.trunc(toReturn);
};
