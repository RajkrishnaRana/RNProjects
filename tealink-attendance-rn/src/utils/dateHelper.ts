import moment from 'moment-timezone';

export function getValidTime(authenticationTime: string, recordTime: string) {
    const time = Number(recordTime || authenticationTime);
    const timeString = moment(time).format('DD-MM-YYYY, hh:mm:ss A');
    return timeString;
}

export const getTimezoneOffset = (timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset', // This key gets the offset as a string
    });
    const parts = formatter.formatToParts(new Date());
    const offsetPart = parts.find(part => part.type === 'timeZoneName');

    // The offsetPart.value will be a string like "GMT-4" or "GMT+5:30"
    if (offsetPart) {
        const match = offsetPart.value.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = match[2] ? parseInt(match[2], 10) : 0;
            const ans = hours * 60 + (hours >= 0 ? minutes : -minutes);
            return ans * -1 * 60 * 1000; // This is for matching this function result with the native js function result which is new Date().getTimezoneOffset()
        }
    }
    return null;
};
