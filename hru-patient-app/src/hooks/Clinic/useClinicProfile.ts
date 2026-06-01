import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import {BASE_URL} from '../../config';
import {useMemo} from 'react';
import {isIos} from '../../utils/platform';
import {Linking} from 'react-native';

export const useClinicProfile = (id: string) => {
    // GLOBAL STATES ----------------->

    // LOCAL STATES --------------------->

    // DATA FETCHING ------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/search-clinic`;
    // const url = 'https://461xnq9r-1378.inc1.devtunnels.ms/hru/Patientappapi/687f68c334f938cd9d51ddd0/search-clinic';
    const fetchClinicData = async () => {
        const res = await postData(url, {});
        console.log('ClinicProfileData', res);
        return res?.doc || [];
    };

    const {isLoading, error, data} = useQuery({
        queryKey: ['clinicProfile', id],
        queryFn: fetchClinicData,
    });

    // DATA PROCESSING ------------------->
    const clinicDetails = data?.clinicDetails;
    const getSpecialitiesDoctors = data?.getSpecialitiesDoctors;
    const hospitalReviews = data?.hospitalReviews;
    const uniqueSpecialities = data?.uniqueSpecialities;

    const totalRating = useMemo(() => {
        return Math.round(hospitalReviews?.reduce((acc: number, review: any) => acc + review.patientRatingToDoctor, 0));
    }, [hospitalReviews]);

    const goToClinicLocation = () => {
        const mapURL = isIos()
            ? `maps://?q=${clinicDetails?.address?.mapLocation?.latitude},${clinicDetails?.address?.longitude}&ll=${clinicDetails?.address?.mapLocation?.latitude},${clinicDetails?.address?.mapLocation?.longitude}&z=15`
            : `https://www.google.com/maps?q=${clinicDetails?.address?.mapLocation?.latitude},${clinicDetails?.address?.mapLocation?.longitude}}`;
        Linking.openURL(mapURL);
    };

    const galleryImages = clinicDetails?.galleryImages?.map((images: any) => ({
        uri: images?.imageUrl,
    }));

    const imageGallery = clinicDetails?.clinicProfileImgPath ? [{uri: clinicDetails.clinicProfileImgPath}, ...(galleryImages || [])] : [];

    return {
        isLoading,
        error,
        clinicDetails,
        imageGallery,
        getSpecialitiesDoctors,
        hospitalReviews,
        uniqueSpecialities,
        rating: totalRating / hospitalReviews?.length,
        goToClinicLocation,
    };
};
