import { Q } from '@nozbe/watermelondb';
import { database } from '../..';
import AuthorizedUserMaster from '../model/authorizedUserMaster';
import BatchMaster from '../model/batchMaster';
import BookMaster from '../model/bookMaster';
import KamjariMaster from '../model/kamjariMaster';
import SectionMaster from '../model/sectionMaster';
import ShiftMaster from '../model/shiftMaster';
import WorkerMaster from '../model/workerMaster';
import WorkerTypeMaster from '../model/workerTypeMaster';
import AttendanceMaster from '../model/attendanceMaster';
import Toast from 'react-native-toast-message';
import PluckedQuantityMaster from '../model/pluckedQuantityMaster';
import RNBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import OfflineMaster from '../model/offlineMaster';
import apiEndpoints, { APIEndpoint } from '../constants/apiEndpoints';
import FileUploadMaster from '../model/fileUploadMaster';
import { Images } from '../hooks/screenHooks/useMarkTime';
import RequestParamMaster from '../model/requestParamMaster';
import { postData } from './apiServices';
import SyncMaster from '../model/syncMaster';
import uuid from 'react-native-uuid';

const databaseServices = {
    initializeDbFromLoginData: async (data: any, workerIdMap: Record<string, string>) => {
        const workerMasterCollection = database.get<WorkerMaster>('worker_master');
        const kamjariMasterCollection = database.get<KamjariMaster>('kamjari_master');
        const sectionMasterCollection = database.get<SectionMaster>('section_master');
        const bookMasterCollection = database.get<BookMaster>('book_master');
        const workerTypeMasterCollection = database.get<WorkerTypeMaster>('worker_type_master');
        const batchMasterCollection = database.get<BatchMaster>('batch_master');
        const shiftMasterCollection = database.get<ShiftMaster>('shift_master');
        const authorizedUserMasterCollection = database.get<AuthorizedUserMaster>('authorized_user_master');

        await database.write(async () => {
            // 1. Check if any existing Data is there or not
            await workerMasterCollection.query().destroyAllPermanently();
            await kamjariMasterCollection.query().destroyAllPermanently();
            await sectionMasterCollection.query().destroyAllPermanently();
            await bookMasterCollection.query().destroyAllPermanently();
            await workerTypeMasterCollection.query().destroyAllPermanently();
            await batchMasterCollection.query().destroyAllPermanently();
            await shiftMasterCollection.query().destroyAllPermanently();
            await authorizedUserMasterCollection.query().destroyAllPermanently();

            // 3. Create New rows accroding to the data from server
            const toCreateWorkerMaster = data?.workers?.map((worker: Worker) =>
                workerMasterCollection.prepareCreate((record: WorkerMaster) => {
                    record.workerId = worker._id.toLowerCase();
                    record.workerName = worker.workerName;
                    record.workerCode = worker.workerCode;
                    record.workerGender = worker.gender;
                    record.workerType = worker.workerType ?? '';
                    record.workerTypeName = worker.workerTypeName ?? 'N/A';
                    record.workerSubType = worker.workerSubType ?? '';
                    record.workerSubTypeName = worker.workerSubTypeName ?? 'N/A';
                    record.workerBookId = worker.book;
                    record.workerBookName = worker.bookName;
                    record.workerKamjariId = worker.kamjariId ?? '';
                    record.workerKamjariName = worker.kamjariName ?? 'N/A';
                    record.workerSectionId = worker.sectionId ?? '';
                    record.workerSectionName = worker.sectionName ?? 'N/A';
                    record.workerEmpNo = worker.empNo ?? 999999;
                    record.workerDivision = worker.div ?? '';
                    record.workerBookEmpNo = `${worker.bookName ?? ''}-${worker.empNo ?? 999999}`;
                    record.workerDefaultKamjari = worker.defaultKamjari ?? '';
                    record.profileImage = Boolean(worker.profileImage);
                    record.workerImagePath = workerIdMap[worker._id.toLowerCase()] ?? '';
                }),
            );
            const toCreateKamjariMaster = data?.kamjaris?.map((kamjari: Kamjari) =>
                kamjariMasterCollection.prepareCreate((record: KamjariMaster) => {
                    record.kamjariId = kamjari.id;
                    record.kamjariCode = kamjari.code;
                    record.kamjariName = kamjari.name;
                    record.kamjariIsActive = kamjari.isActive;
                    record.kamjariParentId = kamjari.parent;
                    record.kamjariType = kamjari.type;
                    record.kamjariIsDefault = kamjari.isDefault;
                }),
            );
            const toCreateSectionMaster = data?.sections?.map((section: Section) =>
                sectionMasterCollection.prepareCreate((record: SectionMaster) => {
                    record.sectionId = section.id;
                    record.sectionCode = section.code;
                    record.sectionName = section.name;
                    record.sectionIsActive = section.isActive;
                }),
            );
            const toCreateBookMaster = data?.books?.map((book: Book) =>
                bookMasterCollection.prepareCreate((record: BookMaster) => {
                    record.bookId = book.id;
                    record.bookName = book.name;
                }),
            );
            const toCreateWorkerTypeMaster = data?.workerTypes?.map((workerType: WorkerType) =>
                workerTypeMasterCollection.prepareCreate((record: WorkerTypeMaster) => {
                    record.workerTypeId = workerType.id;
                    record.workerTypeName = workerType.name;
                    record.workerTypeSubType = workerType.subtypes;
                }),
            );
            const toCreateBatchMaster = data?.batches?.map((batch: Batch) =>
                batchMasterCollection.prepareCreate((record: BatchMaster) => {
                    record.batchId = batch.id;
                    record.batchName = batch.name;
                    record.divId = batch.div;
                    record.shiftId = batch.defaultShift;
                    record.batchType = batch.type;
                }),
            );
            const toCreateShiftMaster = data?.shifts?.map((shift: Shift) =>
                shiftMasterCollection.prepareCreate((record: ShiftMaster) => {
                    record.shiftId = shift._id;
                    record.shiftCode = shift.code;
                    record.kamjariId = shift.kamjariId;
                }),
            );
            const toCreateAuthorizedUserMaster = data?.authorisedUsers?.map((authorizeUser: AuthorizedUser) =>
                authorizedUserMasterCollection.prepareCreate((record: AuthorizedUserMaster) => {
                    record.userId = authorizeUser._id;
                    record.userName = authorizeUser.name;
                    record.userEmail = authorizeUser.email;
                }),
            );

            // 4. Batch insert new rows
            await database.batch([
                ...toCreateWorkerMaster,
                ...toCreateKamjariMaster,
                ...toCreateSectionMaster,
                ...toCreateBookMaster,
                ...toCreateWorkerTypeMaster,
                ...toCreateBatchMaster,
                ...toCreateShiftMaster,
                ...toCreateAuthorizedUserMaster,
            ]);
        });

        console.log('Database is now initialized with the server data');
    },
    getWorkerByWorkerId: async (workerId: string): Promise<WorkerMaster | null> => {
        const collection = database.get<WorkerMaster>('worker_master');
        const [record] = await collection.query(Q.where('worker_id', workerId)).fetch();
        // console.log('record', record);
        return record ?? null;
    },
    getWorkerByWorkerCode: async (workerCode: string): Promise<WorkerMaster[]> => {
        const trimmedCode = workerCode.trim();
        const hasNumbers = /\d/.test(trimmedCode);

        if (trimmedCode === '') {
            Toast.show({
                type: 'warning',
                text1: 'Warning',
                text2: 'Worker code/name cannot be empty',
            });
            return [];
        }

        if (trimmedCode.length < 2) {
            Toast.show({
                type: 'warning',
                text1: 'Warning',
                text2: 'Enter at least 2 characters',
            });
            return [];
        }

        const collection = database.get<WorkerMaster>('worker_master');
        try {
            if (hasNumbers) {
                const code = workerCode.toLocaleUpperCase();
                const record = await collection.query(Q.where('worker_code', code)).fetch();
                if (record.length === 0) {
                    Toast.show({
                        type: 'error',
                        text1: 'Worker Not Found',
                        text2: 'Please enter a valid worker code',
                    });
                    return [];
                }

                return record;
            }

            const nameRecord = await collection.query(Q.where('worker_name', Q.like(`${trimmedCode}%`))).fetch();
            // console.log('nameRecord', nameRecord);
            if (nameRecord.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Worker Not Found',
                    text2: 'Please enter a valid worker first name',
                });
                return [];
            }

            return nameRecord;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    insertToAttendanceMaster: async (data: any) => {
        const collection = database.get<AttendanceMaster>('attendance_master');

        // const resolvedShiftId = data?.shift ?? '';
        // console.log('[insertToAttendanceMaster] incoming data:', data);
        // console.log('[insertToAttendanceMaster] resolved shiftId:', resolvedShiftId);

        try {
            await database.write(async () => {
                const toCreateAttendanceMaster = collection.prepareCreate((record: AttendanceMaster) => {
                    record.workerId = data.workerId;
                    record.batchId = data?.batch ?? '';
                    record.sectionId = data?.sectionId ?? '';
                    record.shiftId = data?.shift ?? '';
                    record.kamjariId = data?.kamjariId ?? '';
                    record.attendanceDate = String(data.attendanceDate || data.recordDate) ?? '';
                    record.attendanceTime = String(data.attendanceTime || data.recordTime);
                });

                await database.batch(toCreateAttendanceMaster);
            });

            Toast.show({
                type: 'success',
                text1: 'Attendance Recorded',
                text2: 'Attendance recorded successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to record attendance in the database',
            });
            console.error(error);
        }
    },
    getTotalWorkersCount: async () => {
        const collection = database.get<WorkerMaster>('worker_master');
        const count = await collection.query().fetchCount();
        return count;
    },
    insertToPluckedQuantityMaster: async (data: any) => {
        const collection = database.get<PluckedQuantityMaster>('plucked_quantity_master');
        try {
            await database.write(async () => {
                const toCreatePluckedQuantityMaster = collection.prepareCreate((record: PluckedQuantityMaster) => {
                    record.workerId = data.workerId;
                    record.recordQuantity = data.qtyCalculated;
                    record.weighmentNumber = data.weighment;
                    record.sectionCode = data.sectionId;
                    record.batchId = data?.batch ?? '';
                    record.shiftId = data?.shift ?? '';
                    record.kamjariId = data?.kamjariId ?? '';
                    record.recordDate = String(data.recordDate);
                    record.recordTime = String(data.recordTime);
                });
                await database.batch(toCreatePluckedQuantityMaster);

                Toast.show({
                    type: 'success',
                    text1: 'Plucked Weighment Recorded',
                    text2: 'Plucked weighment recorded successfully',
                });
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to record weighment in the database',
            });
            console.error(error);
        }
    },
    exportDBFile: async () => {
        try {
            // Source path depends on platform
            const sourcePath = `/data/data/in.tealink.garden/watermelon.db`;

            if ((Platform.Version as number) >= 29) {
                // Android 10+ (API 29+) - Use MediaStore for public Downloads
                const fileName = `database_backup_${new Date().toDateString()}.data`;

                // First copy to cache
                const cachePath = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;
                await RNBlobUtil.fs.cp(sourcePath, cachePath);

                // Then move to public Downloads using MediaStore
                const destPath = await RNBlobUtil.MediaCollection.copyToMediaStore(
                    {
                        name: fileName,
                        parentFolder: 'TealinkAttendance',
                        mimeType: 'application/octet-stream',
                    },
                    'Download',
                    cachePath,
                );

                // Clean up cache file
                await RNBlobUtil.fs.unlink(cachePath);
                console.log('SQLite database exported to:', destPath);
            } else {
                // Android 9 and below - Direct access to public Downloads
                const destPath = '/storage/emulated/0/Download/database_backup.data';

                // Copy the database file
                await RNBlobUtil.fs.cp(sourcePath, destPath);
                console.log('SQLite database exported to:', destPath);
            }

            Toast.show({
                type: 'success',
                text1: 'Database Exported',
                text2: 'Database file stored in your download folder successfully',
            });
        } catch (error) {
            console.error('SQLite export failed:', error);
            Toast.show({
                type: 'error',
                text1: 'Export Error',
                text2: 'Database export failed',
            });
        }
    },
    insertToOfflineMaster: async (data: any, filePath: Images, urlHandler: APIEndpoint) => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');
        const fileUploadCollection = database.get<FileUploadMaster>('file_upload_master');
        const requestParamCollection = database.get<RequestParamMaster>('request_param_master');

        try {
            const requestId = Date.now();
            await database.write(async () => {
                const batchRecords: any[] = [];

                const toCreateOfflineMaster = offlineCollection.prepareCreate((record: OfflineMaster) => {
                    record.requestId = requestId;
                    record.requestType = data.requestType;
                    record.requestURL = apiEndpoints[urlHandler];
                    record.requestBody = '';
                    record.requestIdentifier = '';
                    record.underProcessing = false;
                    record.retryCount = 0;
                    record.deleteFile = filePath ? true : false;
                });
                batchRecords.push(toCreateOfflineMaster);

                if (filePath) {
                    const toCreateFileUploadMaster = fileUploadCollection.prepareCreate((record: FileUploadMaster) => {
                        record.requestId = requestId;
                        record.filePath = filePath?.firstShot || '';
                        record.filePathSecond = filePath?.shot || '';
                        record.fileName = 'workerImage';
                    });
                    batchRecords.push(toCreateFileUploadMaster);
                }

                // Delete unnecessary fields
                delete data.attendaceDate;
                delete data.attendanceTime;

                const toCreateRequestParamMaster = Object.entries(data).map(([key, value]) =>
                    requestParamCollection.prepareCreate((record: RequestParamMaster) => {
                        record.requestId = requestId;
                        record.paramName = key;
                        record.paramValue = String(value);
                    }),
                );
                batchRecords.push(...toCreateRequestParamMaster);

                await database.batch(...batchRecords);
            });

            // Toast.show({
            //     type: 'success',
            //     text1: 'Offline Data Recorded',
            //     text2: 'Offline data recorded successfully',
            // });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to record offline data in the database',
            });
            console.error(error);
        }
    },
    insertToOfflineMasterForLocation: async (requestType: string, data: string, urlHandler: APIEndpoint) => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');

        try {
            const requestId = uuid.v4();
            await database.write(async () => {
                const toCreateOfflineMaster = offlineCollection.prepareCreate((record: OfflineMaster) => {
                    record.requestId = requestId;
                    record.requestType = requestType;
                    record.requestURL = apiEndpoints[urlHandler];
                    record.requestBody = data;
                    record.requestIdentifier = '';
                    record.underProcessing = false;
                    record.retryCount = 0;
                    record.deleteFile = false;
                });

                await database.batch(toCreateOfflineMaster);
            });

            // Toast.show({
            //     type: 'success',
            //     text1: 'Offline Data Recorded',
            //     text2: 'Offline data recorded for location successfully',
            // });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to record offline data in the database',
            });
            console.error(error);
        }
    },
    insertWorkerImage: async (workerId: string, uri: string) => {
        try {
            const workerMasterCollection = database.get<WorkerMaster>('worker_master');
            await database.write(async () => {
                const workers = await workerMasterCollection.query(Q.where('worker_id', workerId)).fetch();

                if (workers.length > 0) {
                    console.log('new and old', workers[0].workerImagePath, uri);
                    const worker = workers[0];
                    await worker.update(w => {
                        w.workerImagePath = uri;
                    });

                    Toast.show({
                        type: 'success',
                        text1: 'Worker image updated successfully',
                        text2: 'View Updated image after reopening the screen',
                        visibilityTime: 5000,
                    });
                } else {
                    console.warn(`Worker with ID ${workerId} not found`);
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    insertToOfflineMasterForWorkerImage: async (requestType: string, data: any, urlHandler: APIEndpoint) => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');
        const fileUploadCollection = database.get<FileUploadMaster>('file_upload_master');
        const requestParamCollection = database.get<RequestParamMaster>('request_param_master');

        try {
            const requestId = uuid.v4();
            await database.write(async () => {
                const toCreateOfflineMaster = offlineCollection.prepareCreate((record: OfflineMaster) => {
                    record.requestId = requestId;
                    record.requestType = requestType;
                    record.requestURL = apiEndpoints[urlHandler];
                    record.requestBody = '';
                    record.requestIdentifier = '';
                    record.underProcessing = false;
                    record.retryCount = 0;
                    record.deleteFile = true;
                });

                const toCreateFileUploadMaster = fileUploadCollection.prepareCreate((record: FileUploadMaster) => {
                    record.requestId = requestId;
                    record.filePathSecond = data?.profileImage || '';
                    record.fileName = 'profile.jpg';
                });
                await database.batch(toCreateFileUploadMaster);

                delete data.profileImage;

                const toCreateRequestParamMaster = Object.entries(data).map(([key, value]) =>
                    requestParamCollection.prepareCreate((record: RequestParamMaster) => {
                        record.requestId = requestId;
                        record.paramName = key;
                        record.paramValue = String(value);
                    }),
                );

                await database.batch(toCreateOfflineMaster, ...toCreateRequestParamMaster);
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to record offline data in the database',
            });
            console.error(error);
        }
    },
    syncData: async (baseURL: string) => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');
        const requestParamCollection = database.get<RequestParamMaster>('request_param_master');
        const fileUploadCollection = database.get<FileUploadMaster>('file_upload_master');

        const offlineDataArr = await offlineCollection.query(Q.sortBy('retry_count', Q.asc)).fetch();

        if (offlineDataArr.length === 0) {
            return { msg: 'No Data', status: true };
        }

        for (const offlineData of offlineDataArr) {
            const url = baseURL + offlineData.requestURL;
            const requestType = offlineData.requestType;
            const requestId: string = offlineData.requestId;
            const requestBody = offlineData.requestBody;

            if (requestBody) {
                try {
                    const parsedBody = JSON.parse(requestBody);
                    console.log('requestBody', parsedBody);
                    const response = await postData(url, parsedBody);
                    console.log('requestBodyResponse', response);

                    if (response.status === 1) {
                        throw new Error('API response error');
                    }

                    await database.write(async () => {
                        await offlineCollection.query(Q.where('request_id', requestId)).destroyAllPermanently();
                    });
                } catch (error) {
                    console.error(error);
                    await database.write(async () => {
                        await offlineData.update(o => {
                            o.retryCount = o.retryCount + 1;
                            o.underProcessing = false;
                        });
                    });

                    return { msg: 'Sync Error', status: false };
                }
            } else {
                const [requestParams, fileUploads] = await Promise.all([
                    requestParamCollection.query(Q.where('request_id', requestId)).fetch(),
                    fileUploadCollection.query(Q.where('request_id', requestId)).fetch(),
                ]);

                const formData = new FormData();
                requestParams.forEach(param => {
                    if (param.paramName === 'requestType') {
                    } else formData.append(param.paramName, param.paramValue);
                });

                if (fileUploads.length > 0) {
                    // const stats = await RNBlobUtil.fs.stat(fileUploads[0].filePath);
                    // console.log('File size (bytes):', stats.size);
                    fileUploads.forEach(file => {
                        formData.append(file.fileName, { uri: `file://${file.filePathSecond}`, type: 'image/jpeg', name: `${file.fileName}.jpg` });
                        if (file.filePath) {
                            formData.append('previewImageAvaialable', true);
                            formData.append('previewImage', { uri: `file://${file.filePath}`, type: 'image/jpeg', name: 'previewImage.jpg' });
                        }
                    });
                }

                console.log(url, requestType, formData);

                // Started data posting
                try {
                    await database.write(async () => {
                        await offlineData.update(o => {
                            o.underProcessing = true;
                        });
                    });

                    const response = await postData(url, formData, true);
                    console.log('sync Data response', response);

                    if (response.status === 1) {
                        throw new Error('API response error');
                    }

                    await database.write(async () => {
                        // Delete all the records related to the request id
                        await Promise.all([
                            offlineCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                            requestParamCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                            fileUploadCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                        ]);
                    });
                } catch (error) {
                    console.error(error);
                    await database.write(async () => {
                        await offlineData.update(o => {
                            o.retryCount = o.retryCount + 1;
                            o.underProcessing = false;
                        });
                    });

                    return { msg: 'Sync failed, please try again later', status: false };
                }
            }
        }

        return { msg: 'Sync Success', status: true };
    },
    updateSyncMaster: async () => {
        const syncCollection = database.get<SyncMaster>('sync_master');

        await database.write(async () => {
            const toCreateSyncMaster = syncCollection.prepareCreate((record: SyncMaster) => {
                record.lastSyncDate = new Date().toISOString();
            });

            await database.batch(toCreateSyncMaster);
        });
    },
    clearDatabase: async () => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');
        const requestHeaderCollection = database.get<RequestParamMaster>('request_header_master');
        const requestParamCollection = database.get<RequestParamMaster>('request_param_master');
        const fileUploadCollection = database.get<FileUploadMaster>('file_upload_master');
        const pluckedQuantityCollection = database.get<PluckedQuantityMaster>('plucked_quantity_master');

        try {
            await database.write(async () => {
                const existingOfflineData = await offlineCollection.query().fetch();
                const existingRequestHeaders = await requestHeaderCollection.query().fetch();
                const existingRequestParams = await requestParamCollection.query().fetch();
                const existingFileUploads = await fileUploadCollection.query().fetch();
                const existingPluckedQuantity = await pluckedQuantityCollection.query().fetch();

                if (existingOfflineData.length > 0) {
                    await database.batch([
                        ...existingOfflineData.map(r => r.prepareDestroyPermanently()),
                        ...existingRequestHeaders.map(r => r.prepareDestroyPermanently()),
                        ...existingRequestParams.map(r => r.prepareDestroyPermanently()),
                        ...existingFileUploads.map(r => r.prepareDestroyPermanently()),
                    ]);
                }

                await database.batch([...existingPluckedQuantity.map(r => r.prepareDestroyPermanently())]);
            });

            Toast.show({
                type: 'success',
                text1: 'Offline Data Cleared',
                text2: 'Offline Database cleared successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to clear offline data in the database',
            });
            console.error(error);
        }
    },
    deleteSingleRecord: async (requestId: number | string) => {
        const offlineCollection = database.get<OfflineMaster>('offline_master');
        const requestParamCollection = database.get<RequestParamMaster>('request_param_master');
        const fileUploadCollection = database.get<FileUploadMaster>('file_upload_master');

        try {
            const records = await offlineCollection.query(Q.where('request_id', requestId)).fetch();

            if (records.length > 0 && records[0].retryCount === 0) {
                Toast.show({
                    type: 'error',
                    text1: "This data isn't deletable",
                    text2: 'To delete the data, you have to try to sync all the data at least one time',
                });
                return;
            }

            await database.write(async () => {
                // Delete all the records related to the request id
                await Promise.all([
                    offlineCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                    requestParamCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                    fileUploadCollection.query(Q.where('request_id', requestId)).destroyAllPermanently(),
                ]);
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'DB Error',
                text2: 'Failed to delete the data in the database',
            });
            console.error(error);
        }
    },
};

export default databaseServices;
