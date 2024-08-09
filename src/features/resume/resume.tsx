import ContactList from "./contact";
import EducationList from "./education";
import ProjectList from "./project";
import SkillList from "./skill";
import About from "./about";
import { WorkList } from "./work";
import Image from "./avatar";
import { About as AboutProps } from "../../types/resume";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { TieredMenu } from "primereact/tieredmenu";
import { MutableRefObject, useRef } from "react";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import { saveAsPDF, downloadAsPDF } from "../../utils/pdf";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { InputText } from "primereact/inputtext";
import "./resume.css"
import { useResumeEditorContext } from "./context";

const RESUME_PDF = "resume.pdf"
type ResumeID = string


const ResumeActions = () => {
  const { setImage, setAbout, setProjectList, setWorkList, setEducationList, setSkillList, setContactList } = useResumeEditorContext()
  const resume_items = [
    "Project",
    "Work",
    "Education",
    "About",
    "Skill",
    "Contact",
    "Profile Picture",
  ]
  const callback = (e: MenuItemCommandEvent) => {
    if (e.item.label == null) {
      return
    }
    switch (e.item.label) {
      case "About":
        setAbout(new AboutProps())
        break
      case "Project":
        setProjectList({})
        break
      case "Work":
        setWorkList({})
        break
      case "Education":
        setEducationList({})
        break
      case "Skill":
        setSkillList({})
        break
      case "Contact":
        setContactList({})
        break
      case "Profile Picture":
        setImage("")
        break
    }
  }
  const menu: MutableRefObject<TieredMenu | null> = useRef(null);
  const menu_items: MenuItem[] = [
    ...resume_items.map((item: string) => {
      return {
        label: item,
        command: callback,
      } as MenuItem
    })
  ]
  return (
    <>
      <span
        className="pi pi-plus-circle"
        onClick={(e) => menu.current?.toggle(e)}
      ></span>
      <TieredMenu model={menu_items} popup ref={menu} breakpoint="767px" />
    </>
  )

}

const ResumeOptions = () => {
  const option_menu: MutableRefObject<TieredMenu | null> = useRef(null);
  const option_items: MenuItem[] = [
    {
      label: "download as PDF",
      icon: 'pi pi-download',
      command: () => {
        downloadAsPDF("c-resume-container", RESUME_PDF).then(() => {
          console.log("downloaded resume as PDF document successfully")
        }).catch((e) => {
          console.trace(`error occur while downloading resume as PDF document`, e)
        })
      }
    },
    {
      label: "upload as PDF",
      icon: 'pi pi-cloud-upload',
      command: () => {
        saveAsPDF("c-resume-container", ["pdfs", RESUME_PDF].join("/")).then(() => {
          console.log("save resume as PDF document successfully")
        }).catch((e) => {
          console.trace(`error occur while saving resume as PDF document`, e)
        })
      }
    },
  ]
  return (
    <>
      <span className="pi pi-ellipsis-v" onClick={(e) => {
        option_menu.current?.toggle(e)
      }}></span>
      <TieredMenu model={option_items} popup ref={option_menu} breakpoint="767px" />
    </>
  )


}

const AddResume = () => {
  const { draft, setName } = useResumeEditorContext()
  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;
    return (
      <>
        {draft && (
          <div className={className}>
            <div className="flex align-items-center gap-2">
              <InputText value={draft.meta.name} onChange={(e) => {
                const name = e.target.value ? e.target.value : ""
                setName(name)
              }} />
            </div>
            <div className="flex flex-row gap-3">
              <ResumeActions />
              {options.togglerElement}
            </div>
          </div>
        )
        }
      </>
    );
  };
  return (
      <Panel headerTemplate={headerTemplate} expandIcon={PrimeIcons.ANGLE_DOWN} collapseIcon={PrimeIcons.ANGLE_UP} >
        <div id="c-resume-container" className="c-resume flex flex-column gap-5">
          <section className="c-resume-item flex flex-row gap-4">
            <Image />
            <About />
          </section>
          <section className="c-resume-item">
            <WorkList />
          </section>
          <section className="c-resume-item">
            <ProjectList />
          </section>
          <section className="c-resume-item">
            <SkillList />
          </section>
          <section className="c-resume-item">
            <EducationList />
          </section>
          <section className="c-resume-item">
            <ContactList />
          </section>
        </div>
      </Panel>
  );
};

const Resume = ({ id }: { id: string }) => {
  // const resume = useSelector((state: RootState) => state.resume)
  if (id === undefined) {
    id = uuidv7()
  }
  const dispatch = useDispatch<AppDispatch>()

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">
            Resume
          </span>
        </div>

        <div className="flex flex-row gap-3">
          <ResumeActions id={id} />
          <ResumeOptions id={id} />
          {options.togglerElement}
        </div>
      </div>
    );
  };

  return (
    <Panel headerTemplate={headerTemplate} expandIcon={PrimeIcons.ANGLE_DOWN} collapseIcon={PrimeIcons.ANGLE_UP} >
      <div id="c-resume-container" className="c-resume flex flex-column gap-5">
        <section className="c-resume-item flex flex-row gap-4">
          <Image id={id} />
          <About id={id} />
        </section>
        <section className="c-resume-item">
          <WorkList id={id} />
        </section>
        <section className="c-resume-item">
          <ProjectList id={id} />
        </section>
        <section className="c-resume-item">
          <SkillList id={id} />
        </section>
        <section className="c-resume-item">
          <EducationList id={id} />
        </section>
        <section className="c-resume-item">
          <ContactList id={id} />
        </section>
      </div>
    </Panel>
  );
};

const ResumeList = () => {
  return (<></>)
}


export { Resume, AddResume };
