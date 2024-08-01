import { PrimeIcons } from "primereact/api";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Dispatch, HTMLAttributes, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TieredMenu } from "primereact/tieredmenu";
import { ImagePassThroughType, Image as ReactImage } from "primereact/image";
import { IconType } from "primereact/utils";
import { DashboardModal, DashboardModal as ImageUploadModal } from "@uppy/react";
import englishLocale from '@uppy/locales/lib/en_US';
import ImageEditor from '@uppy/image-editor';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createFile, getFile } from "../../utils/opfs";
import { addProfileImage, editProfileImage, delProfileImage } from "./resume-slice";
import Dashboard from "@uppy/dashboard/lib/Dashboard";

const profileImagesDirector = "profile/images"

type ImageProps = string

type AddImageProps = (image: ImageProps) => void;
type DelImageProps = AddImageProps;

async function generateImageURL(path: string): Promise<string> {
  let imageURL: string = ""
  if (path !== undefined && path != null && path.length > 0) {
    const imageFileHandle = await getFile(path)
    if (imageFileHandle !== null) {
      const imageFile = await imageFileHandle.getFile()
      imageURL = URL.createObjectURL(imageFile)
    }
  }
  return imageURL
}

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
      header={`Edit Image`}
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

const Image = () => {
  const image = useSelector((state: RootState) => state.resume.resume?.profileImage)
  const [imageURL, setImageURL] = useState("")
  const dispatch = useDispatch<AppDispatch>();

  const updateURL = async () => {
    if (image !== undefined && image !== null) {
      const url = await generateImageURL(image)
      setImageURL(url)
      console.log("updateURL->url", url)
    }
    console.log("updateURL", image)
  }
  useEffect(() => { updateURL() }, [image])

  const [uppy] = useState(() => new Uppy({
    id: "profile-image-upload",
    allowMultipleUploadBatches: false,
    restrictions: {
      maxNumberOfFiles: 1,
      minNumberOfFiles: 1,
      allowedFileTypes: [".jpg", ".jpeg", ".png", ".webp"],
    },
    locale: {
      ...englishLocale,
      strings: {
        ...englishLocale.strings,
        closeModal: "Close",
        dropPasteFiles: 'Drop image here or %{browseFiles}',
        browseFiles: 'browse image',
        xFilesSelected: {
          0: '%{smart_count} images selected',
          1: '%{smart_count} images selected',
        },
        uploadingXFiles: {
          0: 'Uploading %{smart_count} images',
          1: 'Uploading %{smart_count} images',
        },
        processingXFiles: {
          0: 'Processing %{smart_count} images',
          1: 'Processing %{smart_count} images',
        },
        uploadXFiles: {
          '0': 'Upload %{smart_count} images',
          '1': 'Upload %{smart_count} images',
        },
        uploadXNewFiles: {
          '0': 'Upload +%{smart_count} images',
          '1': 'Upload +%{smart_count} images',
        },
      }
    },
  }).use(ImageEditor).use(Dashboard));
  const dashboardModal = uppy.getPlugin("Dashboard");

  uppy.addUploader(async (fileIds, uploadId) => {
    //we just need to process the first file
    const uploadFileId = fileIds[0]
    const uploadFile = uppy.getFile(uploadFileId)
    const filename = uploadFile.name ? uploadFile.name : `profile_image.${uploadFile.extension}`
    const storePath = [profileImagesDirector, filename].join("/")
    console.log(storePath)
    try {
      await createFile(storePath, uploadFile.data)
    } catch (err) {
      console.trace(err)
    }
    dispatch(addProfileImage(storePath))
    //@ts-ignore
     if (dashboardModal.isModalOpen()) {
        //@ts-ignore
        dashboardModal.closeModal()
      }

  })
  const style = imageURL && imageURL.length > 0? {width: "250px", height: "250px", backgroundImage: `url("${imageURL}")`, backgroundSize: "cover", backgroundPosition: "center"}: {width: "250px", height: "250px"}

  return (
    <>
      {/* <EditImage
          image={image}
          setImage={setImage}
          visible={openAdd}
          setVisible={setOpenAdd}
      /> */}
      {/* <ImageUploadModal
        uppy={uppy}
        open={openImageUploader}
        singleFileFullScreen
        proudlyDisplayPoweredByUppy={false}
      /> */}
      <div id="c-image-uploader" className="c-image-uploader"></div>
      <div className="c-image-container p-card border-circle flex flex-row align-items-center justify-content-center surface-50" style={style}>
        {/* <ReactImage src={image} alt="Image" width="250" height="250" imageClassName="border-circle" pt={{toolbar: toolbar}} preview indicatorIcon={indicatorIcon}/>   */}
        {imageURL && imageURL.length > 0 ? (<div>
          {/* <img src={imageURL} alt="" width={250} height={250} className="border-circle" /> */}
        </div>) : (
          <div className="c-empty-image-tip flex flex-column align-items-center">
            <Button className="hover:none" icon="pi pi-plus-circle text-5xl text-bluegray-100 hover:text-bluegray-200" aria-label="add profile image" rounded text size="large" tooltip="Upload your profile image" tooltipOptions={{ event: "hover" }} onClick={(e) => {
              //@ts-ignore
              if (!dashboardModal.isModalOpen()) {
                //@ts-ignore
                dashboardModal.openModal()
              }
            }} />
          </div>
        )
        }
      </div>
    </>
  );
};

export { EditImage, AddImage };
export default Image;
