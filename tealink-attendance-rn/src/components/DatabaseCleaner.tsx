import { MMKV } from 'react-native-mmkv';
import { database } from '../..';
import { Q } from '@nozbe/watermelondb';
import AttendanceMaster from '../model/attendanceMaster';
import { useCallback, useEffect } from 'react';
import { useAppSelector } from '../hooks/typedReduxHooks';

const storage = new MMKV({ id: 'database-cleaner' });

const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
const CLEANER_KEY = 'last_attendance_clean';
const ONE_HOUR_MS = 60 * 60 * 1000;

export const DatabaseCleaner = () => {
    const { authenticationTime } = useAppSelector(state => state.auth);

    const runAttendanceCleaner = useCallback(async () => {
        try {
            // ✅ authenticationTime is from your server, persisted in Redux
            if (!authenticationTime) {
                console.warn('Cleaner: skipped, no authentication time available');
                return;
            }

            const deviceNow = Date.now();
            const timeDrift = Math.abs(authenticationTime - deviceNow);

            // ✅ If device clock is more than 1 hour off from server auth time, skip
            if (timeDrift > ONE_HOUR_MS) {
                console.warn(`Cleaner: skipped, clock drift detected (${Math.round(timeDrift / 3600000)}h off)`);
                return;
            }

            // ✅ Only run once per day
            const lastRun = storage.getString(CLEANER_KEY);
            if (lastRun && authenticationTime - Number(lastRun) < 24 * 60 * 60 * 1000) {
                console.log('Cleaner: skipped, already ran today');
                return;
            }

            const collection = database.get<AttendanceMaster>('attendance_master');
            const twoMonthsAgo = String(authenticationTime - SIX_MONTHS_MS);

            const toDelete = await collection.query(Q.where('attendance_date', Q.lt(twoMonthsAgo))).fetch();

            if (toDelete.length === 0) {
                storage.set(CLEANER_KEY, String(authenticationTime));
                console.log('Cleaner: nothing to delete');
                return;
            }

            await database.write(async () => {
                const deleteBatch = toDelete.map(r => r.prepareDestroyPermanently());
                await database.batch(...deleteBatch);
            });

            storage.set(CLEANER_KEY, String(authenticationTime));
            console.log(`Cleaner: deleted ${toDelete.length} old records`);
        } catch (error) {
            console.error('Attendance cleaner failed:', error);
        }
    }, [authenticationTime]);

    useEffect(() => {
        runAttendanceCleaner();
    }, [runAttendanceCleaner]);

    return null;
};
