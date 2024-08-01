import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Dispatch, HTMLAttributes, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TieredMenu } from "primereact/tieredmenu";
import { ImagePassThroughType, Image as ReactImage } from "primereact/image";
import { IconType } from "primereact/utils";


type ImageProps = string

type AddImageProps = (image: ImageProps) => void;
type DelImageProps = AddImageProps;

function AddImage({
  addImage,
  visible,
  setVisible,
}: {
  addImage: AddImageProps;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {

  const [newImage, setNewImage]: [
    ImageProps,
    Dispatch<SetStateAction<ImageProps>>
  ] = useState({} as ImageProps);

  const footer = (
    <div className="c-actions">
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          addImage(newImage);
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
      header={`Add Image`}
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
        <div className="c-add-image flex flex-column gap-4">
        </div>
      </div>
    </Dialog>
  );
}

function EditImage({
  image,
  setImage,
  visible,
  setVisible,
}: {
  image: ImageProps;
  setImage: Dispatch<SetStateAction<ImageProps>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [newImage, setNewImage]: [
    ImageProps,
    Dispatch<SetStateAction<ImageProps>>
  ] = useState(image);

  const footer = (
    <>
      <Button
        label="Save"
        icon="pi pi-check-circle"
        onClick={() => {
          setImage(newImage);
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
      header={ `Edit Image` }
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
      <div className="c-edit-image flex flex-column gap-4">

      </div>
    </Dialog>
  );
}

const Image = ({ image }: { image: ImageProps }) => {
  let setImage: Dispatch<SetStateAction<ImageProps>>;
  [image, setImage] = useState(image);
  const [openAdd, setOpenAdd] = useState(false);
  const menu: MutableRefObject<TieredMenu|null> = useRef(null);
  const add_items  = [
    { label: "phone", 
      icon: 'pi pi-mobile',
      command: () => {
        setOpenAdd(true)
      }
    },
    {
      label: "email", 
      icon: 'pi pi-envelope',
      command: () => {
        setOpenAdd(true)
      }
    }
  ]

  const addImage: AddImageProps = (image: ImageProps) => {
    setImage(image);
  };
  const delImage: DelImageProps = () => {
    setImage("");
  };

  const headerTemplate = (options: PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="p-panel-title">Image</span>
        </div>
        <div>

          <span
            className="pi pi-plus-circle"
            onClick={(e) => menu.current?.toggle(e) }
          ></span>
           <TieredMenu model={add_items} popup ref={menu} breakpoint="767px" />
          {options.togglerElement}
        </div>
      </div>
    );
  };

  const indicatorIcon: IconType<ImageProps>   = (
    <span className="pi pi-pen-to-square"></span>
  )
  const toolbar: ImagePassThroughType<HTMLAttributes<HTMLDivElement>> = (
    <span> hello</span>
  )

  return (
    <>    
      <EditImage
          image={image}
          setImage={setImage}
          visible={openAdd}
          setVisible={setOpenAdd}
      />
       <ReactImage src={image} alt="Image" width="250" height="250" imageClassName="border-circle" pt={{toolbar: toolbar}} preview indicatorIcon={indicatorIcon}/>
    </>
  );
};

export { EditImage, AddImage};
export default Image;
