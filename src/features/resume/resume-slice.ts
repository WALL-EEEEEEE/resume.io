import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume, About, Project, Work, Skill, Education, Contact } from "../../types/resume";

interface ResumeState {
    resume:Resume 
}

const initialState: ResumeState = {
    resume: new Resume()
};

const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        initProject: (state) => {
            if (state.resume.projects == undefined || state.resume.projects == null) {
                state.resume.projects = []
            }
        },
        initWork: (state) => {
            if (state.resume.works == undefined || state.resume.works == null) {
                state.resume.works = []
            }
        },
        initEducation: (state) => {
            if (state.resume.educations == undefined || state.resume.educations == null) {
                state.resume.educations = []
            }
        },
        initAbout: (state) => {
            if (state.resume.about == undefined || state.resume.about == null) {
                state.resume.about = {...new About()}
            }
        },
        initSkill: (state) => {
            if (state.resume.skills == undefined || state.resume.skills == null) {
                state.resume.skills = []
            }
        },
        initContact: (state) => {
            if (state.resume.contacts == undefined || state.resume.contacts == null) {
                state.resume.contacts = []
            }
        },
        addProject: (state, action: PayloadAction<Project>) => {
            if (state.resume.projects == undefined || state.resume.projects == null) {
                state.resume.projects = []
            }
            state.resume.projects.push({...action.payload})
        },
        delProject: (state, action: PayloadAction<number>) => {
            if (state.resume.projects == undefined || state.resume.projects == null) {
                state.resume.projects = []
            }
            state.resume.projects = state.resume.projects.filter((project, index) => index !== action.payload )
        },
        editProject: (state, action: PayloadAction<[Project, number]>) => {
            if (state.resume.projects == undefined || state.resume.projects == null) {
                state.resume.projects = []
            }
            state.resume.projects[action.payload[1]]= {...action.payload[0]}
        },
        addWork: (state, action: PayloadAction<Work>) => {
            if (state.resume.works == undefined || state.resume.works == null) {
                state.resume.works = []
            }
            state.resume.works.push({...action.payload})
        },
        delWork: (state, action: PayloadAction<number>) => {
            if (state.resume.works == undefined || state.resume.works == null) {
                state.resume.works = []
            }
            state.resume.works = state.resume.works.filter((work, index) => index !== action.payload )
        },
        editWork: (state, action: PayloadAction<[Work, number]>) => {
            if (state.resume.works == undefined || state.resume.works == null) {
                state.resume.works = []
            }
            state.resume.works[action.payload[1]]= {...action.payload[0]}
        },
        addSkill: (state, action: PayloadAction<Skill>) => {
            if (state.resume.skills == undefined || state.resume.skills == null) {
                state.resume.skills = []
            }
            state.resume.skills.push({...action.payload})
        },
        delSkill: (state, action: PayloadAction<number>) => {
            if (state.resume.skills == undefined || state.resume.skills == null) {
                state.resume.skills = []
            }
            state.resume.skills = state.resume.skills.filter((skill, index) => index !== action.payload )
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            if (state.resume.educations == undefined || state.resume.educations == null) {
                state.resume.educations = []
            }
            state.resume.educations.push({...action.payload})
        },
        delEducation: (state, action: PayloadAction<number>) => {
            if (state.resume.educations == undefined || state.resume.educations == null) {
                state.resume.educations = []
            }
            state.resume.educations= state.resume.educations.filter((education, index) => index !== action.payload )
        },
        editEducation: (state, action: PayloadAction<[Education, number]>) => {
            if (state.resume.educations == undefined || state.resume.educations == null) {
                state.resume.educations = []
            }
            state.resume.educations[action.payload[1]]= {...action.payload[0]}
        },
        addContact: (state, action: PayloadAction<Contact>) => {
            if (state.resume.contacts == undefined || state.resume.contacts == null) {
                state.resume.contacts = []
            }
            state.resume.contacts.push({...action.payload})
        },
        delContact: (state, action: PayloadAction<number>) => {
            if (state.resume.contacts == undefined || state.resume.contacts == null) {
                state.resume.contacts = []
            }
            state.resume.contacts = state.resume.contacts.filter((contact, index) => index !== action.payload )
        },
        editContact: (state, action: PayloadAction<[Contact, number]>) => {
            if (state.resume.contacts == undefined || state.resume.contacts == null) {
                state.resume.contacts = []
            }
            state.resume.contacts[action.payload[1]]= {...action.payload[0]}
        },
        editAbout: (state, action: PayloadAction<About>) => {
           state.resume.about = {...action.payload}
        },
        addProfileImage: (state, action: PayloadAction<string>) => {
        //    state.resume.profileImage = action.payload
           return {...state, resume: {...state.resume, profileImage: action.payload}}
        },
        editProfileImage: (state, action: PayloadAction<string>) => {
           state.resume.profileImage = action.payload
        },
        delProfileImage: (state, action: PayloadAction<string>) => {
           state.resume.profileImage = undefined
        },
    }

})

export const { initProject, initWork, initEducation, initContact, initAbout, initSkill, addProject, delProject, editProject, addWork, delWork, editWork, addEducation, delEducation, editEducation, delSkill, addSkill, addContact, delContact, editContact,  editAbout, addProfileImage, editProfileImage, delProfileImage} = resumeSlice.actions

export default resumeSlice.reducer;