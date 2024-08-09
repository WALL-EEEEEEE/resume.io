import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user"
import { Resume as ResumeProps } from "../../types/resume"
import { CoverLetter as CoverLetterProps } from "../../types/coverletter"
import { v7 as uuidv7 } from "uuid"
import { RootState } from "../../store";
import { resumeAdded, resumeDeleted } from "../panel/resume-list-slice";

type UserListState = {
    [id: string]: User,
}

const initialState: UserListState= {};

const userListSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        userAdded: (state, action: PayloadAction<User>) => {
            const user = action.payload
            let user_id: string = user.id;
            if (user_id === "") {
                user_id = uuidv7()
            }
            if (state[user_id] !== undefined ) {
                return
            }
            state[user_id] = {...user}
        },
        userDeleted: (state, action: PayloadAction<string>) => {
            //to plain object
            const user_id = action.payload
            delete state[user_id] 
        },
   },
   selectors: {
        selectUserById: (state, id: string) => {
            return state[id]
        }
   },
   extraReducers: (builder) => {
     builder
     .addCase(resumeAdded, userResumeAdded)
     .addCase(resumeDeleted, userResumeDeleted)
   }
})

const userResumeAdded = (state: UserListState, action: PayloadAction<ResumeProps>) => {
    const resume = action.payload
    const userId = resume.meta.userId
    const user = selectUserById({users: state}, userId)
    user.resumes.push(resume.meta.id)
};

const userResumeDeleted = (state: UserListState, action: PayloadAction<[string, string]>) => {
    const [resumeId, userId] = action.payload
    const user = selectUserById({users: state}, userId)
    user.resumes = state.user.resumes.filter((item) => { return item !== resumeId })
}

const userCoverLetterAdded = (state: UserListState, action: PayloadAction<CoverLetterProps>) => {
    const {id: coverLetterId, userId} = action.payload.meta
    const user = selectUserById({users: state}, userId)
    user.coverLetters.push(coverLetterId)
}
const userCoverLetterDeleted = (state: UserListState, action: PayloadAction<[string, string]>) => {
    const [coverLetterId, userId] = action.payload
    const user = selectUserById({users: state}, userId)
    user.coverLetters = state.user.coverLetters.filter((item) => { return item !== coverLetterId })
}

export const { userAdded, userDeleted} = userListSlice.actions
export const { selectUserById } = userListSlice.selectors

export default userListSlice.reducer;