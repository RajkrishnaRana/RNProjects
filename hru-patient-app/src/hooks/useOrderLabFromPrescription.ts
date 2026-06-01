import {queryClient} from '../../App';
import {postData} from '../api';
import {BASE_URL} from '../config';
import {useAuthStore} from '../store/authStore';
import Toast from 'react-native-simple-toast';
import {useNavigation} from './useNavigation';

export const useOrderLabFromPrescription = (data: any) => {
    const {token} = useAuthStore();
    const navigation = useNavigation();

    const handleOrderLab = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/labtestaddtocart.json`;
        const payload = {
            token: token,
            appointmentId: data?._id,
            labNames: data?.labs?.map((lab: any) => lab.testLabName),
        };

        try {
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            Toast.show(`${res.msg}`, Toast.SHORT);
            await queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });
            navigation.push('Cart');
        } catch (e) {
            console.error(e);
        }
    };

    return {
        handleOrderLab,
    };
};
