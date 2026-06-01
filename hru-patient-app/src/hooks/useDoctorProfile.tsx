import {useMemo} from 'react';
import {getName, imageSelector} from '../utils';

const useDoctorProfile = (data: any) => {
    return useMemo(() => {
        const doctorDetail = data?.doctorDetails;

        // Doctor Header Data
        const doctorProfileImg = imageSelector(doctorDetail?.doctorProfileImgPath, 'DOCTOR');
        const drName = getName(doctorDetail?.firstName, doctorDetail?.middleName, doctorDetail?.lastName, doctorDetail?.doctorType);
        const designation = doctorDetail?.specialities?.join(', ');
        const drRating = doctorDetail?.ratingDetails?.patientRatingToDoctor || 0;

        // Doctor Statistics Data
        let totalYrsExperience = 0;
        doctorDetail?.experiences?.forEach((e: DrExperienceDetails) => {
            totalYrsExperience += e.experienceYearTo - e.experienceYearFrom;
        });

        const totalPatientsRating = data?.patientFeedbacks?.reduce((acc: number, curr: any) => acc + curr.patientRatingToDoctor, 0) || 0;
        const totalReviews = data?.patientFeedbacks?.length || 0;
        const totalPatientGiveRating = doctorDetail?.ratingDetails?.remarksCount || 0;

        // Doctor Information Data
        const registration = doctorDetail?.registrations?.[0]?.regNo;
        let certificates = '';
        doctorDetail?.certificates?.forEach((certificate: DrCertificate) => {
            certificates += certificate.specialization + ', ';
        });

        let awards = '';
        doctorDetail?.awards?.forEach((award: DrAward) => {
            awards += `${award.awardName}(${award.awardyear}), `;
        });

        let experiences = '';
        doctorDetail?.experiences?.forEach((experience: DrExperience) => {
            experiences += `${experience.experienceDetails}(${experience.experienceYearFrom}-${experience.experienceYearTo}), `;
        });

        let education = '';
        doctorDetail?.educations?.forEach((e: DrEducation) => {
            education += `${e.degree}(${e.instituteName} - ${e.educationYear}), `;
        });

        let services = '';
        doctorDetail?.services?.forEach((s: string) => {
            services += `${s}, `;
        });

        //Doctor Info
        const aboutDoctor = doctorDetail?.aboutMe;

        const email = doctorDetail?.email;
        const phone = doctorDetail?.mobileNumber;
        const address = doctorDetail?.addressLineOne;

        return {
            doctorProfileImg,
            drName,
            designation,
            drRating,
            totalYrsExperience,
            totalPatientsRating,
            totalReviews,
            totalPatientGiveRating,
            registration,
            certificates,
            awards,
            experiences,
            education,
            services,
            aboutDoctor,
            email,
            phone,
            address,
        };
    }, [data]);
};

export default useDoctorProfile;
