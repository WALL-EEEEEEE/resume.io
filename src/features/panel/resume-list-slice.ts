import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume } from "../../types/resume"

type ResumeListState = {
    [id: string]: Resume,
}

const initialState: ResumeListState = {};

const resumeListSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        addResume: (state, action: PayloadAction<Resume>) => {
            const resume = action.payload
            const resume_id: string = resume.meta.id;
            state[resume_id] = {...action.payload}
        },
        delResume: (state, action: PayloadAction<string>) => {
            //to plain object
            const resume_id: string = action.payload
            delete state[resume_id]
        },
   }

})

export const { addResume, delResume} = resumeListSlice.actions

export default resumeListSlice.reducer;