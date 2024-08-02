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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addWork as addWorkAction, editWork as editWorkAction, delWork as delWorkAction } from "./resume-slice"


const Work = ({ work, work_id}: { work: WorkProps, work_id: number }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch  = useDispatch<AppDispatch>()

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
            onClick={() => dispatch(delWorkAction(work_id)) }
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

    return (
      <div className="flex flex-column gap-2 text-sm">
        <span>{work.company + " . " + work.contract_kind}</span>
        <span> {start_date + " - " + end_date + " . " + work.last} </span>
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
        work_id={work_id}
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
  const dispatch = useDispatch<AppDispatch>()
  const location_types = EnumToObjects(LocationKind).filter((item) => item.value !== LocationKind.NotSpecified);
  const employment_types = EnumToObjects(Contract).filter((item) => item.value !== Contract.NotSpecified);

  const [editWork, setEditWork]:[WorkProps, Dispatch<SetStateAction<WorkProps>>] = useState({} as WorkProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(addWorkAction({...editWork}))
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
              value={editWork.role}
              onChange={ (e) =>  {
                setEditWork({...editWork, role: e.target.value})
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
              value={editWork.contract_kind}
              onChange={(e) => { 
                setEditWork({...editWork, contract_kind: e.value})
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
              value={editWork.company}
              placeholder="Ex: Google"
              onChange={ (e) => setEditWork({...editWork, company: e.target.value }) }
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
              value={editWork.location}
              onChange={ (e) => setEditWork({...editWork, location: e.target.value })}
            />
          </div>

          <div className="c-edit-work-location-type flex flex-column gap-2">
            <label className="text-sm" htmlFor="location-type">
              Location type
            </label>
            <Dropdown
              id="location-type"
              value={ editWork.type }
              onChange={(e) => {
                setEditWork({...editWork, type: e.value})
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
              value={ editWork.start_date }
              onChange={(e) => {
                setEditWork({...editWork, start_date: e.value?e.value: editWork.start_date})
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
              value={ editWork.end_date }
              onChange={(e) => {
                setEditWork({...editWork, end_date: e.value?e.value: editWork.end_date})
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
              value={editWork.desp?editWork.desp: ""}
              onTextChange={(e: EditorTextChangeEvent) =>
                setEditWork({...editWork, desp: e.htmlValue ? e.htmlValue : ""})
              }
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditWork({
  work_id,
  work,
  visible,
  setVisible,
}: {
  work_id: number,
  work: WorkProps;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [editWork, setEditWork]: [WorkProps, Dispatch<SetStateAction<WorkProps>>] = useState(work);
  const location_types = EnumToObjects(LocationKind).filter((item) => item.value !== LocationKind.NotSpecified);
  const employment_types = EnumToObjects(Contract).filter((item) => item.value !== Contract.NotSpecified);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(editWorkAction([{...editWork}, work_id]))
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
            value={editWork.role}
            required
            onChange={ (e) => setEditWork({...editWork,  role: e.target.value? e.target.value: editWork.role})}
          />
        </div>

        <div className="c-edit-work-employment-type flex flex-column gap-2">
          <label className="text-sm" htmlFor="employment-type">
            Employment type
          </label>
          <Dropdown
            id="employment-type"
            value={editWork.contract_kind}
            onChange={(e) => {
              // console.log(e.value)
              setEditWork({...editWork, contract_kind: e.value})
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
            value={editWork.company}
            required
            onChange={ (e) => {
              setEditWork({...editWork, company: e.target.value? e.target.value: editWork.company})
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
            value={editWork.location}
            required
            onChange={
              (e)  => {
                setEditWork({...editWork, location: e.target.value? e.target.value: editWork.location })
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
            value={ editWork.type }
            onChange={(e) => {
              setEditWork({...editWork, type: e.value})
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
            value={ editWork.start_date }
            onChange={(e) => {
              setEditWork({...editWork, start_date: e.value? e.value: editWork.start_date })
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
            value={editWork.end_date}
            onChange={(e) => {
              setEditWork({...editWork, end_date: e.value? e.value: editWork.end_date })
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
              setEditWork({...editWork, desp: e.htmlValue? e.htmlValue: editWork.desp})
            }
            required
          />
        </div>
      </div>
    </Dialog>
  );
}

const WorkList = () => {
  const works =  useSelector((state: RootState) => state.resume.resume?.works )
  const [openAdd, setOpenAdd] = useState(false)
  if (works === undefined || works == null) {
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

  return (
    <Panel
      headerTemplate={headerTemplate}
      {...(works.length > 0? {toggleable:true}:{} ) }
      {...(works.length > 0? {collapsed:true}:{} ) }
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <div className="flex flex-column gap-5">
        <AddWork visible={openAdd} setVisible={setOpenAdd}/>
        {works.length > 0 ? works.map((work, index) => {
          return (
            <div className="work">
              <Work work={work} work_id={index}/>
            </div>
          );
        }): (<span className="c-empty">No any work experiences added yet.</span>)}
      </div>
    </Panel>
  );
};

export { WorkList, Work, AddWork };