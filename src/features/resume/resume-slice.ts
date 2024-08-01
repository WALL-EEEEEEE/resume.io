import { asyncThunkCreator, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume, About, Project, Work, Skill, Education, Contact } from "../../types/resume";

interface ResumeState extends Resume {}

const initialState: ResumeState = {
    ...(new Resume())
};

const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload)
        },
        delProject: (state, action: PayloadAction<number>) => {
            state.projects = state.projects.filter((project, index) => index !== action.payload )
        },
        editProject: (state, action: PayloadAction<[Project, number]>) => {
            state.projects[action.payload[1]]= action.payload[0]
        },
        addWork: (state, action: PayloadAction<Work>) => {
            state.works.push(action.payload)
        },
        delWork: (state, action: PayloadAction<number>) => {
            state.works = state.works.filter((work, index) => index !== action.payload )
        },
        editWork: (state, action: PayloadAction<[Work, number]>) => {
            state.works[action.payload[1]]= action.payload[0]
        },
        addSkill: (state, action: PayloadAction<Skill>) => {
            state.skills.push(action.payload)
        },
        delSkill: (state, action: PayloadAction<number>) => {
            state.skills = state.skills.filter((skill, index) => index !== action.payload )
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            state.educations.push(action.payload)
        },
        delEducation: (state, action: PayloadAction<number>) => {
            state.educations= state.educations.filter((education, index) => index !== action.payload )
        },
        editEducation: (state, action: PayloadAction<[Education, number]>) => {
            state.educations[action.payload[1]]= action.payload[0]
        },
        addContact: (state, action: PayloadAction<Contact>) => {
            state.contacts.push(action.payload)
        },
        delContact: (state, action: PayloadAction<number>) => {
            state.contacts = state.contacts.filter((contact, index) => index !== action.payload )
        },
        editContact: (state, action: PayloadAction<[Contact, number]>) => {
            state.contacts[action.payload[1]]= action.payload[0]
        },
        editAbout: (state, action: PayloadAction<About>) => {
            state.summary = action.payload
        }
    }

})

export const { addProject, delProject, editProject, addWork, delWork, editWork, addEducation, delEducation, editEducation, delSkill, addSkill, addContact, delContact, editContact,  editAbout} = resumeSlice.actions

export default resumeSlice.reducer;