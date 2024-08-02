// import Card from "../../components/card";
import { About as AboutProps } from "../../types/resume";
import { useState, Dispatch, SetStateAction} from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// import "./about.css";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { useDispatch, useSelector } from "react-redux";
import { createMarkup } from "../../utils/html";
import { AppDispatch, RootState} from "../../store"
import { editAbout as editAboutAction } from "./resume-slice"



const EditAbout = ({ visible, setVisible}: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>    }) => {
  const about = useSelector((state: RootState) => state.resume.resume?.about )
  const dispatch = useDispatch<AppDispatch>();
  let current_about: AboutProps
  if (about === undefined || about === null) {
    current_about = {} as AboutProps
  } else {
    current_about = {...about}
  }

  const saveAbout= () => {
      dispatch(editAboutAction({...current_about}))
      setVisible(false)
  }

  const footer = (
      <div className="c-actions">
          <Button label="Save" icon="pi pi-check-circle" onClick={ saveAbout }  />
          <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setVisible(false)} autoFocus className="p-button-text" />
      </div>
  );

  return (
      <Dialog header="Edit About" visible={visible} draggable={false} resizable={false} maximizable={true} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footer}>
        <div className="c-editor" >
          <Editor value={current_about.desc} onTextChange={(e: EditorTextChangeEvent) => current_about.desc = (e.htmlValue?e.htmlValue:"") }  />
        </div>
      </Dialog>
  );
};

const About = () => {
  const about = useSelector((state: RootState) => state.resume.resume?.about )
  const [openEdit, setOpenEdit] = useState(false)

  if (about == undefined || about == null) {
    return (<></>)
  }

  const editClick  = () => {
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
                <span className="pi pi-pen-to-square" onClick={ editClick }></span>
                {options.togglerElement}
            </div>
        </div>
    );
};
  return (
    <Panel headerTemplate={headerTemplate} expandIcon={ PrimeIcons.ANGLE_DOWN } collapseIcon = { PrimeIcons.ANGLE_UP} className="w-full" >
      <EditAbout visible={ openEdit } setVisible={setOpenEdit}/>
      {about.desc && about.desc.length > 0 ? (
        <div dangerouslySetInnerHTML={createMarkup(about.desc)}>
        </div>): (
        <span className="c-empty">No any summary about yourself added yet.</span>
      )
      }
      </Panel>
  );
};


export default About;
export { EditAbout }


