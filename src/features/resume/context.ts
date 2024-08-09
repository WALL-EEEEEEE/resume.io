import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { Resume as ResumeProps, About as AboutProps, Work as WorkProps, Project as ProjectProps, Education as EducationProps, Skill as SkillProps, Contact as ContactProps, Set } from "../../types/resume";

type ResumeEditor = {
  draft: ResumeProps,
  setName: (name: string) => void
  setImage: (image: string) => void
  setAbout: (about: AboutProps) => void
  setWorkList: (works: Set<WorkProps>) => void
  addWork: (work: WorkProps) => void
  editWork: (id: string, work: WorkProps) => void
  delWork: (id: string) => void
  setProjectList: (projects: Set<ProjectProps>) => void
  addProject: (project: ProjectProps) => void
  editProject: (id: string, project: ProjectProps) => void
  delProject: (id: string) => void
  setEducationList: (projects: Set<EducationProps>) => void
  addEducation: (education: EducationProps) => void
  editEducation: (id: string, education: EducationProps) => void
  delEducation: (id: string) => void
  setSkillList: (projects: Set<SkillProps>) => void
  addSkill: (skill: SkillProps) => void
  delSkill: (id: string) => void
  setContactList: (projects: Set<ContactProps>) => void
  addContact: (contact: ContactProps) => void
  delContact: (id: string) => void
  editContact: (id: string, contact: ContactProps) => void
}

export function useResumeEditorContext() {
  return useContext(ResumeEditorContext)
}

export const ResumeEditorContext = createContext<ResumeEditor>({} as ResumeEditor);

export  function newResumeEditor(draft: ResumeProps, setDraft: Dispatch<SetStateAction<ResumeProps>>) {
  const editor = {
    draft: draft,
    setName: (name: string) => {
      setDraft({...draft, meta: {...draft.meta, name: name}})
    },
    setImage: (image: string) => {
      setDraft({ ...draft, profileImage: image })
    },
    setAbout: (about: AboutProps) => {
      setDraft({ ...draft, about: about })
    },
    setWorkList: (works: Set<WorkProps>) => {
      setDraft({ ...draft, works: works })
    },
    addWork: (work: WorkProps) => {
      setDraft({ ...draft, works: { ...draft.works, [work.id]: work} })
    },
    editWork: (id: string, work: WorkProps) => {
      setDraft({ ...draft, works: { ...draft.works, [id]: work } })
    },
    delWork: (id: string) => {
      const works: Set<WorkProps> = Object.fromEntries(Object.entries(draft.works!).filter(([work_id, work]) => work_id !== id))
      setDraft({ ...draft, works: { ...works} })
    },
    setProjectList: (projects: Set<ProjectProps>) => {
      setDraft({ ...draft, projects: projects })
    },
    addProject: (project: ProjectProps) => {
      setDraft({ ...draft, projects: { ...draft.projects, [project.id]: project } })
    },
    editProject: (id: string, project: ProjectProps) => {
      setDraft({ ...draft, projects: { ...draft.projects, [id]: project } })
    },
    delProject: (id: string) => {
      const projects: Set<ProjectProps> = Object.fromEntries(Object.entries(draft.projects!).filter(([project_id, project]) => project_id !== id))
      setDraft({ ...draft, projects: { ...projects } })
    },
    setEducationList: (educations: Set<EducationProps>) => {
      setDraft({ ...draft, educations: educations })
    },
    addEducation: (education: EducationProps) => {
      setDraft({ ...draft, educations: { ...draft.educations, [education.id]: education} })
    },
    editEducation: (id: string, education: EducationProps) => {
      setDraft({ ...draft, educations: { ...draft.educations, [id]: education } })
    },
    delEducation: (id: string) => {
      const educations: Set<EducationProps> = Object.fromEntries(Object.entries(draft.educations!).filter(([education_id, education]) => education_id !== id))
      setDraft({ ...draft, educations: { ...educations} })
    },
    setSkillList: (skills: Set<SkillProps>) => {
      setDraft({ ...draft, skills: skills })
    },
    addSkill: (skill: SkillProps) => {
      setDraft({ ...draft, skills: { ...draft.skills, [skill.name]: skill} })
    },
    delSkill: (id: string) => {
      const skills: Set<SkillProps> = Object.fromEntries(Object.entries(draft.skills!).filter(([skill_id, skill]) => skill_id !== id))
      setDraft({ ...draft, skills: { ...skills} })
    },
    setContactList: (contacts: Set<ContactProps>) => {
      setDraft({ ...draft, contacts: contacts })
    },
    addContact: (contact: ContactProps) => {
      setDraft({ ...draft, contacts: { ...draft.contacts, [contact.kind]: contact} })
    },
    editContact: (id: string, contact: ContactProps) => {
      setDraft({ ...draft, contacts: { ...draft.contacts, [id]: contact } })
    },
    delContact: (id: string) => {
      const contacts: Set<ContactProps> = Object.fromEntries(Object.entries(draft.contacts!).filter(([contact_id, contact]) => contact_id !== id))
      setDraft({ ...draft, contacts: { ...contacts} })
    },
  }
  return {context: ResumeEditorContext, editor}
}

