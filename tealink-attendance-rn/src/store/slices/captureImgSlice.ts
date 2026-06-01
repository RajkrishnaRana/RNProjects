import { createSlice } from '@reduxjs/toolkit';

type Image = { base64: string; photoPath: string } | null;

interface CaptureImgState {
    firstImg: Image;
    image: Image;
    firstNonPluckingImg: Image;
    nonPluckingImg: Image;
    firstPluckingImg: Image;
    pluckingImg: Image;
}

const initialState: CaptureImgState = {
    firstImg: null,
    image: null,
    firstNonPluckingImg: null,
    nonPluckingImg: null,
    firstPluckingImg: null,
    pluckingImg: null,
};

const captureImgSlice = createSlice({
    name: 'captureImg',
    initialState,
    reducers: {
        setFirstImg: (state, action) => {
            state.firstImg = action.payload;
        },
        setImage: (state, action) => {
            state.image = action.payload;
        },
        setNonPluckingImg: (state, action) => {
            const { firstImg, image } = action.payload;

            if (firstImg === null && image === null) {
                state.firstNonPluckingImg = null;
                state.nonPluckingImg = null;
            } else {
                if (firstImg !== undefined) state.firstNonPluckingImg = firstImg;
                if (image !== undefined) state.nonPluckingImg = image;
            }
        },
        setPluckingImg: (state, action) => {
            const { firstImg, image } = action.payload;

            if (firstImg === null && image === null) {
                state.firstPluckingImg = null;
                state.pluckingImg = null;
            } else {
                if (firstImg !== undefined) state.firstPluckingImg = firstImg;
                if (image !== undefined) state.pluckingImg = image;
            }
        },
    },
});

export const { setFirstImg, setImage, setNonPluckingImg, setPluckingImg } = captureImgSlice.actions;
export default captureImgSlice.reducer;
