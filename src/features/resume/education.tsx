import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Degree, Education as EducationProps } from "../../types/resume"
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Card } from "primereact/card";
import { EnumToObjects } from "../../utils/enum";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { createMarkup } from "../../utils/html";
import { v7 as uuidv7 } from "uuid"
import { durationInMonths } from "../../utils/date";
import { useResumeEditorContext } from "./context";


const Education = ({ education }: { education: EducationProps }) => {
  const { delEducation } = useResumeEditorContext()
  const [openEdit, setOpenEdit] = useState(false);

  const title = () => {
    return (
      <div className="flex flex-row justify-content-between">
        <div className="flex align-items-center gap-2 ">
          <span className="p-panel-title">{education.school}</span>
        </div>
        <div className="flex flex-row gap-3">
          <span
            className="pi pi-pen-to-square"
            onClick={() => !openEdit && setOpenEdit(true)}
          ></span>

          <span
            className="pi pi-trash"
            onClick={() => delEducation(education.id) }
          ></span>
        </div>
      </div>
    );
  };
  const subtitle = () => {
    const dayOptions = { year: "numeric", month: "short"};
    const start_date: string | undefined = education.start_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const end_date: string | undefined = education.end_date?.toLocaleDateString(
      "en-US",
      // @ts-ignore
      dayOptions
    );
    const last = durationInMonths(start_date, end_date)

    return (
      <div className="flex flex-column gap-2 text-sm">
        <span>{education.degree+ ", " + education.field}</span>
        <span> {start_date + " - " + end_date + " , "+ last} </span>
      </div>
    );
  };

  return (
    <>
      <EditEducation
        visible={openEdit}
        setVisible={setOpenEdit}
        education={education}
      />
      <Card title={title} subTitle={subtitle}>
        <p dangerouslySetInnerHTML={createMarkup(education.description)}></p>
      </Card>
    </>
  );
};

function AddEducation({
  visible,
  setVisible,
}: {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
}) {
  const { addEducation } =  useResumeEditorContext()

  const degree_types = EnumToObjects(Degree).filter( (item) => item.value !== Degree.NotSpeficifed);

  const [editingEducation, setEditingEducation]:[EducationProps, Dispatch<SetStateAction<EducationProps>>] = useState({} as EducationProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          addEducation({...editingEducation, id: uuidv7()})
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
      header="Add Education"
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
        <div className="c-add-education flex flex-column gap-4">
          <div className="c-edit-education-school flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-school">
             School 
            </label>
            <InputText
              id="education-school"
              className="p-inputtext-sm"
              value={editingEducation.school===""?null: editingEducation.school}
              onChange={ (e) =>  {
                setEditingEducation({...editingEducation, school: e.target.value})
              }}
              placeholder="Ex: Stanford"
            />
          </div>

          <div className="c-edit-education-degree flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-degree">
              Degree
            </label>
            <Dropdown
              id="education-degree"
              value={editingEducation.degree === Degree.NotSpeficifed? null: editingEducation.degree}
              onChange={(e) => { 
                setEditingEducation({...editingEducation, degree: e.value})
              }}
              options={degree_types}
              optionLabel="label"
              placeholder="Please select"
              className="p-inputtext-sm"
            />
          </div>

          <div className="c-edit-education-field flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-field">
              Field of study
            </label>
            <InputText
              id="education-field"
              className="p-inputtext-sm"
              value={editingEducation.field === ""? null: editingEducation.field}
              placeholder="Ex: Computer Science"
              onChange={ (e) => setEditingEducation({...editingEducation, field: e.target.value }) }
            />
          </div>

          <div className="c-edit-education-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="educaton-start-date">
              Start date
            </label>
            <Calendar
              id="education-start-date"
              className="p-inputtext-sm"
              value={ editingEducation.start_date }
              onChange={(e) => {
                setEditingEducation({...editingEducation, start_date: e.value?e.value: editingEducation.start_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
 
            />
          </div>

          <div className="c-edit-education-end-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-end-date">
              End date
            </label>
            <Calendar
              id="end-date"
              className="p-inputtext-sm"
              value={ editingEducation.end_date }
              onChange={(e) => {
                setEditingEducation({...editingEducation, end_date: e.value?e.value: editingEducation.end_date})
              }}
              showIcon
              maxDate={new Date()}
              showMinMaxRange
              placeholder="Please select"
              view="month"
              dateFormat="M yy"
 
            />
          </div>

          <div className="c-edit-education-grade flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-grade">
             Grade 
            </label>
            <InputText
              id="education-grade"
              className="p-inputtext-sm"
              value={editingEducation.grade === 0 ? null: editingEducation.grade?.toString()}
              onChange={ (e) =>  {
                setEditingEducation({...editingEducation, grade: parseFloat(e.target.value)})
              }}
              placeholder="Ex: 7.5"
            />
          </div>

          <div className="c-edit-education-activity flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-activity">
             Activities and societies
            </label>
            <InputText
              id="education-activity"
              className="p-inputtext-sm"
              value={editingEducation.activities === "" ?null: editingEducation.activities}
              onChange={ (e) =>  {
                setEditingEducation({...editingEducation, activities: e.target.value})
              }}
              placeholder="Ex: Alpha Phi Omega, Marching Band, Volleyball"
            />
          </div>

          <div className="c-edit-education-description flex flex-column gap-2">
            <label className="text-sm" htmlFor="description">
              Description
            </label>
            <Editor
              id="description"
              value={editingEducation.description?editingEducation.description: ""}
              onTextChange={(e: EditorTextChangeEvent) =>
                setEditingEducation({...editingEducation, description: e.htmlValue ? e.htmlValue : ""})
              }
              style={{ height: '320px' }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditEducation({
  education,
  visible,
  setVisible,
}: {
  education: EducationProps;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const {editEducation} = useResumeEditorContext()
  const [editingEducation, setEditingEducation]: [EducationProps, Dispatch<SetStateAction<EducationProps>>] = useState(education);
  const degrees = EnumToObjects(Degree).filter((item) => { return item.value !== Degree.NotSpeficifed });

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          editEducation(editingEducation.id, editingEducation)
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
      header="Edit Education"
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
      <div className="c-edit-education flex flex-column gap-4">
        <div className="c-edit-education-school flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-school">
            School
          </label>
          <InputText
            id="education-school"
            className="p-inputtext-sm"
            value={editingEducation.school}
            required
            onChange={ (e) => setEditingEducation({...editingEducation,  school: e.target.value? e.target.value: editingEducation.school})}
          />
        </div>

        <div className="c-edit-education-degree flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-degree">
            Degree
          </label>
          <Dropdown
            id="education-degree"
            value={editingEducation.degree}
            onChange={(e) => {
              // console.log(e.value)
              setEditingEducation({...editingEducation, degree: e.value})
            }}
            options={degrees}
            optionLabel="label"
            placeholder="Select a degree"
            className="p-inputtext-sm"
            required
          />
        </div>

        <div className="c-edit-education-field flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-field">
            Field
          </label>
          <InputText
            id="education-field"
            className="p-inputtext-sm"
            value={editingEducation.field}
            required
            onChange={ (e) => {
              setEditingEducation({...editingEducation, field: e.target.value? e.target.value: editingEducation.field})
            }}
          />
        </div>

        <div className="c-edit-education-grade flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-grade">
             Grade 
            </label>
            <InputText
              id="education-grade"
              className="p-inputtext-sm"
              value={editingEducation.grade?.toFixed(1) }
              onChange={ (e) =>  {
                setEditingEducation({...editingEducation, grade: parseFloat(e.target.value)})
              }}
              placeholder="Ex: 7.5"
            />
          </div>

          <div className="c-edit-education-activity flex flex-column gap-2">
            <label className="text-sm" htmlFor="education-activity">
             Activities and societies
            </label>
            <InputText
              id="education-activity"
              className="p-inputtext-sm"
              value={editingEducation.activities}
              onChange={ (e) =>  {
                setEditingEducation({...editingEducation, activities: e.target.value})
              }}
              placeholder="Ex: Alpha Phi Omega, Marching Band, Volleyball"
            />
          </div>
        <div className="c-edit-education-start-date flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-start-date">
            Start date
          </label>
          <Calendar
            id="education-start-date"
            className="p-inputtext-sm"
            value={ editingEducation.start_date}
            onChange={(e) => {
              setEditingEducation({...editingEducation, start_date: e.value? e.value: editingEducation.start_date })
            }}
            showIcon
            maxDate={new Date()}
            showMinMaxRange
            required
            view="month"
            dateFormat="M yy"
          />
        </div>

        <div className="c-edit-education-end-date flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-end-date">
            End date
          </label>
          <Calendar
            id="education-end-date"
            className="p-inputtext-sm"
            value={editingEducation.end_date}
            onChange={(e) => {
              setEditingEducation({...editingEducation, end_date: e.value? e.value: editingEducation.end_date })
            }}
            showIcon
            maxDate={new Date()}
            showMinMaxRange
            view="month"
            dateFormat="M yy"
            required
          />
        </div>

        <div className="c-edit-education-description flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-description">
            Description
          </label>
          <Editor
            id="education-description"
            value={education.description}
            onTextChange={(e: EditorTextChangeEvent) =>
              setEditingEducation({...editingEducation, description: e.htmlValue? e.htmlValue: editingEducation.description})
            }
            required
            style={{ height: '320px' }}
          />
        </div>
      </div>
    </Dialog>
  );
}

const EducationList = () => {
  const {draft, setEducationList} = useResumeEditorContext()
  const educations = draft.educations
  // const educations = useSelector((state: RootState) => state.resume.resume?.educations)
  const [openAdd, setOpenAdd] = useState(false)
  if (educations === undefined || educations === null) {
    return (<></>)
  }

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Education</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
          <span className="pi pi-plus-circle" onClick={ () => setOpenAdd(true)}></span>
          {options.togglerElement}
        </div>
      </div>
    );
  };
  let educationListContent: ReactNode
  if (Object.keys(educations).length > 0) {

    educationListContent = Object.entries(educations).map((entry) => {
          return (
            <div className="education">
              <Education education={entry[1]}/>
            </div>
          );
        })
  } else {
    educationListContent = (<span className="c-empty">No any educations added yet.</span>)
  }

  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <div className="flex flex-column gap-5">
        <AddEducation  visible={openAdd} setVisible={setOpenAdd}/>
        { educationListContent }
      </div>
    </Panel>
  );
};

export { EducationList, Education, AddEducation };
export default EducationList;
