import { useEffect, useState } from 'react';
import { database } from '../../..';
import OfflineMaster from '../../model/offlineMaster';
import RequestParamMaster from '../../model/requestParamMaster';
import { Q } from '@nozbe/watermelondb';
import FileUploadMaster from '../../model/fileUploadMaster';
import WorkerMaster from '../../model/workerMaster';
import BatchMaster from '../../model/batchMaster';
import KamjariMaster from '../../model/kamjariMaster';
import ShiftMaster from '../../model/shiftMaster';
import Toast from 'react-native-toast-message';

export interface PendingOfflineData {
    requestId: number;
    url: string;
    deleteFile: boolean;
    retryCount: number;
    filePath: string;
    filePathSecond: string;
    appVersionName: string;
    /** Represents a boolean value as a string: "true" | "false" */
    manualEntry: string;
    deviceId: string;
    workerId: string;
    kamjariId: string;
    weighment: string;
    qtyCalculated: string;
    /** Unix timestamp in milliseconds */
    authenticationTime: string;
    recordTime: string;
    /** Represents a boolean value as a string: "true" | "false" */
    hasImage: string;
    /** Timezone offset in milliseconds (e.g., -19800000 for IST) */
    recordedTimeZoneOffset: string;
    divId: string;
    managerId: string;
    transactionId: string;
    companyId: string;
    bookId: string;
    requestType: 'POST' | 'GET';
    /** Unix timestamp for the start of the attendance day */
    attendanceDate: string;
    /** Names */
    workerName: string;
    kamjariName: string;
    batchName: string;
    shiftName: string;
}

export const usePendingOfflineDataScreen = () => {
    const [offlineData, setOfflineData] = useState<PendingOfflineData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const offlineCollection = database.collections.get<OfflineMaster>('offline_master');
        const requestParamCollection = database.collections.get<RequestParamMaster>('request_param_master');
        const fileUploadCollection = database.collections.get<FileUploadMaster>('file_upload_master');
        const workerMasterCollection = database.collections.get<WorkerMaster>('worker_master');
        const kamjariMasterCollection = database.collections.get<KamjariMaster>('kamjari_master');
        const batchMasterCollection = database.collections.get<BatchMaster>('batch_master');
        const shiftMasterCollection = database.collections.get<ShiftMaster>('shift_master');

        const offlineSub = offlineCollection
            .query()
            .observe()
            .subscribe({
                next: async records => {
                    try {
                        setLoading(true);
                        const offlineDataWithParams = [];
                        for (let i = 0; i < records.length; i++) {
                            if (records[i].requestURL === '/app/log-plucking-location.json' || records[i].requestURL === '/app/upload-image.json')
                                continue;

                            const [paramsRecords, fileRecord] = await Promise.all([
                                requestParamCollection.query(Q.where('request_id', records[i].requestId)).fetch(),
                                records[i].deleteFile && fileUploadCollection.query(Q.where('request_id', records[i].requestId)).fetch(),
                            ]);

                            const paramsObj: Record<string, string> = {};
                            for (let j = 0; j < paramsRecords.length; j++) {
                                paramsObj[paramsRecords[j].paramName] = paramsRecords[j].paramValue;
                            }

                            const [workerRecord, kamjariRecord, batchRecord, shiftRecord] = await Promise.all([
                                paramsObj.workerId && workerMasterCollection.query(Q.where('worker_id', paramsObj.workerId)).fetch(),
                                paramsObj.kamjariId && kamjariMasterCollection.query(Q.where('kamjari_id', paramsObj.kamjariId)).fetch(),
                                paramsObj.batch && batchMasterCollection.query(Q.where('batch_id', paramsObj.batch)).fetch(),
                                paramsObj.shift && shiftMasterCollection.query(Q.where('shift_id', paramsObj.shift)).fetch(),
                            ]);

                            offlineDataWithParams.push({
                                requestId: records[i].requestId,
                                url: records[i].requestURL,
                                deleteFile: records[i].deleteFile,
                                retryCount: records[i].retryCount,
                                filePath: fileRecord[0]?.filePath && `file://${fileRecord[0]?.filePath}`,
                                filePathSecond: fileRecord[0]?.filePathSecond && `file://${fileRecord[0]?.filePathSecond}`,
                                workerName: workerRecord === '' ? undefined : workerRecord?.[0]?.workerName,
                                kamjariName: kamjariRecord === '' ? undefined : kamjariRecord?.[0]?.kamjariName,
                                batchName: batchRecord === '' ? undefined : batchRecord?.[0]?.batchName,
                                shiftName: shiftRecord === '' ? undefined : shiftRecord?.[0]?.shiftCode,
                                ...paramsObj,
                            });
                        }
                        console.log('offlineDataWithParams', offlineDataWithParams);
                        setOfflineData(offlineDataWithParams as PendingOfflineData[]);
                    } catch (error: any) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error fetching offline data',
                        });
                        console.error(error);
                        return;
                    } finally {
                        setLoading(false);
                    }
                },
                error: err => {
                    console.error('WatermelonDB offlineMaster fetch error:', err);
                },
            });

        return () => {
            offlineSub.unsubscribe();
        };
    }, []);
    return {
        offlineData,
        loading,
    };
};
