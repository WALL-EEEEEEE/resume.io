import "../../styles/work.css";
import { Contract, LocationKind,  Work as WorkProps } from "../../types/resume";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
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
import { Dropdown } from "primereact/dropdown";
import { EnumToObjects } from "../../utils/enum";
import { createMarkup } from "../../utils/html";
import { v7 as uuidv7 } from "uuid"
import { durationInMonths } from "../../utils/date";
import { useResumeEditorContext } from "./context";


const Work = ({ work}: { work: WorkProps }) => {
  const { delWork } = useResumeEditorContext()
  const [openEdit, setOpenEdit] = useState(false);

  const title = () => {
    return (
      <div className="flex flex-row justify-content-between">
        <div className="flex align-items-center gap-2 ">
          <span className="p-panel-title">{work.role}</span>
        </div>
        <div className="flex flex-row gap-3">
          <span
            className="pi pi-pen-to-square"
            onClick={() => !openEdit && setOpenEdit(true)}
          ></span>

          <span
            className="pi pi-trash"
            onClick={() => delWork(work.id) }
          ></span>
        </div>
      </div>
    );
  };
  const subtitle = () => {
    const dayOptions = { year: "numeric", month: "short"};
    const start_date: string | undefined = work.start_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const end_date: string | undefined = work.end_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const last = durationInMonths(start_date, end_date)
    return (
      <div className="flex flex-column gap-2 text-sm">
        <span>{work.company + " . " + work.contract_kind}</span>
        <span> {start_date + " - " + end_date + " , " + last} </span>
        <span> {work.location + " . " + work.type}</span>
      </div>
    );
  };

  return (
    <>
      <EditWork
        visible={openEdit}
        setVisible={setOpenEdit}
        work={work}
      />
      <Card title={title} subTitle={subtitle}>
        <p dangerouslySetInnerHTML={createMarkup(work.desp)}></p>
      </Card>
    </>
  );
};

function AddWork({
  visible,
  setVisible,
}: {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
}) {
  const {addWork} = useResumeEditorContext()
  const location_types = EnumToObjects(LocationKind).filter((item) => item.value !== LocationKind.NotSpecified);
  const employment_types = EnumToObjects(Contract).filter((item) => item.value !== Contract.NotSpecified);

  const [editingWork, setEditingWork]:[WorkProps, Dispatch<SetStateAction<WorkProps>>] = useState({} as WorkProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          editingWork.id = uuidv7()
          addWork(editingWork)
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
      header="Add Work"
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
        <div className="c-add-work flex flex-column gap-4">
          <div className="c-edit-work-title flex flex-column gap-2">
            <label className="text-sm" htmlFor="title">
              Title
            </label>
            <InputText
              id="title"
              className="p-inputtext-sm"
              value={editingWork.role}
              onChange={ (e) =>  {
                setEditingWork({...editingWork, role: e.target.value})
              }}
              placeholder="Ex: Backend Engineer"
            />
          </div>

          <div className="c-edit-work-employment-type flex flex-column gap-2">
            <label className="text-sm" htmlFor="employment-type">
              Employment type
            </label>
            <Dropdown
              id="employment-type"
              value={editingWork.contract_kind}
              onChange={(e) => { 
                setEditingWork({...editingWork, contract_kind: e.value})
              }}
              options={employment_types}
              optionLabel="label"
              placeholder="Please select"
              className="p-inputtext-sm"
            />
          </div>

          <div className="c-edit-work-company-name flex flex-column gap-2">
            <label className="text-sm" htmlFor="company-name">
              Company name
            </label>
            <InputText
              id="company-name"
              className="p-inputtext-sm"
              value={editingWork.company}
              placeholder="Ex: Google"
              onChange={ (e) => setEditingWork({...editingWork, company: e.target.value }) }
            />
          </div>

          <div className="c-edit-work-location flex flex-column gap-2">
            <label className="text-sm" htmlFor="location">
              Location
            </label>
            <InputText
              id="location"
              className="p-inputtext-sm"
              placeholder="Ex: London, United Kingdom"
              value={editingWork.location}
              onChange={ (e) => setEditingWork({...editingWork, location: e.target.value })}
            />
          </div>

          <div className="c-edit-work-location-type flex flex-column gap-2">
            <label className="text-sm" htmlFor="location-type">
              Location type
            </label>
            <Dropdown
              id="location-type"
              value={ editingWork.type }
              onChange={(e) => {
                setEditingWork({...editingWork, type: e.value})
              }}
              options={location_types}
              optionLabel="label"
              placeholder="Please select"
              className="p-inputtext-sm"
            />
          </div>

          <div className="c-edit-work-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="start-date">
              Start date
            </label>
            <Calendar
              id="start-date"
              className="p-inputtext-sm"
              value={ editingWork.start_date }
              onChange={(e) => {
                setEditingWork({...editingWork, start_date: e.value?e.value: editingWork.start_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-work-end-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="end-date">
              End date
            </label>
            <Calendar
              id="end-date"
              className="p-inputtext-sm"
              value={ editingWork.end_date }
              onChange={(e) => {
                setEditingWork({...editingWork, end_date: e.value?e.value: editingWork.end_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
            />
          </div>

          <div className="c-edit-work-description flex flex-column gap-2">
            <label className="text-sm" htmlFor="description">
              Description
            </label>
            <Editor
              id="description"
              value={editingWork.desp?editingWork.desp: ""}
              onTextChange={(e: EditorTextChangeEvent) =>
                setEditingWork({...editingWork, desp: e.htmlValue ? e.htmlValue : ""})
              }
              style={{ height: '320px' }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditWork({
  work,
  visible,
  setVisible,
}: {
  work: WorkProps;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { editWork } = useResumeEditorContext()
  const [editingWork, setEditingWork]: [WorkProps, Dispatch<SetStateAction<WorkProps>>] = useState(work);
  const location_types = EnumToObjects(LocationKind).filter((item) => item.value !== LocationKind.NotSpecified);
  const employment_types = EnumToObjects(Contract).filter((item) => item.value !== Contract.NotSpecified);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          editWork(work.id, editingWork)
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
      header="Edit Work"
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
      <div className="c-edit-work flex flex-column gap-4">
        <div className="c-edit-work-title flex flex-column gap-2">
          <label className="text-sm" htmlFor="title">
            Title
          </label>
          <InputText
            id="title"
            className="p-inputtext-sm"
            value={editingWork.role}
            required
            onChange={ (e) => setEditingWork({...editingWork,  role: e.target.value? e.target.value: editingWork.role})}
          />
        </div>

        <div className="c-edit-work-employment-type flex flex-column gap-2">
          <label className="text-sm" htmlFor="employment-type">
            Employment type
          </label>
          <Dropdown
            id="employment-type"
            value={editingWork.contract_kind}
            onChange={(e) => {
              // console.log(e.value)
              setEditingWork({...editingWork, contract_kind: e.value})
            }}
            options={employment_types}
            optionLabel="label"
            placeholder="Select a employment type"
            className="p-inputtext-sm"
            required
          />
        </div>

        <div className="c-edit-work-company-name flex flex-column gap-2">
          <label className="text-sm" htmlFor="company-name">
            Company name
          </label>
          <InputText
            id="company-name"
            className="p-inputtext-sm"
            value={editingWork.company}
            required
            onChange={ (e) => {
              setEditingWork({...editingWork, company: e.target.value? e.target.value: editingWork.company})
            }}
          />
        </div>

        <div className="c-edit-work-location flex flex-column gap-2">
          <label className="text-sm" htmlFor="location">
            Location
          </label>
          <InputText
            id="location"
            className="p-inputtext-sm"
            value={editingWork.location}
            required
            onChange={
              (e)  => {
                setEditingWork({...editingWork, location: e.target.value? e.target.value: editingWork.location })
              }
            }
          />
        </div>

        <div className="c-edit-work-location-type flex flex-column gap-2">
          <label className="text-sm" htmlFor="location-type">
            Location type
          </label>
          <Dropdown
            id="location-type"
            value={ editingWork.type }
            onChange={(e) => {
              setEditingWork({...editingWork, type: e.value})
            }}
            options={location_types}
            optionLabel="label"
            placeholder="Select a location type"
            className="p-inputtext-sm"
            required
          />
        </div>

        <div className="c-edit-work-start-date flex flex-column gap-2">
          <label className="text-sm" htmlFor="start-date">
            Start date
          </label>
          <Calendar
            id="start-date"
            className="p-inputtext-sm"
            value={ editingWork.start_date }
            onChange={(e) => {
              setEditingWork({...editingWork, start_date: e.value? e.value: editingWork.start_date })
            }}
            showIcon
            maxDate={new Date()}
            showMinMaxRange
            view="month"
            dateFormat="M yy"
            required

          />
        </div>

        <div className="c-edit-work-end-date flex flex-column gap-2">
          <label className="text-sm" htmlFor="end-date">
            End date
          </label>
          <Calendar
            id="end-date"
            className="p-inputtext-sm"
            value={editingWork.end_date}
            onChange={(e) => {
              setEditingWork({...editingWork, end_date: e.value? e.value: editingWork.end_date })
            }}
            view="month"
            dateFormat="M yy"
            showIcon
            maxDate={new Date()}
            showMinMaxRange
            required
          />
        </div>

        <div className="c-edit-work-description flex flex-column gap-2">
          <label className="text-sm" htmlFor="description">
            Description
          </label>
          <Editor
            id="description"
            value={work.desp}
            onTextChange={(e: EditorTextChangeEvent) =>
              setEditingWork({...editingWork, desp: e.htmlValue? e.htmlValue: editingWork.desp})
            }
            required
            style={{ height: '320px' }}
          />
        </div>
      </div>
    </Dialog>
  );
}

const WorkList = () => {
  const {draft} = useResumeEditorContext()
  const [openAdd, setOpenAdd] = useState(false)
  const works = draft.works
  if (works === undefined || works === null) {
    return (<></>)
  }

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Work</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
          <span className="pi pi-plus-circle" onClick={ () => setOpenAdd(true)}></span>
          {options.togglerElement}
        </div>
      </div>
    );
  };

  let workListContent: ReactNode
  if (Object.keys(works).length > 0) {

    workListContent = Object.entries(works).map((entry) => {
          return (
            <div className="Work">
              <Work work={entry[1]}/>
            </div>
          );
        })
  } else {
    workListContent = (<span className="c-empty">No any works added yet.</span>)
  }

  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <div className="flex flex-column gap-5">
        <AddWork visible={openAdd} setVisible={setOpenAdd}/>
        {workListContent}
      </div>
    </Panel>
  );
};

export { WorkList, Work, AddWork };