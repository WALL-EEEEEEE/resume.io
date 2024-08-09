export class ResumeMeta {
    id: string = ""
    name: string = ""
    userId: string = ""
    category?: string[]
    status?:string
    createdTime?:Date
    updatedTime?:Date
}

export type Set<T> = {[id:string]: T}

export class Resume  {
    meta: ResumeMeta = new ResumeMeta()
    profileImage?:string 
    about?: About
    projects?: Set<Project>
    works?:  Set<Work>
    skills?: Set<Skill>
    educations?: Set<Education>
    contacts?: Set<Contact>
}

export class About  {
    desc: string = ""
}

export class Project  {
    id: string = "";
    name: string = "";
    description: string = "";
    skills: string[] = []
    start_date: Date = new Date(0);
    end_date: Date = new Date(0);
    contributors: string[] = []
    works: Work[] = []
    url: string = ""
}

export enum Degree {
    NotSpeficifed = "",
    SelfTaught="Self Taught's",
    HighSchool = "High School's",
    Master = "Master's",
    Bachelor = "Bachelor's",
    Doctor = "Doctor's"
}

export class Education {
    id: string = "";
    school: string = "";
    degree: Degree = Degree.NotSpeficifed;
    field:  string = "";
    start_date: Date = new Date(0);
    end_date: Date = new Date(0);
    grade: number = 0;
    activities: string = "";
    description: string = "";
}

export enum Contract {
    NotSpecified = "",
    Permanent = "Permanent",
    Contract = "Contract",
    Flexible = "Flexible"
}

export enum LocationKind {
    NotSpecified = "",
    OnSite = "On-Site",
    Hybrid = "Habrid",
    Remote = "Remote",
}

export enum ContactKind {
    NotSpecified = "",
    Phone = "Phone",
    Email = "Email"
}

export type Contact = {
    kind: ContactKind,
    value: any
}

export class Phone implements Contact {
    kind: ContactKind = ContactKind.Phone;
    value: string = "";
}
export class Email implements Contact {
    kind: ContactKind = ContactKind.Email;
    value: string = "";
}





export class Work {
    id: string = "";
    role: string = "";
    company: string = "";
    contract_kind:  Contract = Contract.NotSpecified;
    start_date: Date = new Date(0);
    end_date: Date = new Date(0);
    last: string = "";
    location: string = "";
    type: LocationKind = LocationKind.NotSpecified;
    desp: string = "";
}

export class Skill {
    name: string = "";
    level: number = 0;
}

