import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import StackHeader from '../components/Headers/StackHeader';
import { database } from '../..';
import { generateHTML } from '../utils/htmlGenerator';
import RNPrint from 'react-native-print';
import { useState } from 'react';
import AttendanceMaster from '../model/attendanceMaster';
import WorkerMaster from '../model/workerMaster';
import { colors } from '../common/colors';
import Toast from 'react-native-toast-message';
import { useNavigation } from '../hooks/useNavigation';
import { Q } from '@nozbe/watermelondb';
import SectionMaster from '../model/sectionMaster';
import KamjariMaster from '../model/kamjariMaster';
import BatchMaster from '../model/batchMaster';
import PluckedQuantityMaster from '../model/pluckedQuantityMaster';
import { useAppSelector } from '../hooks/typedReduxHooks';
import DeviceInfo from 'react-native-device-info';

type ModifiedWorkerMasterData = Record<string, WorkerMaster | undefined>;
export type PluckedQuantityObj = Record<string, Record<string, { qty: string; time: string }>>;
export interface WorkerObj {
    plucking_key: string;
    worker_id: string;
    worker_name: string;
    worker_code: string;
    worker_book_name: string;
    worker_emp_no: string;
    worker_div_emp_no: string;
    kamjari_id: string;
    kamjari_name: string;
    IN_TIME: string;
    OUT_TIME: string;
}

export default function PrintRecordsScreen() {
    const navigation = useNavigation();
    const { deviceName, lastSyncTime } = useAppSelector(state => state.auth);
    const [loading, setLoading] = useState(false);

    const formatRecordingStat = (durationMs: number, count: number) => {
        if (!Number.isFinite(durationMs) || !Number.isFinite(count) || durationMs <= 0 || count <= 0) {
            return 'n/a';
        }

        const durationInSeconds = Math.floor(durationMs / 1000);
        if (!Number.isFinite(durationInSeconds) || durationInSeconds <= 0) {
            return 'n/a';
        }

        const secondsPerPlucker = durationInSeconds / count;
        if (!Number.isFinite(secondsPerPlucker) || secondsPerPlucker <= 0) {
            return 'n/a';
        }

        const minutesPerPlucker = secondsPerPlucker / 60;
        return `${minutesPerPlucker.toFixed(1)} min/plucker`;
    };

    const groupAttendanceData = useCallback(
        (workers: WorkerMaster[], attendanceData: AttendanceMaster[], pluckedQuantityData: PluckedQuantityMaster[]) => {
            const workerGroups: ModifiedWorkerMasterData = {};

            // 1. Build an O(1) hash map of workers for instant lookups
            const workerMap = new Map<string, WorkerMaster>();
            workers.forEach(worker => {
                if (worker.workerId) {
                    workerMap.set(String(worker.workerId).toLowerCase(), worker);
                }
            });

            // 2. Match based on lowercase to handle casing mismatches securely in 1ms instead of 10s
            attendanceData.forEach(record => {
                const workerId = record.workerId;
                if (!workerGroups[workerId]) {
                    workerGroups[workerId] = workerMap.get(String(workerId).toLowerCase());
                }
            });

            pluckedQuantityData.forEach(record => {
                const workerId = record.workerId;
                if (!workerGroups[workerId]) {
                    workerGroups[workerId] = workerMap.get(String(workerId).toLowerCase());
                }
            });

            return workerGroups;
        },
        [],
    );

    const startPrinting = useCallback(async () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

        try {
            setLoading(true);
            const [attendanceData, pluckedQuantityData, workerRecords, sections, kamjaris, batches] = await Promise.all([
                database.collections
                    .get<AttendanceMaster>('attendance_master')
                    .query(
                        Q.where('attendance_date', Q.gte(String(startOfToday))),
                        Q.where('attendance_date', Q.lt(String(endOfToday))),
                        Q.sortBy('attendance_time', Q.asc),
                    )
                    .fetch(),
                database.collections
                    .get<PluckedQuantityMaster>('plucked_quantity_master')
                    .query(
                        Q.where('record_date', Q.gte(String(startOfToday))),
                        Q.where('record_date', Q.lt(String(endOfToday))),
                        Q.sortBy('record_time', Q.desc),
                    )
                    .fetch(),
                database.collections.get<WorkerMaster>('worker_master').query().fetch(),
                database.collections.get<SectionMaster>('section_master').query().fetch(),
                database.collections.get<KamjariMaster>('kamjari_master').query().fetch(),
                database.collections.get<BatchMaster>('batch_master').query().fetch(),
            ]);

            if (attendanceData?.length === 0 && pluckedQuantityData?.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'No Data for Print',
                    text2: 'No attendance data available to print.',
                });
                navigation.goBack();
                return;
            }

            const workerGroups = groupAttendanceData(workerRecords, attendanceData, pluckedQuantityData);
            const kamjariObj: Record<string, KamjariMaster> = {};
            kamjaris.forEach(kamjari => {
                kamjariObj[kamjari.kamjariId] = kamjari;
            });

            const workerArr: WorkerObj[] = [];
            const workerVisited = new Set<string>(); // So same worker-kamjari row does not appear multiple times
            const attendanceTimeByWorker: Record<string, string> = {};
            attendanceData.forEach(record => {
                if (!attendanceTimeByWorker[record.workerId]) {
                    attendanceTimeByWorker[record.workerId] = record.attendanceTime;
                }
            });

            const pluckingStatsByKey: Record<string, { minTime: number; maxTime: number; count: number }> = {};
            let globalMinPluckingTime = Number.POSITIVE_INFINITY;
            let globalMaxPluckingTime = Number.NEGATIVE_INFINITY;
            let totalPluckingEntries = 0;
            pluckedQuantityData.forEach(record => {
                const workerId = record.workerId;
                const workerKamjariId = record.kamjariId || '';
                const pluckingKey = `${workerId}__${workerKamjariId}`;

                const time = Number(record.recordTime);
                if (!Number.isFinite(time)) {
                    return;
                }
                totalPluckingEntries += 1;
                if (time < globalMinPluckingTime) globalMinPluckingTime = time;
                if (time > globalMaxPluckingTime) globalMaxPluckingTime = time;

                const stats = pluckingStatsByKey[pluckingKey];
                if (!stats) {
                    pluckingStatsByKey[pluckingKey] = { minTime: time, maxTime: time, count: 1 };
                    return;
                }

                if (time < stats.minTime) stats.minTime = time;
                if (time > stats.maxTime) stats.maxTime = time;
                stats.count += 1;
            });

            const hasPluckingWindow = Number.isFinite(globalMinPluckingTime) && Number.isFinite(globalMaxPluckingTime);
            const totalDurationMs = hasPluckingWindow ? Math.max(0, globalMaxPluckingTime - globalMinPluckingTime) : 0;
            const totalWeighmentsRecorded = totalPluckingEntries;
            const recordindStatVal = formatRecordingStat(totalDurationMs, totalWeighmentsRecorded);
            console.log('[PrintRecords] recordingStat', {
                totalDurationMs,
                totalDurationSec: Math.floor(totalDurationMs / 1000),
                globalMinPluckingTime: hasPluckingWindow ? globalMinPluckingTime : null,
                globalMaxPluckingTime: hasPluckingWindow ? globalMaxPluckingTime : null,
                totalWeighmentsRecorded,
                recordindStatVal,
            });

            pluckedQuantityData.forEach(worker => {
                const workerId = worker.workerId;
                const workerKamjariId = worker.kamjariId || '';
                const pluckingKey = `${workerId}__${workerKamjariId}`;
                const time = attendanceTimeByWorker[workerId];
                const keyStats = pluckingStatsByKey[pluckingKey];
                const inTime = time || (keyStats ? String(keyStats.minTime) : worker.recordTime);
                const outTime = keyStats ? String(keyStats.maxTime) : worker.recordTime;
                if (workerVisited.has(pluckingKey)) {
                    return;
                }

                workerVisited.add(pluckingKey);
                workerArr.push({
                    plucking_key: pluckingKey,
                    worker_id: workerId,
                    worker_name: workerGroups[workerId]?.workerName,
                    worker_code: workerGroups[workerId]?.workerCode,
                    worker_book_name: workerGroups[workerId]?.workerBookName,
                    worker_emp_no: workerGroups[workerId]?.workerEmpNo,
                    worker_div_emp_no: workerGroups[workerId]?.workerEmpNo,
                    kamjari_id: workerKamjariId,
                    kamjari_name: kamjariObj[workerKamjariId]?.kamjariName || 'N/A',
                    IN_TIME: inTime,
                    OUT_TIME: outTime,
                });
            });
            // console.log('workerArr', workerArr);

            workerVisited.clear(); // CLEAR THE SET FOR NEXT USE CASE
            const pluckingObj: PluckedQuantityObj = {};
            // console.log('pluckedQuantityData', pluckedQuantityData)
            pluckedQuantityData.forEach(pluckedQuantity => {
                const workerId = pluckedQuantity.workerId;
                const workerKamjariId = pluckedQuantity.kamjariId || '';
                const pluckingKey = `${workerId}__${workerKamjariId}`;
                const weighmentKey = `${pluckingKey}__${pluckedQuantity.weighmentNumber}`;

                if (workerVisited.has(weighmentKey)) {
                    return;
                }

                workerVisited.add(weighmentKey);
                pluckingObj[pluckingKey] = {
                    ...pluckingObj[pluckingKey],
                    [pluckedQuantity.weighmentNumber]: {
                        qty: pluckedQuantity.recordQuantity,
                        time: pluckedQuantity.recordTime,
                    },
                };
            });

            const sectionObj: Record<string, SectionMaster> = {};
            sections.forEach(section => {
                sectionObj[section.sectionId] = section;
            });

            const batchObj: Record<string, BatchMaster> = {};
            batches.forEach(batch => {
                batchObj[batch.batchId] = batch;
            });

            // Create display objects
            const nonPluckingWorkersData: Record<string, PrintNonPluckingWorkers> = {};
            const attendanceLogs: Record<string, string[]> = {};
            const firstTime: Record<string, string> = {};
            const batchId: Record<string, string> = {};
            const sectionId: Record<string, string> = {};
            const kamjariId: Record<string, string> = {};

            attendanceData.forEach(record => {
                const workerData = workerGroups[record.workerId];
                const recordKamjari = record.kamjariId ? kamjariObj[record.kamjariId] : undefined;
                const isPluckingKamjari = recordKamjari?.kamjariType === 'PLUCKING';

                // Exclude PLUCKING kamjari entries from non-plucking print data
                if (isPluckingKamjari) {
                    return;
                }

                if (attendanceLogs[record.workerId]) {
                    attendanceLogs[record.workerId].push(record.attendanceTime);
                } else {
                    attendanceLogs[record.workerId] = [record.attendanceTime];
                    firstTime[record.workerId] = record.attendanceTime;
                }

                if (record.batchId !== '') {
                    batchId[record.workerId] = batchObj[record.batchId]?.batchName;
                }
                if (record.sectionId !== '') {
                    sectionId[record.workerId] = sectionObj[record.sectionId]?.sectionName;
                }
                if (record.kamjariId !== '') {
                    kamjariId[record.workerId] = kamjariObj[record.kamjariId]?.kamjariName;
                }

                if (workerData) {
                    const temp: PrintNonPluckingWorkers = {
                        batch_id: batchId[record.workerId],
                        section_id: sectionId[record.workerId],
                        kamjari_id: kamjariId[record.workerId],
                        auth_logs: attendanceLogs[record.workerId],
                        firstTime: firstTime[record.workerId],
                        worker_id: record.workerId,
                        worker_name: workerData.workerName,
                        worker_code: workerData.workerCode,
                        worker_book_name: workerData.workerBookName,
                        worker_emp_no: workerData.workerEmpNo,
                        worker_div_emp_no: workerData.workerEmpNo,
                    };
                    nonPluckingWorkersData[record.workerId] = temp;
                    // console.log('temp for non plucking incoming data', temp);
                }
            });

            const htmlContent = generateHTML({
                workers: workerArr,
                pluckingData: pluckingObj,
                nonPluckingWorkers: Object.values(nonPluckingWorkersData).map(item => item),
                syncTime: lastSyncTime,
                currentVersion: DeviceInfo.getVersion(),
                operator: 'Operator',
                deviceName: deviceName || 'Unknown Device',
                recordindStatVal: recordindStatVal,
            });

            await RNPrint.print({
                jobName: 'TEAlink_report_' + new Date().toLocaleString(),
                html: htmlContent,
            });

            console.log('nonPluckingWorkersData', nonPluckingWorkersData);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error while processing data',
            });
            return;
        } finally {
            setLoading(false);
        }
    }, [groupAttendanceData, navigation, lastSyncTime, deviceName]);

    useEffect(() => {
        startPrinting();
    }, [startPrinting]);

    return (
        <>
            <StackHeader title="Print Records" description="Print your records" />
            <View style={styles.container}>
                <Text style={styles.loadingText}>{loading ? 'Loading...' : 'Press Back Button or Hit the Left Arrow Button to go back'}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.grey,
        marginHorizontal: 10,
    },
});
