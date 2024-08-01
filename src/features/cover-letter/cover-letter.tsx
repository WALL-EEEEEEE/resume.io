
import "./cover-letter.css";
import { CoverLetter as CoverLetterProps } from "../../types/coverletter"
import { createMarkup } from "../../utils/html";
import { toPDFDocument } from "../../utils/pdf"
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import mustache from "mustache";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TieredMenu } from "primereact/tieredmenu";
import { MenuItem } from "primereact/menuitem";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { editCoverLetter as editCoverLetterAction } from "./cover-letter-slice";


const CoverLetter = () => {
  const coverLetter: CoverLetterProps | undefined  = useSelector((state: RootState) => state["cover-letter"].coverLetter)
  console.log(coverLetter)

  const dayOptions = { year: "numeric", month: "short", day: "numeric" };
  const [date, setDate] = useState(
    // @ts-ignore
    new Date().toLocaleDateString("en-us", dayOptions)
  );

  setInterval(() => {
    // @ts-ignore
    const currentDate = new Date().toLocaleDateString("en-us", dayOptions);
    setDate(currentDate);
  }, 3600000);

  let letter_content: string

  if (coverLetter !== undefined && coverLetter !== null) {
    letter_content = mustache.render(coverLetter.letter_template, coverLetter)
  } else {
    letter_content = ""
  }

  const [openEdit, setOpenEdit] = useState(false)
  const editClick = () => {
    setOpenEdit(true)
  }
  const option_menu: MutableRefObject<TieredMenu | null> = useRef(null);
  const option_items: MenuItem[] = [
    {
      label: "save as PDF",
      icon: 'pi pi-file-pdf',
      command: () => {
        toPDFDocument("c-letter-container", "letter-conver.pdf")
      }
    }
  ]

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Cover Letter</span>
        </div>

        <div className="flex flex-row gap-3">
          <span className="pi pi-pen-to-square" onClick={editClick}></span>
          <span className="pi pi-ellipsis-v" onClick={(e) => {
            option_menu.current?.toggle(e)
          }}></span>
          <TieredMenu model={option_items} popup ref={option_menu} breakpoint="767px" />
          {options.togglerElement}
        </div>
      </div>
    );
  };

  return (
    <Panel headerTemplate={headerTemplate} expandIcon={PrimeIcons.ANGLE_DOWN} collapseIcon={PrimeIcons.ANGLE_UP} >
      <EditCoverLetter coverLetter={ coverLetter == undefined ? new CoverLetterProps(): coverLetter } coverLetterId={0} visible={openEdit} setVisible={setOpenEdit} />
      <div>
        { coverLetter !== undefined && coverLetter !== null ? (
          <div id="c-letter-container" className="c-letter-container letter-container">
            <div className="name">{(coverLetter as CoverLetterProps).name}</div>
            <div className="company">
              <div className="hiring-manager-name">
                {(coverLetter as CoverLetterProps).company_info.hiring_manager_name}
              </div>
              <div className="job-title">{(coverLetter as CoverLetterProps).job_title}</div>
              <div className="company-name">{(coverLetter as CoverLetterProps).company_info.name}</div>
            </div>
            <div className="letter-container">
              <div className="date"> {date} </div>
              <div className="to">
                Dear {(coverLetter as CoverLetterProps).company_info.hiring_manager_name}
              </div>
              <div className="letter-content" dangerouslySetInnerHTML={createMarkup(letter_content)}></div>
              <div className="from">
                <span>Yours sincerely</span>
                <span>{(coverLetter as CoverLetterProps).name}</span>
                <span>{(coverLetter as CoverLetterProps).email}</span>
              </div>
            </div>
          </div>
        ) : (<span className="c-empty">No any cover letters added yet.</span>)
        }
      </div>
    </Panel>
  );
};

function EditCoverLetter({ coverLetter, coverLetterId, visible, setVisible }: { coverLetter: CoverLetterProps, coverLetterId: number, visible: boolean, setVisible: Dispatch<SetStateAction<boolean>> }) {
  const [editCoverLetter, setEditCoverLetter] = useState(coverLetter)
  const dispatch = useDispatch<AppDispatch>()

  const footer = (
    <div className="actions">
      <Button label="Save" icon="pi pi-check-circle" onClick={() => {
        dispatch(editCoverLetterAction([editCoverLetter, coverLetterId]))
        setVisible(false)
      }} />

      <Button label="Cancel" icon="pi pi-times-circle" onClick={() => {
        setVisible(false)
      }} autoFocus className="p-button-text" />
    </div>
  );

  return (
    <Dialog header="Edit Cover Letter" visible={visible} draggable={false} resizable={false} maximizable={true} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footer}>
      <div className="edit-container">
        <div className="personal-details edit-item">
          <h4>Personal Details</h4>

          <div className="input-container">
            <div className="input-item">
              <label htmlFor="">Full Name</label>
              <input defaultValue={editCoverLetter.name} type="text" onChange={(e) => {
                const name = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, name: name })
              }}></input>
            </div>
            <div className="input-item">
              <label htmlFor="">Job Title</label>
              <input defaultValue={editCoverLetter.job_title} type="text" onChange={(e) => {
                const job_title = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, job_title: job_title })
              }}></input>
            </div>

            <div className="input-item">
              <label htmlFor="">Address</label>
              <input defaultValue={editCoverLetter.address} type="text" onChange={(e) => {
                const address = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, address: address })
              }}></input> </div>
            <div className="input-item">
              <label htmlFor="">Email</label>
              <input defaultValue={editCoverLetter.email} type="email" onChange={(e) => {
                const email = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, email: email })
              }}></input>
            </div>

            <div className="input-item">
              <label htmlFor="">Phone Number</label>
              <input defaultValue={editCoverLetter.phone_number} type="tel" onChange={(e) => {
                const phone_number = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, phone_number: phone_number })
              }}></input>
            </div>
          </div>
        </div>
        <div className="employer-details edit-item">
          <h4>Employer Details</h4>

          <div className="input-container">
            <div className="input-item">
              <label htmlFor="">Company Name</label>
              <input defaultValue={editCoverLetter.company_info.name} type="text" onChange={(e) => {
                const company_name = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, company_info: { ...editCoverLetter.company_info, name: company_name } })
              }}></input>
            </div>

            <div className="input-item">
              <label htmlFor="">Hiring Manager Name</label>
              <input defaultValue={editCoverLetter.company_info.hiring_manager_name} type="text" onChange={(e) => {
                const hiring_manager_name = e.target?.value ? e.target.value : ""
                setEditCoverLetter({ ...editCoverLetter, company_info: { ...editCoverLetter.company_info, hiring_manager_name: hiring_manager_name } })
              }}></input>
            </div>
          </div>
        </div>

        <div className="letter-details edit-item">
          <h4>Letter Details</h4>
          <div className="editor">
            <Editor value={editCoverLetter.letter_template} onTextChange={(e: EditorTextChangeEvent) => {
              const letter_template = e?.htmlValue ? e.htmlValue : ""
              setEditCoverLetter({ ...editCoverLetter, letter_template: letter_template })
            }} style={{ height: '320px' }} />
          </div>
        </div>
      </div>
    </Dialog>
  );

}

export default CoverLetter;
export { EditCoverLetter };
