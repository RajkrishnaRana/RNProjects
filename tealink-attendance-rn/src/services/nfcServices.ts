import Toast from 'react-native-toast-message';
import databaseServices from './databaseServices';
import { getCurrentRoute } from './navigationServices';

interface NDEFMessage {
    payload: number[];
    id: string;
    type: number[];
    tnf: number;
}

const nfcServices = {
    routeHandle: async (data: NDEFMessage, navigation: any) => {
        const name = getCurrentRoute()?.name;
        const { getWorkerByWorkerId } = databaseServices;

        // console.log('name', name);
        // console.log('workerId', workerId);

        if (name === 'Plucking In Time' || name === 'Record Non Plucking' || name === 'Record Plucking' || name === 'Bluetooth') {
            return;
        } else {
            const workerId = data?.payload?.map(b => b.toString(16).padStart(2, '0')).join('');

            const record = await getWorkerByWorkerId(workerId);
            if (record === null) {
                Toast.show({
                    type: 'error',
                    text1: 'No worker found with this NFC Card',
                });
                return;
            }

            if (name === 'Worker Profile') {
                navigation.replace('Worker Profile', { item: record });
            } else {
                navigation.push('Worker Profile', { item: record });
            }
        }
    },
};

export default nfcServices;
