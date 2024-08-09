import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
// import "../../styles/project.css";
import { Project as ProjectProps} from "../../types/resume";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Calendar } from "primereact/calendar";
//@ts-ignore
import  Microlink from '@microlink/react'
import { createMarkup } from "../../utils/html";
import { durationInMonths } from "../../utils/date";
import { useResumeEditorContext } from "./context";


const Project = ({ project, project_id}: { project: ProjectProps, project_id: string }) => {
  const { delProject } = useResumeEditorContext()
  const [openEdit, setOpenEdit] = useState(false);

  const title = () => {
    return (
      <div className="flex flex-row justify-content-between">
        <div className="flex align-items-center gap-2 ">
          <span className="p-panel-title">{project.name}</span>
        </div>
        <div className="flex flex-row gap-3">
          <span
            className="pi pi-pen-to-square"
            onClick={() => !openEdit && setOpenEdit(true)}
          ></span>

          <span
            className="pi pi-trash"
            onClick={() => delProject(project_id) }
          ></span>
        </div>
      </div>
    );
  };
  const subtitle = () => {
    const dayOptions = { year: "numeric", month: "short"};
    const start_date: string = project.start_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const end_date: string = project.end_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const last = durationInMonths(start_date, end_date)
    return (
      <div className="flex flex-column gap-2 text-sm">
        <span> {start_date + " - " + end_date + " , " + last } </span>
      </div>
    );
  };

  return (
    <>
      <EditProject
        visible={openEdit}
        setVisible={setOpenEdit}
        project={project}
        project_id={project_id}
      />
      <Card title={title} subTitle={subtitle}>
        { project.url !== undefined && project.url !== null && project.url !== "" && (
          <Microlink url={project.url}/>
        )}
        <p dangerouslySetInnerHTML={createMarkup(project.description)}></p>
      </Card>
    </>
  );
};

function AddProject({
  visible,
  setVisible,
}: {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
}) {
  const {addProject} = useResumeEditorContext()

  const [project, setProject] = useState({} as ProjectProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          addProject(project)
          setVisible(false);
        }}
      />

      <Button
        label="Cancel"
        icon="pi pi-times-circle"
        onClick={() => {
          setVisible(false);
        }}
        autoFocus
        className="p-button-text"
      />
    </div>
  );

  return (
    <Dialog
      header="Add Project"
      visible={visible}
      draggable={false}
      resizable={false}
      maximizable={true}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      footer={footer}
    >
      <div className="add-container">
        <div className="c-add-project flex flex-column gap-4">
          <div className="c-edit-project-name flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-name">
              Name
            </label>
            <InputText
              id="project-name"
              className="p-inputtext-sm"
              value={ project.name === ""?null: project.name }
              onChange={ (e) =>  {
                setProject({...project, name: e.target.value})
              }}
              placeholder="Ex: Kubernetes"
            />
          </div>

          <div className="c-edit-project-url flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-url">
              URL
            </label>
            <InputText
              id="project-url"
              className="p-inputtext-sm"
              value={ project.url === "" ? null: project.url }
              placeholder="Ex: https://www.github.com/kubernetes"
              onChange={ (e) => setProject({...project, url: e.target.value}) }
            />
          </div>


          <div className="c-edit-project-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-start-date">
              Start date
            </label>
            <Calendar
              id="project-start-date"
              className="p-inputtext-sm"
              value={ project.start_date == new Date(0) ? null: project.start_date }
              onChange={(e) => {
                setProject({...project, start_date: e.value??project.start_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-project-end-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="end-date">
              End date
            </label>
            <Calendar
              id="end-date"
              className="p-inputtext-sm"
              value={ project.end_date === new Date(0) ? null : project.end_date}
              onChange={(e) => {
                setProject({...project, end_date: e.value??project.end_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-project-description flex flex-column gap-2">
            <label className="text-sm" htmlFor="description">
              Description
            </label>
            <Editor
              id="description"
              value={project.description}
              onTextChange={(e: EditorTextChangeEvent) =>
                setProject({...project, description: e.htmlValue??""})
              }
              style={{ height: '320px' }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditProject({
  project,
  project_id,
  visible,
  setVisible,
}: {
  project: ProjectProps;
  project_id: string,
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const {editProject}  = useResumeEditorContext()
  const [editingProject, setEditingProject]: [ProjectProps, Dispatch<SetStateAction<ProjectProps>>] = useState(project);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          editProject(project_id, editingProject)
          setVisible(false);
        }}
      />

      <Button
        label="Cancel"
        icon="pi pi-times-circle"
        onClick={() => {
          setVisible(false);
        }}
        autoFocus
        className="p-button-text"
      />
    </>
  );

  return (
    <Dialog
      header="Edit Project"
      visible={visible}
      draggable={false}
      resizable={false}
      maximizable={true}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      footer={footer}
    >
      <div className="c-edit-project flex flex-column gap-4">
          <div className="c-edit-project-name flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-name">
              Name
            </label>
            <InputText
              id="project-name"
              className="p-inputtext-sm"
              value={editingProject.name}
              onChange={ (e) =>  {
                setEditingProject({...editingProject, name: e.target.value})
              }}
              placeholder="Ex: Kubernetes"
            />
          </div>

          <div className="c-edit-project-url flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-url">
              URL
            </label>
            <InputText
              id="project-url"
              className="p-inputtext-sm"
              value={editingProject.url === "" ? null: editingProject.url}
              placeholder="Ex: https://www.github.com/kubernetes"
              onChange={ (e) => setEditingProject({...editingProject, url: e.target.value }) }
            />
          </div>


          <div className="c-edit-project-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-start-date">
              Start date
            </label>
            <Calendar
              id="project-start-date"
              className="p-inputtext-sm"
              value={ editingProject.start_date == new Date(0) ? null: editingProject.start_date }
              onChange={(e) => {
                setEditingProject({...editingProject, start_date: e.value?e.value: editingProject.start_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-project-end-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="end-date">
              End date
            </label>
            <Calendar
              id="end-date"
              className="p-inputtext-sm"
              value={ editingProject.end_date === new Date(0) ? null : editingProject.end_date}
              onChange={(e) => {
                setEditingProject({...editingProject, end_date: e.value?e.value: editingProject.end_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-project-description flex flex-column gap-2">
            <label className="text-sm" htmlFor="description">
              Description
            </label>
            <Editor
              id="description"
              value={editingProject.description}
              onTextChange={(e: EditorTextChangeEvent) =>
                setEditingProject({...editingProject, description: e.htmlValue ? e.htmlValue : ""})
              }

              style={{ height: '320px' }}
            />
          </div>
      </div>
    </Dialog>
  );
}

const ProjectList = () => {
  const { draft } = useResumeEditorContext()
  const projects = draft.projects
  const [openAdd, setOpenAdd] = useState(false)
  if (projects === undefined || projects === null) {
    return (<></>)
  }

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Project</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
          <span className="pi pi-plus-circle" onClick={ () => setOpenAdd(true)}></span>
          {options.togglerElement}
        </div>
      </div>
    );
  };
  let projectListContent: ReactNode
  if (Object.keys(projects).length > 0) {

    projectListContent = Object.entries(projects).map((entry) => {
          return (
            <div className="project">
              <Project project={entry[1]} project_id={entry[0]}/>
            </div>
          );
        })
  } else {
    projectListContent = (<span className="c-empty">No any projects added yet.</span>)
  }
  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <div className="flex flex-column gap-5">
        <AddProject visible={openAdd} setVisible={setOpenAdd}/>
        {projectListContent}
      </div>
    </Panel>
  );
};

export default ProjectList;