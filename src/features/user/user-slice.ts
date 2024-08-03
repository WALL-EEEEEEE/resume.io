import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { Resume } from "../../types/resume";
import { CoverLetter } from "../../types/coverletter";


export interface UserState {
    user: User
}

const initialState: UserState = {
    user: {} as User
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addResume: (state, action: PayloadAction<Resume>) => {
            const resume = action.payload
            state.user.resumes.push(resume.meta.id)
        },
        delResume: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload
            state.user.resumes = state.user.resumes.filter((item ) => { return item !== resume_id })
        },
        addCoverLetter: (state, action: PayloadAction<CoverLetter>) => {
            const coverLetter = action.payload
            state.user.coverLetters.push(coverLetter.meta.id)
        },
        delCoverLetter: (state, action: PayloadAction<string>) => {
            const coverLetterId = action.payload
            state.user.coverLetters = state.user.coverLetters.filter((item ) => { return item !== coverLetterId })
        },
   }

})

export const { } = userSlice.actions
export default userSlice.reducer;