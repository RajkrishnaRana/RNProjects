import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

function formatTimestampTo12Hour(timestamp: number) {
    dayjs.extend(customParseFormat);
    // Create a Date object from the timestamp
    const date = new Date(timestamp);
    // console.log(timestamp);

    // Get hours and minutes
    let hours = date.getHours();

    const minutes = date.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Return the formatted time string
    return `${hours}:${formattedMinutes} ${ampm}`;
}

const toMs = (dateStr: string): number => dayjs(dateStr, 'MM/DD/YYYY, hh:mm A').valueOf();

const todayOrNot = (evt: {date: string; name: string}) => {
    const cleanDateStr = evt.date.replace(/(\d+)(st|nd|rd|th)/, '$1'); // "Sun, Sep 21st 2025" → "Sun, Sep 21 2025"
    console.log('cleanDateStr', cleanDateStr);
    const ms = dayjs(cleanDateStr, 'ddd, MMM D YYYY', true).valueOf();

    if (!Number.isFinite(ms)) {
        console.log('invalid date', ms);
        return;
    }

    const start = dayjs().startOf('day').valueOf(); // 00:00:00.000 today
    const end = dayjs().endOf('day').valueOf(); // 23:59:59.999 today
    return ms >= start && ms <= end;
};

export {formatTimestampTo12Hour, toMs, todayOrNot};
