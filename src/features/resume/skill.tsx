import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Skill as SkillProps, Set } from "../../types/resume";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { ProgressBar } from "primereact/progressbar";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { useResumeEditorContext } from "./context";

const Skill = ({ skill }: { skill: SkillProps }) => {
  const { delSkill } = useResumeEditorContext()
  return (
    <li className="flex flex-row justify-content-between">
      <div className="inline-block flex flex-row w-9 justify-content-between">
        <span> {skill.name} </span>
        <ProgressBar className="w-8 min-w-min " value={skill.level * 10} showValue={false}></ProgressBar>
      </div>
      <span className="pi pi-trash" onClick={() => delSkill(skill.name)}> </span>
    </li>
  )
}

const SkillList = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const { draft } = useResumeEditorContext()
  const skills: Set<SkillProps> | undefined = draft.skills
  if (skills == undefined || skills == null) {
    return (<></>)
  }
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

  let skillListContent: ReactNode
  if (Object.keys(skills).length > 0) {
    skillListContent = Object.entries(skills).map((entry) => {
      return (
        <div className="c-skill-item">
          <Skill skill={entry[1]} />
        </div>
      );
    })
  } else {
    skillListContent = (<span className="c-empty">No any skills added yet.</span>)
  }

  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <AddSkill visible={openAdd} setVisible={setOpenAdd} />
      <div className="c-skills flex flex-column gap-3">
        {skillListContent}
      </div>
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
  const { addSkill } = useResumeEditorContext()
  const [editingSkill, setEditingSkill]: [SkillProps, Dispatch<SetStateAction<SkillProps>>] = useState({} as SkillProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          addSkill(editingSkill)
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
            <label className="text-sm" htmlFor="skill">
              Skill
            </label>
            <InputText
              id="skill"
              className="p-inputtext-sm"
              value={editingSkill.name}
              onChange={(e) => {
                setEditingSkill({ ...editingSkill, name: e.target.value })
              }}
              placeholder="Ex: Java"
            />
            <label className="text-sm" htmlFor="level">
              Level
            </label>
            <InputNumber 
                value={editingSkill.level} 
                onValueChange={(e: InputNumberValueChangeEvent) => setEditingSkill({...editingSkill, level: e.target.value!})} 
                mode="decimal" 
                showButtons 
                min={1}
                max={10} 
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default SkillList;
