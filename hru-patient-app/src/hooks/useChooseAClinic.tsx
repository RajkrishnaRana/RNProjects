function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

const useChooseAClinic = (data: ClinicInfo) => {
    const imageBasePath = data?.clinicImgBasePath;
    const clinicImgArr = data?.imageOfClinic?.map(item => {
        return {
            uri: item?.basePath,
        };
    });

    clinicImgArr?.unshift({uri: imageBasePath});

    const clinicName = data?.workLocation;

    const clinicInfoArray = [
        {
            imgSrc: require('../assets/icons/location.png'),
            detail: data.locationAddress,
        },
        {
            imgSrc: require('../assets/icons/running.png'),
            detail: `₹${data?.consultationFee} (In Clinic Consultation Cost)`,
        },
        {
            imgSrc: require('../assets/icons/cell-phone.png'),
            detail: data?.virtualConsultationFee
                ? `₹${data?.virtualConsultationFee} (Remote Consultation Cost)`
                : 'Remote Consultation Not Available',
        },
    ];

    const aboutClinic = data?.aboutClinic;

    const scheduleArr: {day: string; value: string}[] = [];
    const daysOfWeek: (keyof ClinicInfo)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    daysOfWeek.forEach((day: keyof ClinicInfo) => {
        const schedule = data?.[day]?.map((item: AppointmentDay) => `${item?.from} - ${item?.to}`).join(' & ') || '';

        if (schedule) {
            scheduleArr.push({
                day: capitalizeFirstLetter(day),
                value: schedule.trim(),
            });
        }
    });

    return {
        imageBasePath,
        clinicImgArr,
        clinicName,
        clinicInfoArray,
        aboutClinic,
        scheduleArr,
    };
};

export default useChooseAClinic;
