import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Skill as SkillProps } from "../../types/resume";
import { Dispatch, SetStateAction, useState } from "react";
import { ProgressBar } from "primereact/progressbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { delSkill as delSkillAction, addSkill as addSkillAction } from "./resume-slice"


const SkillList = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const skills = useSelector((state: RootState) => state.resume.skills)
  const dispatch = useDispatch<AppDispatch>()

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Skill</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
          <span className="pi pi-plus-circle" onClick={(e) => setOpenAdd(true)}></span>
          {options.togglerElement}
        </div>
      </div>
    );
  };

  return (
    <Panel
      headerTemplate={headerTemplate}
      {...(skills.length > 0 ? { toggleable: true } : {})}
      {...(skills.length > 0 ? { collapsed: true } : {})}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <AddSkill visible={openAdd} setVisible={setOpenAdd} />
      {skills.length > 0 ? (
        <ul className="list-none flex flex-column gap-3">
          {skills.map((skill, index) => {
            return (
              <li className="flex flex-row justify-content-between">
                <div className="inline-block flex flex-row w-9 justify-content-between">
                  <span> {skill.name} </span>
                  <ProgressBar className="w-8 min-w-min " value={Math.random() * 100} showValue={false}></ProgressBar>
                </div>
                <span className="pi pi-trash" onClick={() => dispatch(delSkillAction(index))}> </span>
              </li>
            )
          })
          }
        </ul>) : (<span className="c-empty">No any skills added yet.</span>)

      }
    </Panel>
  );
};

function AddSkill({
  visible,
  setVisible,
}: {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [newSkill, setNewSkill]: [SkillProps, Dispatch<SetStateAction<SkillProps>>] = useState({} as SkillProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(addSkillAction(newSkill))
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
      header="Add Skill"
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
        <div className="c-add-skill flex flex-column gap-4">
          <div className="c-edit-skill-name flex flex-column gap-2">
            <label className="text-sm" htmlFor="title">
              Skill
            </label>
            <InputText
              id="title"
              className="p-inputtext-sm"
              value={newSkill.name}
              onChange={(e) => {
                setNewSkill({ ...newSkill, name: e.target.value })
              }}
              placeholder="Ex: Java"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default SkillList;
