import { useState } from 'react';
import WorkerMaster from '../../model/workerMaster';

const useWorkerIdentificationSection = (findWorker: () => Promise<WorkerMaster[]>) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isWorkerListModalVisible, setWorkerListModalVisible] = useState(false);
    const [workerList, setWorkerList] = useState<WorkerMaster[]>([]);

    const handleManualWorkerSelect = async () => {
        const workers = await findWorker();
        if (workers.length === 0) {
            return;
        } else if (workers.length === 1) {
            setModalVisible(true);
        } else {
            setWorkerList(workers);
            setWorkerListModalVisible(true);
        }
    };

    return {
        isModalVisible,
        setModalVisible,
        handleManualWorkerSelect,
        workerList,
        isWorkerListModalVisible,
        setWorkerListModalVisible,
    };
};

export default useWorkerIdentificationSection;
