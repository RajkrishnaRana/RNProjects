import { createSlice } from '@reduxjs/toolkit';

interface WorkerState {
    totalWorkerAttendance: number;
    attendanceRate: number;
    totalLeafPluckedToday: number;
    batchSameAsDeviceId: string;
}

const initialState: WorkerState = {
    totalWorkerAttendance: 0,
    attendanceRate: 0,
    totalLeafPluckedToday: 0,
    batchSameAsDeviceId: "",
};

const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        setTotalWorkerAttendance: (state, action) => {
            state.totalWorkerAttendance = action.payload;
        },
        setAttandanceRate: (state, action) => {
            state.attendanceRate = action.payload;
        },
        setTotalLeafPluckedToday: (state, action) => {
            state.totalLeafPluckedToday = action.payload;
        },
        setBatchSameAsDeviceId: (state, action) => {
            state.batchSameAsDeviceId = action.payload;
        },
    },
});

export const { setTotalWorkerAttendance, setTotalLeafPluckedToday, setAttandanceRate, setBatchSameAsDeviceId } = workerSlice.actions;
export default workerSlice.reducer;
