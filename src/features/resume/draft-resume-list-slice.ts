import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume, About, Project, Work, Skill, Education, Contact } from "../../types/resume";
import { RootState } from "../../store";

type DraftResumeList = { [id: string]: Resume }

export const selectDraftByID = (state: RootState, id: string, default_draft?: Resume) => {
    const draft = state["draft-resume-list"].drafts[id]
    console.log("selectDraftByID", draft)
    if (!!!draft) {
        console.log("selectDraftByID -> default", draft)
        return default_draft
    }
    return draft
}

export interface DraftResumeListState {
    drafts: DraftResumeList
}

const initialState: DraftResumeListState = {
    drafts: {} as DraftResumeList
};

const draftResumeListSlice = createSlice({
    name: "draft-resume-list",
    initialState,
    reducers: {
        newResume: (state, action: PayloadAction<Resume>) => {
            const resume = action.payload
            const resume_id = resume.meta.id
            if (resume_id === null || resume_id === undefined) {
                return
            }
            state.drafts[resume_id] = resume
        },
        setResumeName: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            const name = action.payload[1]
            state.drafts[resume_id].meta.name = name
        },
        setResumeStatus: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            const status = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].meta.status = status
        },
        initProfilePicture: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload
            console.log(resume_id)
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].profileImage = "empty"
            console.log(state.drafts[resume_id])
        },
        initProject: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].projects = {}
        },
        initWork: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].works = {}
        },
        initEducation: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].educations = {}
        },
        initAbout: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].about = new About()
        },
        initSkill: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].skills = {}
        },
        initContact: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].contacts = {}
        },
        addProject: (state, action: PayloadAction<[string, Project]>) => {
            const resume_id = action.payload[0]
            const project = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].projects == undefined || state.drafts[resume_id].projects == null) {
                state.drafts[resume_id].projects = {}
            }
            state.drafts[resume_id].projects[project.id] = project
        },
        delProject: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            const project_id = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].projects == undefined || state.drafts[resume_id].projects == null) {
                return
            }
            if (!(project_id in state.drafts[resume_id].projects)) {
                return
            }
            delete state.drafts[resume_id].projects[project_id]
        },
        editProject: (state, action: PayloadAction<[string, string, Project]>) => {
            const resume_id = action.payload[0]
            const project_id = action.payload[1]
            const project = action.payload[2]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].projects == undefined || state.drafts[resume_id].projects == null) {
                return
            }
            if (!(project_id in state.drafts[resume_id].projects)) {
                return
            }
            state.drafts[resume_id].projects[project_id] = project
        },
        addWork: (state, action: PayloadAction<[string, Work]>) => {
            const resume_id = action.payload[0]
            const work = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].works == undefined || state.drafts[resume_id].works == null) {
                state.drafts[resume_id].works = {}
            }
            state.drafts[resume_id].works[work.id] = work
        },
        delWork: (state, action: PayloadAction<string, string>) => {
            const resume_id = action.payload[0]
            const work_id = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].works == undefined || state.drafts[resume_id].works == null) {
                return
            }
            if (!(work_id in state.drafts[resume_id].works)) {
                return
            }
            delete state.drafts[resume_id].works[work_id]
        },
        editWork: (state, action: PayloadAction<[string, string, Work]>) => {
            const resume_id = action.payload[0]
            const work_id = action.payload[1]
            const work = action.payload[2]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].works == undefined || state.drafts[resume_id].works == null) {
                return
            }
            if (!(work_id in state.drafts[resume_id].works)) {
                return
            }
            state.drafts[resume_id].works[work_id] = work
        },
        addSkill: (state, action: PayloadAction<[string, Skill]>) => {
            const resume_id = action.payload[0]
            const skill = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].skills == undefined || state.drafts[resume_id].skills == null) {
                state.drafts[resume_id].skills = {}
            }
            state.drafts[resume_id].skills[skill.name] = skill
        },
        delSkill: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            const skill_id = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].skills == undefined || state.drafts[resume_id].skills == null) {
                return
            }
            if (!(skill_id in state.drafts[resume_id].skills)) {
                return
            }
            delete state.drafts[resume_id].skills[skill_id]
        },
        addEducation: (state, action: PayloadAction<[string, Education]>) => {
            const resume_id = action.payload[0]
            const education = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].educations == undefined || state.drafts[resume_id].educations == null) {
                state.drafts[resume_id].educations = {}
            }
            state.drafts[resume_id].educations[education.id] = education
        },
        delEducation: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            const education_id = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].educations == undefined || state.drafts[resume_id].educations == null) {
                return
            }
            if (!(education_id in state.drafts[resume_id].educations)) {
                return
            }
            delete state.drafts[resume_id].educations[education_id]
        },
        editEducation: (state, action: PayloadAction<[string, string, Education]>) => {
            const resume_id = action.payload[0]
            const education_id = action.payload[1]
            const education = action.payload[2]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].educations == undefined || state.drafts[resume_id].educations == null) {
                return
            }
            if (!(education_id in state.drafts[resume_id].educations)) {
                return
            }
            state.drafts[resume_id].educations[education_id] = education

        },
        addContact: (state, action: PayloadAction<[string, Contact]>) => {
            const resume_id = action.payload[0]
            const contact = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].contacts == undefined || state.drafts[resume_id].contacts == null) {
                state.drafts[resume_id].contacts = {}
            }
            state.drafts[resume_id].contacts[contact.kind] = contact

        },
        delContact: (state, action: PayloadAction<[string, string]>) => {
            const resume_id = action.payload[0]
            const contact_id = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].contacts == undefined || state.drafts[resume_id].contacts == null) {
                return
            }
            if (!(contact_id in state.drafts[resume_id].contacts)) {
                return
            }
            delete state.drafts[resume_id].contacts[contact_id]
        },
        editContact: (state, action: PayloadAction<[string, string, Contact]>) => {
            const resume_id = action.payload[0]
            const contact_id = action.payload[1]
            const contact = action.payload[2]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            if (state.drafts[resume_id].contacts == undefined || state.drafts[resume_id].contacts == null) {
                return
            }
            if (!(contact_id in state.drafts[resume_id].contacts)) {
                return
            }
            state.drafts[resume_id].contacts[contact_id] = contact
        },
        editAbout: (state, action: PayloadAction<[string, About]>) => {
            const resume_id = action.payload[0]
            const about = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].about = about
        },
        addProfilePicture: (state, action: PayloadAction<string, string>) => {
            const resume_id = action.payload[0]
            const profile_image = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].profileImage = profile_image
        },
        editProfilePicture: (state, action: PayloadAction<string, string>) => {
            const resume_id = action.payload[0]
            const profile_image = action.payload[1]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].profileImage = profile_image
        },
        delProfilePicture: (state, action: PayloadAction<string>) => {
            const resume_id = action.payload[0]
            if ((resume_id === null || resume_id === undefined) && !(resume_id in state.drafts)) {
                return
            }
            state.drafts[resume_id].profileImage = ""
        },
    }

})

export const { newResume, setResumeName, setResumeStatus, initProfilePicture, initProject, initWork, initEducation, initContact, initAbout, initSkill, addProject, delProject, editProject, addWork, delWork, editWork, addEducation, delEducation, editEducation, delSkill, addSkill, addContact, delContact, editContact, editAbout, addProfilePicture, editProfilePicture, delProfilePicture } = draftResumeListSlice.actions
export default draftResumeListSlice.reducer;