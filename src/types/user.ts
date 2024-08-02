import { Resume } from "./resume"
import { CoverLetter } from "./coverletter"

export class User {
    id?: number
    name?: string
    password?:string
    coverLetters?: CoverLetter[] = []
    resumes?: Resume[]
}