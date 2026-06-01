// ── logStore.ts ────────────────────────────────────────────────────────────
import moment from 'moment-timezone';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'ble-logs' });

const LOG_KEY = 'ble_logs';
const MAX_LOGS = 200; // prevent memory bloat

export type LogEntry = {
    id: string;
    timestamp: string;
    raw: string;
    charCodes: string;
    length: number;
    parsedWeight: number | null;
    caseMatched: string;
};

// ── Save a log entry ───────────────────────────────────────────────────────
export const saveLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    try {
        const existing = getLogs();
        const newEntry: LogEntry = {
            ...entry,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };

        const updated = [newEntry, ...existing].slice(0, MAX_LOGS); // newest first, cap at 200
        storage.set(LOG_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save log:', e);
    }
};

// ── Get all logs ───────────────────────────────────────────────────────────
export const getLogs = (): LogEntry[] => {
    try {
        const raw = storage.getString(LOG_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

// ── Clear all logs ─────────────────────────────────────────────────────────
export const clearLogs = () => {
    storage.delete(LOG_KEY);
};

// --- Log in log out logs -------------------->
const logInOutStorage = new MMKV({ id: 'log-in-out-logs' });
const LOG_IN_OUT_KEY = 'log_in_out_logs';
const MAX_LOG_IN_OUT_LOGS = 50; // prevent memory bloat

export type LogInOutEntry = {
    id: string;
    type: 'Log In' | 'Log Out';
    timestamp: string;
};

export const saveLogInOut = (entry: Omit<LogInOutEntry, 'id' | 'timestamp'>) => {
    try {
        const existing = getLogInOuts();
        const newEntry: LogInOutEntry = {
            ...entry,
            id: Date.now().toString(),
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
        };

        const updated = [newEntry, ...existing].slice(0, MAX_LOG_IN_OUT_LOGS); // newest first, cap at 200
        logInOutStorage.set(LOG_IN_OUT_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save log:', e);
    }
};

// ── Get all logs ───────────────────────────────────────────────────────────
export const getLogInOuts = (): LogInOutEntry[] => {
    try {
        const raw = logInOutStorage.getString(LOG_IN_OUT_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};
