import ContactList from "./contact";
import EducationList from "./education";
import ProjectList from "./project";
import SkillList from "./skill";
import Summary from "./summary";
import { WorkList } from "./work";
import Image from "./avatar";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { TieredMenu } from "primereact/tieredmenu";
import { MutableRefObject, useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { saveAsPDF, downloadAsPDF } from "../../utils/pdf";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { initProject as initProjectAction, initWork as initWorkAction, initEducation as initEducationAction, initAbout as initAboutAction, initContact as initContactAction, initSkill as initSkillAction, initProfilePicture as initProfilePictureAction } from "./resume-slice";

const RESUME_PDF = "resume.pdf"

const Resume = () => {
  const resume = useSelector((state: RootState) => state.resume)
  const dispatch = useDispatch<AppDispatch>()
  const add_menu: MutableRefObject<TieredMenu | null> = useRef(null);
  const add_items: MenuItem[] = [
    {
      label: "Project",
      command: () => {
        dispatch(initProjectAction())
      }
    },
    {
      label: "Work",
      command: () => {
        dispatch(initWorkAction())
      }
    },
    {
      label: "Education",
      command: () => {
        dispatch(initEducationAction())
      }
    },
    {
      label: "About",
      command: () => {
        dispatch(initAboutAction())
      }
    },
    {
      label: "Skill",
      command: () => {
        dispatch(initSkillAction())
      }
    },
    {
      label: "Contact",
      command: () => {
        dispatch(initContactAction())
      }
    },
    {
      label: "Profile Picture",
      command: () => {
        dispatch(initProfilePictureAction())
      }
    },
  ]

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
         saveAsPDF("c-resume-container", ["pdfs",RESUME_PDF].join("/")).then(() => {
          console.log("save resume as PDF document successfully")
        }).catch((e) => {
          console.trace(`error occur while saving resume as PDF document`, e)
        })    
      }
    },
  ]

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Resume</span>
        </div>

        <div className="flex flex-row gap-3">
          <span
            className="pi pi-plus-circle"
            onClick={(e) => add_menu.current?.toggle(e)}
          ></span>
          <TieredMenu model={add_items} popup ref={add_menu} breakpoint="767px" />

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
      <div id="c-resume-container" className="c-resume flex flex-column gap-5">
        <section className="c-resume-item flex flex-row gap-4">
          <Image />
          <Summary />
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

export default Resume;
