import { createSlice } from '@reduxjs/toolkit';

interface FormState {
    formData: any;
}

export const initialState: FormState = {
    formData: null,
};

const formSlice = createSlice({
    name: 'formData',
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
    },
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer;
