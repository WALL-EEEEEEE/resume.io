// import Card from "../../components/card";
import { useState, Dispatch, SetStateAction } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// import "./about.css";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { createMarkup } from "../../utils/html";
import { useResumeEditorContext } from "./context";



const EditAbout = ({ visible, setVisible }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>> }) => {
  const {draft, setAbout} = useResumeEditorContext()
  const [about, _setAbout] = useState(draft.about)
  const saveAbout = () => {
    setAbout(about!)
    setVisible(false)
  }
  const footer = (
    <div className="c-actions">
      <Button label="Save" icon="pi pi-check-circle" onClick={saveAbout} />
      <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setVisible(false)} autoFocus className="p-button-text" />
    </div>
  );

  return (
    <Dialog header="Edit About" visible={visible} draggable={false} resizable={false} maximizable={true} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footer}>
      <div className="c-editor" >
        <Editor value={about!.desc} onTextChange={
          (e: EditorTextChangeEvent) => {
            const desc = e.htmlValue ? e.htmlValue : ""
            _setAbout({...about, desc})
          }
        }  style={{ height: '320px' }}/>
      </div>
    </Dialog>
  );
};

const About = () => {
  const {draft, setAbout} = useResumeEditorContext()
  const [openEdit, setOpenEdit] = useState(false)
  const about = draft.about
  if (about == undefined || about == null) {
    return (<></>)
  }
  const editClick = () => {
    setOpenEdit(true)
  }

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">About</span>
        </div>

        <div>
          <span className="pi pi-pen-to-square" onClick={editClick}></span>
          {options.togglerElement}
        </div>
      </div>
    );
  };
  return (
    <Panel headerTemplate={headerTemplate} expandIcon={PrimeIcons.ANGLE_DOWN} collapseIcon={PrimeIcons.ANGLE_UP} className="w-full" >
      <EditAbout visible={openEdit} setVisible={setOpenEdit} />
      {about.desc && about.desc.length > 0 ? (
        <div dangerouslySetInnerHTML={createMarkup(about.desc)}>
        </div>) : (
        <span className="c-empty">No any summary about yourself added yet.</span>
      )
      }
    </Panel>
  );
};


export default About;
export { EditAbout }


