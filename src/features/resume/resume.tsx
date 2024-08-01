import ContactList from "./contact";
import EducationList from "./education";
import ProjectList from "./project";
import SkillList from "./skill";
import Summary from "./summary";
import { WorkList } from "./work";
import { Contract, LocationKind, Resume as ResumeProps } from "../../types/resume";
import { useLoaderData } from "react-router-dom";
import  ProfileImage  from "./profile_image";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { TieredMenu } from "primereact/tieredmenu";
import { MutableRefObject, useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { toPDFDocument } from "../../utils/pdf";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


const Resume = () => {
  const resume = useSelector((state: RootState) => state.resume)

  const option_menu: MutableRefObject<TieredMenu|null> = useRef(null);
  const option_items: MenuItem[] = [
    { label: "save as PDF", 
      icon: 'pi pi-file-pdf',
      command: () => {
          toPDFDocument("c-resume-container", "resume.pdf") 
      }
    }
  ]

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
        <div className={className}>
            <div className="flex align-items-center gap-2">
                <span className="p-panel-title">Resume</span>
            </div>

            <div>
                <span className="pi pi-ellipsis-v" onClick={ (e) => {
                   option_menu.current?.toggle(e)
                }}></span>
                <TieredMenu model={option_items} popup ref={option_menu} breakpoint="767px" />
                {options.togglerElement}
            </div>
        </div>
    );
};

  return (
    <Panel headerTemplate={headerTemplate} expandIcon={ PrimeIcons.ANGLE_DOWN } collapseIcon = { PrimeIcons.ANGLE_UP} >
    <div id="c-resume-container" className="c-resume flex flex-column gap-5">
      <section className="c-resume-item flex flex-row gap-4">
        <div className="c-profile-image border-circle flex flex-row align-items-center">
          <ProfileImage image="images/avatar.jpeg"/>
        </div>
        <div className="w-12">
          <Summary/>
        </div>
      </section>
      <section className="c-resume-item">
        <WorkList/>
      </section>
      <section className="c-resume-item">
        <ProjectList/>
      </section>
      <section className="c-resume-item">
        <SkillList />
      </section>
      <section className="c-resume-item">
        <EducationList/>
      </section>
      <section className="c-resume-item">
        <ContactList/>
      </section>
    </div>
  </Panel>
  );
};

export default Resume;
