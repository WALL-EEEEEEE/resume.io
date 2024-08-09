import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { ContactKind, Contact as ContactProps } from "../../types/resume";
import { Dispatch, MutableRefObject, ReactNode, SetStateAction, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TieredMenu } from "primereact/tieredmenu";
import { useResumeEditorContext } from "./context";


function Contact({ contact }: { contact: ContactProps }) {
  const { delContact } = useResumeEditorContext()

  switch (contact.kind) {
    case ContactKind.Email:
      return (
        <li className="c-contact-item flex flex-row justify-content-between">
          <div className="flex flex-row gap-2 align-items-center">
            {/* {contact.kind === ContactKind.Phone && (
                    <span className="pi pi-mobile"></span>
                  )} */}
            <span className="pi pi-envelope"></span>
            <span>{contact.value}</span>
          </div>
          <span className="pi pi-trash" onClick={(e) => delContact(contact.kind)}></span>
        </li>
      )
    case ContactKind.Phone:
      return (
        <li className="c-contact-item flex flex-row justify-content-between">
          <div className="flex flex-row gap-2 align-items-center">
            {contact.kind === ContactKind.Phone && (
              <span className="pi pi-mobile"></span>
            )}
            <span>{contact.value} </span>
          </div>
          <span className="pi pi-trash" onClick={(e) => delContact(contact.kind)}></span>
        </li>
      )
    default:
      return (<></>)
  }

}

function AddContact({
  kind,
  visible,
  setVisible,
}: {
  kind: ContactKind
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { addContact } = useResumeEditorContext()
  const [editingContact, setEditingContact]: [
    ContactProps,
    Dispatch<SetStateAction<ContactProps>>
  ] = useState({} as ContactProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          addContact(editingContact)
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
  let contactInput: ReactNode
  switch (kind) {
    case ContactKind.Email:
      contactInput = (
        <div className={`c-edit-contact-email flex flex-column gap-2`}>
          <label className="text-sm" htmlFor="contact-email">
            Email
          </label>
          <InputText id="contact-email" className="p-inputtext-sm" placeholder="xxxxxx@xxxx"
            keyfilter="email"
            value={editingContact.value === "" ? null : editingContact.value}
            onChange={(e) => {
              setEditingContact({ ...editingContact, value: e.target.value, kind: kind });
            }}
          ></InputText>
        </div>
      )
      break
    case ContactKind.Phone:
      contactInput = (
        <div className="c-edit-contact-phone flex flex-column gap-2" >
          <label className="text-sm" htmlFor="contact-phone">
            Phone
          </label>
          <InputText id="contact-phone" className="p-inputtext-sm"  placeholder="xxxx-xxxxxxxxx"
            value={editingContact.value === "" ? null : editingContact.value}
            onChange={(e) => {
              setEditingContact({ ...editingContact, value: e.target.value, kind: kind });
            }}
          ></InputText>
        </div>
      )
      break
  }

  return (
    <Dialog
      header={`Add ${kind}`}
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
        <div className="c-add-contact flex flex-column gap-4">
          {contactInput}
        </div>
      </div>
    </Dialog>
  );
}

function EditContact({
  contact,
  visible,
  setVisible,
}: {
  contact: ContactProps;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { editContact } = useResumeEditorContext()
  const [editingContact, setEditingContact]: [
    ContactProps,
    Dispatch<SetStateAction<ContactProps>>
  ] = useState(contact);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          editContact(editingContact.kind, editingContact);
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
  let contactInput: ReactNode
  switch (contact.kind) {
    case ContactKind.Email:
      contactInput = (
        <div className={`c-edit-contact-email flex flex-column gap-2`}>
          <label className="text-sm" htmlFor="contact-email">
            Email
          </label>
          <InputText id="contact-email" className="p-inputtext-sm" placeholder="xxxxxx@xxxx"
            keyfilter="email"
            value={editingContact.value === "" ? null : editingContact.value}
            onChange={(e) => {
              setEditingContact({ ...editingContact, value: e.target.value, kind: contact.kind});
            }}
          ></InputText>
        </div>
      )
      break
    case ContactKind.Phone:
      contactInput = (
        <div className={`c-edit-contact-phone flex flex-column gap-2`}>
          <label className="text-sm" htmlFor="contact-phone">
            Phone
          </label>
          <InputText id="contact-phone" className="p-inputtext-sm"  placeholder="xxxx-xxxxxxxxx"
            value={editingContact.value === "" ? null : editingContact.value}
            onChange={(e) => {
              setEditingContact({ ...editingContact, value: e.target.value, kind: contact.kind });
            }}
          ></InputText>
        </div>
      )
      break
  }



  return (
    <Dialog
      header={`Edit ${contact.kind}`}
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
      <div className="c-edit-contact flex flex-column gap-4">
        {contactInput}
      </div>
    </Dialog>
  );
}

const ContactList = () => {
  const { draft } = useResumeEditorContext()
  const contacts = draft.contacts
  const [addContactKind, setAddContactKind] = useState(ContactKind.NotSpecified)
  const [openAdd, setOpenAdd] = useState(false);
  const menu: MutableRefObject<TieredMenu | null> = useRef(null);

  if (contacts === undefined || contacts === null) {
    return (<></>)
  }

  const add_items = [
    {
      label: "phone",
      icon: 'pi pi-mobile',
      command: () => {
        setAddContactKind(ContactKind.Phone)
        setOpenAdd(true)
      }
    },
    {
      label: "email",
      icon: 'pi pi-envelope',
      command: () => {
        setAddContactKind(ContactKind.Email)
        setOpenAdd(true)
      }
    }
  ]


  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Contact</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">

          <span
            className="pi pi-plus-circle"
            onClick={(e) => menu.current?.toggle(e)}
          ></span>
          <TieredMenu model={add_items} popup ref={menu} breakpoint="767px" />
          {options.togglerElement}
        </div>
      </div>
    );
  };

  let contactListContent: ReactNode
  if (Object.keys(contacts).length > 0) {
    contactListContent = Object.entries(contacts).map((entry) => {
      return (
        <div className="c-contact-item">
          <Contact contact={entry[1]} />
        </div>
      );
    })
  } else {
    contactListContent = (<span className="c-empty">No any contacts added yet.</span>)
  }

  return (
    <Panel
      headerTemplate={headerTemplate}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <AddContact
        kind={addContactKind}
        visible={openAdd}
        setVisible={setOpenAdd}
      />
      <div className="c-contacts flex flex-column gap-3">
          {contactListContent}
      </div>
    </Panel>
  );
};

export { EditContact, AddContact };
export default ContactList;
