//@ts-ignore
import { sanitize } from "dompurify";


export function createMarkup(dirty: string) {
    return {__html: sanitize(dirty)}
}
