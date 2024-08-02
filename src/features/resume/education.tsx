import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Degree, Education as EducationProps } from "../../types/resume"
import { Dispatch, SetStateAction, useState } from "react";
import { Card } from "primereact/card";
import { EnumToObjects } from "../../utils/enum";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { createMarkup } from "../../utils/html";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { editEducation as editEducationAction, addEducation as addEducationAction, delEducation as delEducationAction, editEducation} from "./resume-slice"


const Education = ({ education, education_id }: { education: EducationProps, education_id: number }) => {
  const dispatch = useDispatch<AppDispatch>();
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
            onClick={() => dispatch(delEducationAction(education_id)) }
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

    return (
      <div className="flex flex-column gap-2 text-sm">
        <span>{education.degree+ ", " + education.field}</span>
        <span> {start_date + " - " + end_date } </span>
      </div>
    );
  };

  return (
    <>
      <EditEducation
        visible={openEdit}
        setVisible={setOpenEdit}
        education={education}
        education_id={education_id}
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
  const degree_types = EnumToObjects(Degree).filter( (item) => item.value !== Degree.NotSpeficifed);
  const dispatch = useDispatch<AppDispatch>();

  const [newEducation, setNewEducation]:[EducationProps, Dispatch<SetStateAction<EducationProps>>] = useState({} as EducationProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(addEducationAction({...newEducation}))
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
              value={newEducation.school===""?null: newEducation.school}
              onChange={ (e) =>  {
                setNewEducation({...newEducation, school: e.target.value})
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
              value={newEducation.degree === Degree.NotSpeficifed? null: newEducation.degree}
              onChange={(e) => { 
                setNewEducation({...newEducation, degree: e.value})
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
              value={newEducation.field === ""? null: newEducation.field}
              placeholder="Ex: Computer Science"
              onChange={ (e) => setNewEducation({...newEducation, field: e.target.value }) }
            />
          </div>

          <div className="c-edit-education-start-date flex flex-column gap-2">
            <label className="text-sm" htmlFor="educaton-start-date">
              Start date
            </label>
            <Calendar
              id="education-start-date"
              className="p-inputtext-sm"
              value={ newEducation.start_date }
              onChange={(e) => {
                setNewEducation({...newEducation, start_date: e.value?e.value: newEducation.start_date})
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
              value={ newEducation.end_date }
              onChange={(e) => {
                setNewEducation({...newEducation, end_date: e.value?e.value: newEducation.end_date})
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
              value={newEducation.grade === 0 ? null: newEducation.grade?.toString()}
              onChange={ (e) =>  {
                setNewEducation({...newEducation, grade: parseFloat(e.target.value)})
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
              value={newEducation.activities === "" ?null: newEducation.activities}
              onChange={ (e) =>  {
                setNewEducation({...newEducation, activities: e.target.value})
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
              value={newEducation.description?newEducation.description: ""}
              onTextChange={(e: EditorTextChangeEvent) =>
                setNewEducation({...newEducation, description: e.htmlValue ? e.htmlValue : ""})
              }
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditEducation({
  education,
  education_id,
  visible,
  setVisible,
}: {
  education: EducationProps;
  education_id: number,
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [editEducation, setEditEducation]: [EducationProps, Dispatch<SetStateAction<EducationProps>>] = useState(education);
  const degrees = EnumToObjects(Degree).filter((item) => { return item.value !== Degree.NotSpeficifed });
  const dispatch = useDispatch<AppDispatch>();

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(editEducationAction([{...editEducation}, education_id]))
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
            value={editEducation.school}
            required
            onChange={ (e) => setEditEducation({...editEducation,  school: e.target.value? e.target.value: editEducation.school})}
          />
        </div>

        <div className="c-edit-education-degree flex flex-column gap-2">
          <label className="text-sm" htmlFor="education-degree">
            Degree
          </label>
          <Dropdown
            id="education-degree"
            value={editEducation.degree}
            onChange={(e) => {
              // console.log(e.value)
              setEditEducation({...editEducation, degree: e.value})
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
            value={editEducation.field}
            required
            onChange={ (e) => {
              setEditEducation({...editEducation, field: e.target.value? e.target.value: editEducation.field})
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
              value={editEducation.grade?.toFixed(1) }
              onChange={ (e) =>  {
                setEditEducation({...editEducation, grade: parseFloat(e.target.value)})
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
              value={editEducation.activities}
              onChange={ (e) =>  {
                setEditEducation({...editEducation, activities: e.target.value})
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
            value={ editEducation.start_date}
            onChange={(e) => {
              setEditEducation({...editEducation, start_date: e.value? e.value: editEducation.start_date })
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
            value={editEducation.end_date}
            onChange={(e) => {
              setEditEducation({...editEducation, end_date: e.value? e.value: editEducation.end_date })
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
              setEditEducation({...editEducation, description: e.htmlValue? e.htmlValue: editEducation.description})
            }
            required
          />
        </div>
      </div>
    </Dialog>
  );
}

const EducationList = () => {
  const educations = useSelector((state: RootState) => state.resume.resume?.educations)
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

  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
      {...(educations.length > 0? {toggleable:true}:{} ) }
      {...(educations.length > 0? {collapsed:true}:{} ) }
    >
      <div className="flex flex-column gap-5">
        <AddEducation  visible={openAdd} setVisible={setOpenAdd}/>
        {educations.length > 0 ? educations.map((education, index) => {
          return (
            <div className="education">
              <Education education={education} education_id={index}/>
            </div>
          );
        }):(<span className="c-empty">No any education experiences added yet.</span>)
      }
      </div>
    </Panel>
  );
};

export { EducationList, Education, AddEducation };
export default EducationList;
