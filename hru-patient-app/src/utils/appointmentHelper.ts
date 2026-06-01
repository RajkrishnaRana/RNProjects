import moment from 'moment';

export const getNextAppointment = (item: any) => {
    const today = new Date().valueOf();
    const dateTimeSlots = item?.dateTimeSlots;

    for (let i = 0; i < dateTimeSlots?.length; i++) {
        const timings = dateTimeSlots[i].timings;

        for (let j = 0; j < timings?.length; j++) {
            const endTime = timings[j].id.split('_')[1];

            if (today < Number(endTime)) {
                const slots = timings[j].slots;

                for (let k = 0; k < slots?.length; k++) {
                    if (today < slots[k].id) {
                        const date = moment(slots[k].id);

                        const isToday = date.isSame(today, 'day');
                        const time = date.format('h:mm A');

                        return isToday ? `Today, ${time}` : `${date.format('MMM D')}, ${time}`;
                    }
                }
            }
        }
    }
};
