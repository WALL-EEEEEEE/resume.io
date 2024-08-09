import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume } from "../../types/resume"

type ResumeListState = {
    [id: string]: Resume,
}

const initialState: ResumeListState = {};

const resumeListSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        resumeAdded: {
            reducer: (state, action: PayloadAction<Resume>) => {
                const resume = action.payload
                const resume_id: string = resume.meta.id;
                state[resume_id] = { ...action.payload }
            },
            prepare: (resume: Resume, userId: string) => {
                resume.meta.userId = userId
                return {
                    payload: {
                        ...resume
                    }
                }
            }
        },
        resumeDeleted: (state, action: PayloadAction<[string, string]>) => {
            //to plain object
            const [resume_id, userId] = action.payload
            delete state[resume_id]
        },
    }

})

export const { resumeAdded, resumeDeleted } = resumeListSlice.actions

export default resumeListSlice.reducer;