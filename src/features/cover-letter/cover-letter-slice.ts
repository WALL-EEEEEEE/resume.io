import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoverLetter } from "../../types/coverletter";

type CoverLetterState = {
    coverLetter?: CoverLetter 
}


const initialState: CoverLetterState= {
};

const coverLetterSlice = createSlice({
    name: "cover-letter",
    initialState,
    reducers: {
        editCoverLetter: (state, action: PayloadAction<[CoverLetter, number]>) => {
            state.coverLetter = action.payload[0]
        },
   }

})

export const { editCoverLetter } = coverLetterSlice.actions

export default coverLetterSlice.reducer;