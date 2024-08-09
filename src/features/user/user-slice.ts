import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { Resume as ResumeProps } from "../../types/resume";
import { CoverLetter as CoverLetterProps } from "../../types/coverletter";
import { resumeAdded, resumeDeleted } from "../../features/panel/resume-list-slice"


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
    },
    extraReducers: (builder) => {
    }

})


export const {  } = userSlice.actions
export default userSlice.reducer;