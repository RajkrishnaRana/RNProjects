import RNCalendarEvents from 'react-native-calendar-events';
import {eventCreateObjProps} from '../types/dateObjTypes';
import moment from 'moment';

async function requestCalendarPermission() {
  const status = await RNCalendarEvents.checkPermissions();
  if (status !== 'authorized') {
    const newStatus = await RNCalendarEvents.requestPermissions();
    if (newStatus !== 'authorized') {
      console.log('Calendar permission denied');
      return false;
    }
  }
  return true;
}

export async function addEventToCalendar(eventDetails: eventCreateObjProps) {
  const hasPermission = await requestCalendarPermission();
  if (!hasPermission) return;

  try {
    const {title, time, date} = eventDetails;
    const initialDateTime = moment(`${date}T${time}Z`, moment.ISO_8601);
    // Add 30 minutes
    const isoDateTimePlus30Min = initialDateTime
      .add(30, 'minutes')
      .toISOString();

    const eventId = await RNCalendarEvents.saveEvent('Doctor Appointment', {
      startDate: initialDateTime.toISOString(), // Use ISO format
      endDate: isoDateTimePlus30Min,
      location: '123 Health St, Medical City',
      notes: 'Annual check-up with Dr. Smith',
      alarms: [{date: 15}], // 15 minutes before
    });
    console.log('Event added with ID:', eventId);
  } catch (error) {
    console.error('Error adding event:', error);
  }
}
