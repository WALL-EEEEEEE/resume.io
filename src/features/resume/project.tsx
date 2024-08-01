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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { delProject as delProjectAction, addProject as addProjectAction, editProject as editProjectAction } from "./resume-slice";


const Project = ({ project, project_id}: { project: ProjectProps, project_id: number }) => {
  const dispatch = useDispatch<AppDispatch>()
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
            onClick={() => dispatch(delProjectAction(project_id)) }
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

    return (
      <div className="flex flex-column gap-2 text-sm">
        <span> {start_date + " - " + end_date } </span>
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
        { project.url !== "" && (
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
  const dispatch =  useDispatch<AppDispatch>()

  const [newProject, setNewProject]:[ProjectProps, Dispatch<SetStateAction<ProjectProps>>] = useState({} as ProjectProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(addProjectAction({...newProject}))
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
              value={newProject.name}
              onChange={ (e) =>  {
                setNewProject({...newProject, name: e.target.value})
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
              value={newProject.url === "" ? null: newProject.url}
              placeholder="Ex: https://www.github.com/kubernetes"
              onChange={ (e) => setNewProject({...newProject, url: e.target.value }) }
            />
          </div>


          <div className="c-edit-project-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-start-date">
              Start date
            </label>
            <Calendar
              id="project-start-date"
              className="p-inputtext-sm"
              value={ newProject.start_date == new Date(0) ? null: newProject.start_date }
              onChange={(e) => {
                setNewProject({...newProject, start_date: e.value?e.value: newProject.start_date})
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
              value={ newProject.end_date === new Date(0) ? null : newProject.end_date}
              onChange={(e) => {
                setNewProject({...newProject, end_date: e.value?e.value: newProject.end_date})
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
              value={newProject.description}
              onTextChange={(e: EditorTextChangeEvent) =>
                setNewProject({...newProject, description: e.htmlValue ? e.htmlValue : ""})
              }
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
  project_id: number,
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [editProject, setEditProject]: [ProjectProps, Dispatch<SetStateAction<ProjectProps>>] = useState(project);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(editProjectAction([{...editProject}, project_id]))
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
              value={editProject.name}
              onChange={ (e) =>  {
                setEditProject({...editProject, name: e.target.value})
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
              value={editProject.url === "" ? null: editProject.url}
              placeholder="Ex: https://www.github.com/kubernetes"
              onChange={ (e) => setEditProject({...editProject, url: e.target.value }) }
            />
          </div>


          <div className="c-edit-project-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="project-start-date">
              Start date
            </label>
            <Calendar
              id="project-start-date"
              className="p-inputtext-sm"
              value={ editProject.start_date == new Date(0) ? null: editProject.start_date }
              onChange={(e) => {
                setEditProject({...editProject, start_date: e.value?e.value: editProject.start_date})
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
              value={ editProject.end_date === new Date(0) ? null : editProject.end_date}
              onChange={(e) => {
                setEditProject({...editProject, end_date: e.value?e.value: editProject.end_date})
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
              value={editProject.description}
              onTextChange={(e: EditorTextChangeEvent) =>
                setEditProject({...editProject, description: e.htmlValue ? e.htmlValue : ""})
              }
            />
          </div>
      </div>
    </Dialog>
  );
}

const ProjectList = () => {
  const projects = useSelector((state: RootState) => state.resume.resume?.projects)
  const [openAdd, setOpenAdd] = useState(false)
  if (projects === undefined || projects === null) {
    return
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

  return (
    <Panel
      headerTemplate={headerTemplate}
      {...(projects.length > 0? {toggleable:true}:{} ) }
      {...(projects.length > 0? {collapsed:true}:{} ) }
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <div className="flex flex-column gap-5">
        <AddProject visible={openAdd} setVisible={setOpenAdd}/>
        {projects.length > 0 ? projects.map((project, index) => {
          return (
            <div className="project">
              <Project project={project} project_id={index}/>
            </div>
          );
        }): (<span className="c-empty">No any projects added yet.</span>)}
      </div>
    </Panel>
  );
};

export default ProjectList;