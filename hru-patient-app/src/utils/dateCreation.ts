import moment from 'moment';

const formatDate = (date: moment.Moment) => {
  return date.format('ddd, Do MMM'); // Format the date as "Friday, 6th Nov"
};

export const getCurrentDate = () => {
  const today = moment(); // Get today's date using Moment.js
  return formatDate(today);
};

export const generateDates = (noOfMonths: number) => {
  const dates = [];
  const today = moment(); // Get today's date using Moment.js
  const endDate = moment().add(noOfMonths, 'months'); // Set the end date to 3 months from today

  let cnt = 1;

  // Loop through each day from today to the end date
  while (today.isSameOrBefore(endDate, 'day')) {
    dates.push({
      isoDate: today.clone().format('YYYY-MM-DD'),
      date: formatDate(today.clone()),
      isSelected: cnt === 1 ? true : false,
    }); // Push a clone of the current date
    today.add(1, 'day'); // Move to the next day
    cnt = 0; // set cnt 0, so now isSelected will be false
  }

  return dates;
};

export const generateClinicTimes = (startHour: number, endHour: number) => {
  const startTime = moment().hour(startHour).minute(0); // Start at 10 AM
  const endTime = moment().hour(endHour).minute(0); // End at 3 PM
  const times = [];

  let cnt = 1;

  // Generate times with 1-hour difference
  for (
    let m = startTime;
    m.isBefore(endTime) || m.isSame(endTime);
    m.add(30, 'minutes')
  ) {
    times.push({
      time: m.format('hh:mm A'),
      isoTime: m.format('HH:mm:ss'),
      isSelected: cnt ? true : false,
    }); // Format the time
    cnt = 0;
  }

  return times;
};
