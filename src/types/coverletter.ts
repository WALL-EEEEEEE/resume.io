export class CoverLetter  {
    name: string = ""
    job_title: string = ""
    address: string = ""
    email: string = ""
    phone_number: string = ""
    company_info: CompanyInfo = new CompanyInfo()
    letter_template: string = ""
    letter: string = ""
}

export class CompanyInfo {
     name: string = ""
     hiring_manager_name: string = ""
}
