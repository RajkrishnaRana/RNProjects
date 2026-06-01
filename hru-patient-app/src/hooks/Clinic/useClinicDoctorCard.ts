import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import Toast from 'react-native-simple-toast';
import {postData} from '../../api';
import {BASE_URL} from '../../config';
import {useNavigation} from '../useNavigation';
import {useQueryClient} from '@tanstack/react-query';
import {useBookAppointmentStore} from '../../store/bookAppointmentStore';

const useClinicDoctorCard = (data: any, id: string) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const setDoctorDetails = useBookAppointmentStore(s => s.setDoctorDetails);

    // LOCAL STATES ------------------------------>
    const [isLoading, setIsLoading] = useState(true);
    const [navLoading, setNavLoading] = useState(false);
    const [nextAvailability, setNextAvailability] = useState<string | null>(null);

    const nextAvailabilityDay = (slotTimeObj: any) => {
        // console.log({slotTimeObj});

        // Early return if slotTimeObj is not available or doesn't have required properties
        if (!slotTimeObj || !slotTimeObj.timings || !Array.isArray(slotTimeObj.timings) || slotTimeObj.timings.length === 0) {
            return undefined;
        }

        // Additional validation for displayH and first timing
        if (!slotTimeObj.displayH || !slotTimeObj.timings[0]?.display) {
            return undefined;
        }

        // Get today and tomorrow
        const today = moment();
        const tomorrow = moment().add(1, 'day');

        // Get day names
        const todayName = today.format('dddd'); // e.g., "Monday"
        const tomorrowName = tomorrow.format('dddd'); // e.g., "Tuesday"

        let dayName = '';
        if (slotTimeObj?.displayH === todayName) {
            dayName = 'Today';
        } else if (slotTimeObj?.displayH === tomorrowName) {
            dayName = 'Tomorrow';
        } else {
            dayName = slotTimeObj?.displayH;
        }

        const slots = slotTimeObj.timings?.[0]?.slots;
        const time = (() => {
            const future = slots?.find((s: any) => today.valueOf() < s.id);
            if (!future) {
                return '';
            }
            return moment(future.id).format('h:mm A');
        })();

        return `${dayName} at ${time}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setNextAvailability(null); // Reset availability

                const clinicIds = data?.addresses?.map((address: any) => address.id);
                // console.log('clinicIds', clinicIds);

                // Called the API for getting the timings
                const url = `${BASE_URL}/patient/get-doctor-appointment-slots-v3.json`;
                // const url = `https://76bae456e0d8.ngrok-free.app/patient/get-doctor-appointment-slots-v3.json`;
                const res = await postData(url, {doctorId: data?._id, clinicIds: clinicIds});
                if (!res.status) {
                    Toast.show(res.msg, Toast.SHORT);
                    throw new Error(res.msg);
                }

                // console.log('SpecialitiesDoctorResInternal', res);

                const availability = nextAvailabilityDay(res.docs?.[0]?.day);
                // console.log('availability', availability);
                setNextAvailability(availability || null);
            } catch (error) {
                console.error(error);
                setNextAvailability(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data]);

    const doctorRatingDetails = data?.doctorRatingDetails;
    const totalRating = useMemo(() => {
        return Math.round(doctorRatingDetails.reduce((acc: number, review: any) => acc + review.patientRatingToDoctor, 0));
    }, [doctorRatingDetails]);

    const navigateToBooking = async () => {
        setNavLoading(true);
        const url = `${BASE_URL}/hru/Patientappapi/${data?._id}/doctorprofile`;

        const doctorProfileData = await queryClient.fetchQuery({
            queryKey: ['doctorProfile' + data?._id],
            queryFn: () => postData(url),
        });

        setDoctorDetails(doctorProfileData?.doc?.doctorDetails);
        const item = doctorProfileData?.doc?.doctorDetails?.addresses?.filter((address: any) => address?.id === id);
        navigation.push('ClinicAppointment', {data: item?.[0], resheduleResponse: null, rescheduleAmount: null});
        setNavLoading(false);
    };

    return {totalRating, doctorRatingDetails, isLoading, nextAvailability, navLoading, navigateToBooking};
};

export default useClinicDoctorCard;
