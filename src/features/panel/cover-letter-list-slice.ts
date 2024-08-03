import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoverLetterState } from "../cover-letter/cover-letter-slice"

type CoverListState = {
    [id: string]: CoverLetterState ,
}

const initialState: CoverListState = {};

const coverLetterListSlice = createSlice({
    name: "coverLetter",
    initialState,
    reducers: {
        addCoverLetter: (state, action: PayloadAction<CoverLetterState>) => {
            const coverLetter = action.payload
            if (coverLetter.coverLetter == undefined) {
                return
            }
            const letter_id: string = coverLetter.coverLetter.meta.id;
            state[letter_id] = {...coverLetter}
        },
        delCoverLetter: (state, action: PayloadAction<string>) => {
            //to plain object
            const resume_id: string = action.payload
            delete state[resume_id]
        },
   }

})

export const { addCoverLetter, delCoverLetter} = coverLetterListSlice.actions

export default coverLetterListSlice.reducer;