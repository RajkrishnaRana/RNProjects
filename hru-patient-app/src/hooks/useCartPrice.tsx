import {useMemo} from 'react';

export default function useCartPrice(data: LabBooking[], labTestCategory: LabTestCategory[]) {
    const checkRadioLogy = (id: string) => {
        const testDetails = labTestCategory.find(test => test._id === id);
        return testDetails?.category === 'Radiology' ? true : false;
    };

    return useMemo(() => {
        let homeCollectionCount = 0,
            patientPickUpCount = 0;

        // Early return for empty or undefined data
        if (!data || data.length === 0) {
            return {
                totalCartPrice: 0,
                homeCollection: false,
                patientPickUp: false,
                collectionCharges: 0,
                pickUpCharges: 0,
                collectionChargeNotice: '',
            };
        }

        // Compute total price, homeCollection, and patientPickUp using reduce
        const {totalCartPrice, homeCollection, patientPickUp} = data.reduce(
            (acc, item) => {
                const price = item?.labDetails?.labPrice ?? item?.testDetails?.price ?? 0;

                if (item?.labDetails?.homeFacilityAvl === 'YES' && item?.testDetails?.homeCollection === 'Yes') homeCollectionCount++;
                if (item?.labDetails?.pickupDropAvl === 'YES' && checkRadioLogy(item?.testDetails?.labCategoryId)) patientPickUpCount++;

                const isHomeCollectionAvailable = homeCollectionCount === data.length;
                const isPatientPickUpAvailable = patientPickUpCount === data.length;

                return {
                    totalCartPrice: acc.totalCartPrice + price,
                    homeCollection: isHomeCollectionAvailable,
                    patientPickUp: isPatientPickUpAvailable,
                };
            },
            {totalCartPrice: 0, homeCollection: true, patientPickUp: true}
        );

        // Compute collection charges and notice
        const collectionCharges = homeCollection ? Number(data[0]?.labDetails?.smplCollectinChrges) || 0 : 0;
        const collectionChargeNotice = homeCollection && `**Collection Charge is free above ₹${data[0]?.labDetails?.freeSmplAbvCharges}`;

        // Compute pickup charges
        const pickUpCharges = patientPickUp ? Number(data[0]?.labDetails?.pickupCharges) || 0 : undefined;
        const pickUpAvailableUpto = patientPickUp ? Number(data[0]?.labDetails?.pickAvailableUpto) || 0 : undefined;

        console.log(
            'useCartPrice',
            homeCollectionCount,
            patientPickUpCount,
            totalCartPrice,
            homeCollection,
            patientPickUp,
            collectionCharges,
            pickUpCharges,
            collectionChargeNotice,
            pickUpAvailableUpto
        );

        return {
            totalCartPrice,
            homeCollection,
            patientPickUp,
            collectionCharges,
            pickUpCharges,
            collectionChargeNotice,
            pickUpAvailableUpto,
        };
    }, [data]);
}
