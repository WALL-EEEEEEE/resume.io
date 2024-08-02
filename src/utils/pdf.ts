import { jsPDF } from "jspdf";
import { toCanvas } from 'html-to-image'
import { createFile } from "./opfs";

const pixel_to_mm = 0.2645833333

type PageSize = {
    width: number 
    height: number
}

export class PDFSize {
   static readonly A0:PageSize = {width: 841, height:1189}
   static readonly A1:PageSize = {width: 594, height:841}
   static readonly A2:PageSize = {width: 420, height:594}
   static readonly A3:PageSize = {width: 297, height:420}
   static readonly A4:PageSize = {width: 210, height:297}
   static readonly A5:PageSize = {width: 148, height:210}
   static readonly A6:PageSize = {width: 105, height:148}
   static readonly A7:PageSize = {width: 74, height:105}
   static readonly A8:PageSize = {width: 52, height:74}
   static readonly A9:PageSize = {width: 37, height:52}
   static readonly A10:PageSize = {width: 26, height:37}
}


export async function toPDFDocument(element: string): Promise<URL> {
    if (element.length === 0 ) {
        throw `element selector can't be empty`
    }
    const pdf_element = document.getElementById(element);
    if (pdf_element === undefined || pdf_element === null) {
        throw `element ${element} not exists`
    }
    //@ts-ignore
    const canvas = await toCanvas(pdf_element)
    const imageToPDF = (canvas: HTMLCanvasElement) => {
        const pdf_padding_top = 30
        const canvas_width = pixel_to_mm*canvas.width
        const canvas_height = pixel_to_mm*canvas.height
        const imgData = canvas.toDataURL('image/png');
        const pdf_width = Math.max(canvas_height, canvas_width) + pdf_padding_top*2
        const pdf_height = Math.max(canvas_height, canvas_width) + pdf_padding_top*2
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [pdf_width, pdf_height],
            compress: true,
        });
        const pdf_padding_left = (pdf_width - canvas_width)/2
        pdf.addImage(imgData, 'JPEG', pdf_padding_left, pdf_padding_top, canvas_width , canvas_height);
        return pdf.output("bloburl")
      };
    return imageToPDF(canvas)
  }

export async function downloadAsPDF(element_selector: string, name: string) {
  const blobURL = await toPDFDocument(element_selector)
  const fakePDFLink = document.createElement('a')
  fakePDFLink.href = blobURL.toString()
  fakePDFLink.download = name
  fakePDFLink.click()
}

export async function saveAsPDF(element_selector: string, name:string) {
  const blobURL = await toPDFDocument(element_selector)
  const blobResp = await fetch(blobURL)
  const blob =  await blobResp.blob()
  await createFile(name, await blob.arrayBuffer())
}