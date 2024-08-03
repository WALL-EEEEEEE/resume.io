import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { ContactKind, Contact as ContactProps, Phone } from "../../types/resume";
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TieredMenu } from "primereact/tieredmenu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { delContact as delContactAction, addContact as addContactAction, editContact as editContactAction } from "./resume-slice"


function AddContact({
  contactKind,
  visible,
  setVisible,
}: {
  contactKind: ContactKind
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [newContact, setNewContact]: [
    ContactProps,
    Dispatch<SetStateAction<ContactProps>>
  ] = useState({} as ContactProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          dispatch(addContactAction({...newContact}))
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
      header={`Add ${contactKind}`}
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
          <div className={`c-edit-contact-${contactKind} flex flex-column gap-2`}>
            <label className="text-sm" htmlFor={`contact-${contactKind}`}>
              {contactKind}
            </label>
            <InputText
              id={`contact-${contactKind}`}
              className="p-inputtext-sm"
              value={newContact.value === "" ? null : newContact.value}
              onChange={(e) => {
                setNewContact({ ...newContact, value: e.target.value, kind: contactKind });
              }}
              placeholder={contactKind === ContactKind.Phone ? "Ex: xxxx-xxx-xxx" : contactKind === ContactKind.Email ? "Ex: example@gmail.com" : ""}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function EditContact({
  contact,
  setContact,
  visible,
  setVisible,
}: {
  contact: ContactProps;
  setContact: Dispatch<SetStateAction<ContactProps>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [newContact, setNewContact]: [
    ContactProps,
    Dispatch<SetStateAction<ContactProps>>
  ] = useState(contact);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          setContact(newContact);
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
        <div className={`c-edit-contact-${contact.kind} flex flex-column gap-2`}>
          <label className="text-sm" htmlFor={`contact-${contact.kind}`}>
            {contact.kind}
          </label>
          <InputText
            id={`contact-${contact.kind}`}
            className="p-inputtext-sm"
            value={newContact.value}
            required
            onChange={(e) =>
              setNewContact({
                ...newContact,
                value: e.target.value ? e.target.value : newContact.value,
              })
            }
          />
        </div>

      </div>
    </Dialog>
  );
}

const ContactList = () => {
  const contacts = useSelector((state: RootState) => state.resume.resume?.contacts)
  const dispatch = useDispatch<AppDispatch>()
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

  return (
    <Panel
      headerTemplate={headerTemplate}
      {...(contacts.length > 0 ? { toggleable: true } : {})}
      {...(contacts.length > 0 ? { collapsed: true } : {})}
      expandIcon={PrimeIcons.ANGLE_DOWN}
      collapseIcon={PrimeIcons.ANGLE_UP}
    >
      <AddContact
        contactKind={addContactKind}
        visible={openAdd}
        setVisible={setOpenAdd}
      />

      {contacts.length > 0 ? (
        <ul className="flex flex-column gap-5">
          {contacts.map((contact, index) => {
            return (
              <li className="c-contact-item flex flex-row justify-content-between">
                <div className="flex flex-row gap-2 align-items-center">
                  {contact.kind === ContactKind.Phone && (
                    <span className="pi pi-mobile"></span>
                  )}
                  {contact.kind === ContactKind.Email && (
                    <span className="pi pi-envelope"></span>
                  )}
                  <span>{contact.value} </span>
                </div>
                <span className="pi pi-trash" onClick={(e) => dispatch(delContactAction(index))}></span>
              </li>
            );
          })}
        </ul>) : (<span className="c-empty">No any contacts added yet.</span>)
      }
    </Panel>
  );
};

export { EditContact, AddContact };
export default ContactList;
