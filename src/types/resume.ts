export class Resume  {
    profileImage?:string 
    about?: About
    projects?: Project[]
    works?: Work[]
    skills?: Skill[]
    educations?: Education[]
    contacts?: Contact[]
}

export class About  {
    desc: string = ""
}

export class Project  {
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
}

