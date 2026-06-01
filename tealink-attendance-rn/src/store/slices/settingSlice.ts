import { createSlice } from '@reduxjs/toolkit';

interface SettingState {
    printTimeWise: boolean;
    flashEnabled: boolean;
    flashDuration: number;
    pluckingOneShot: boolean;
    moistureDeduction: string;
    standardDeduction: string;
    tareWeight: string;
}

const initialState: SettingState = {
    printTimeWise: false,
    flashEnabled: false,
    flashDuration: 3,
    pluckingOneShot: false,
    moistureDeduction: '0.0',
    standardDeduction: '0.0',
    tareWeight: '0.0',
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setFlashEnabled: (state, action) => {
            state.flashEnabled = action.payload;
        },
        setFlashDuration: (state, action) => {
            state.flashDuration = action.payload;
        },
        setPluckingOneShot: (state, action) => {
            state.pluckingOneShot = action.payload;
        },
        setPrintTimeWise: (state, action) => {
            state.printTimeWise = action.payload;
        },
        setWeighingParamentes: (state, action) => {
            if (action.payload.moistureDeduction !== undefined) {
                state.moistureDeduction = action.payload.moistureDeduction;
            }
            if (action.payload.standardDeduction !== undefined) {
                state.standardDeduction = action.payload.standardDeduction;
            }
            if (action.payload.tareWeight !== undefined) {
                state.tareWeight = action.payload.tareWeight;
            }
        },
    },
});

export const { setFlashEnabled, setFlashDuration, setPluckingOneShot, setPrintTimeWise, setWeighingParamentes } = settingSlice.actions;
export default settingSlice.reducer;
