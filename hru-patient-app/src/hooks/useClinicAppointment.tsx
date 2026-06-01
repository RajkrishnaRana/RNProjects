import {useMemo, useState} from 'react';

type ClinicAppointment = DaySchedule[] | undefined;

const useClinicAppointment = (data: ClinicAppointment, lab?: boolean) => {
    const [appointmentDates, setAppointmentDates] = useState<DateList[]>([]);
    const [selectedAppointmentTimings, setSelectedAppointmentTimings] = useState<Timing[] | undefined>();

    useMemo(() => {
        let dateLists: DateList[] = [];

        data?.forEach((item: DaySchedule, index: number) => {
            const date = item?.date?.split(',');
            const visibleDate = `${date[0]} ${date[1].trim().substring(0, 3)}`;
            const day = item?.day?.substring(0, 3);

            const newTimings = item?.timings?.map((timing: Timing) => {
                return {
                    ...timing,
                    slots: timing?.slots?.map((slot: Slot) => {
                        return {
                            ...slot,
                            isSelected: false,
                        };
                    }),
                };
            });

            dateLists.push({
                value: `${day}, ${visibleDate}`,
                isSelected: index == 0 ? true : false,
                timings: newTimings,
            });
        });

        setAppointmentDates(dateLists);
        setSelectedAppointmentTimings(dateLists?.[0]?.timings);
    }, [data]);

    return {
        appointmentDates,
        setAppointmentDates,
        selectedAppointmentTimings,
        setSelectedAppointmentTimings,
    };
};

export default useClinicAppointment;
