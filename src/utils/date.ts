import { differenceInMonths } from "date-fns"

export function durationInMonths(start_date: string, end_date: string) {
    let last_months = differenceInMonths(end_date, start_date)
    let last_years = Math.floor(last_months / 12)
    let last = ""
    if (last_years > 0) {
        last += `${last_years} yrs`
        last_months -= last_years * 12
    }
    if (last_months > 0) {
        last += ` ${last_months} mons`
    }
    return last
}