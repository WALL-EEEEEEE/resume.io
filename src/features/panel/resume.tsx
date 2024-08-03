import Resume from "../resume/resume"
import CoverLetter from "../cover-letter/cover-letter"
import { Resume as ResumeProps } from "../../types/resume"
import { User as UserProps } from "../../types/user"
import { Panel, PanelPassThroughOptions } from "primereact/panel"
import { Fieldset } from "primereact/fieldset"
import { Toolbar, ToolbarPassThroughOptions } from "primereact/toolbar"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from "primereact/button"
import { Rating } from "primereact/rating"
import { Tag } from "primereact/tag"
import { classNames } from "primereact/utils"
import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import dataset from "../../data/resume.io_exported_data.json"
import { getFile } from "../../utils/opfs"
import "./resume.css"
import { ProgressSpinner } from "primereact/progressspinner"
import { OverlayPanel } from "primereact/overlaypanel"
import { Dialog } from "primereact/dialog"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { addUser as createUserAction } from "../user/user-list-slice"
import { v7 as uuidv7 } from "uuid"
import { LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from "react-router-dom"
import { Auth } from "../../types/auth"



export async function loader(args: LoaderFunctionArgs<Auth>) {
    const auth = args.context
    if (auth === undefined || auth === null || !auth.status || auth.user === undefined || auth.user === null) {
        return redirect("/login")
    }
    return auth.user
    /*

    */
}


export function ResumePanel() {
    const user_id: string = useLoaderData() as string
    const dispatch = useDispatch()

    const resumeList = useSelector((state: RootState) => {
        const userInfo = state["user-list"][user_id]
        const resumes = state["resume-list"]
        const resumeIdList = userInfo.resumes
        const resumeList: ResumeProps[] = []
        for (const resume_id of resumeIdList) {
            if (!resumes[resume_id]) {
                continue
            }
            const resume = resumes[resume_id]
            resumeList.push(resume)
        }
        return resumeList
    })
    const [layout, setLayout] = useState('grid');
    const centerContent = (
        <>
            <Button unstyled className="h-3rem w-3rem flex flex-row align-items-center just-content-center border-circle border-1 border-transparent border-surface" tooltip="Resume" tooltipOptions={{ event: "hover" }}>
                <img src="/images/resume-icon.svg" className="h-2rem w-2rem"></img>
            </Button>
            <Button unstyled className="h-3rem w-3rem flex flex-row align-items-center just-content-center border-circle border-1 border-transparent border-surface" tooltip="Cover Letter" tooltipOptions={{ event: "hover" }} >
                <img src="/images/cover-letter-icon.svg" className="h-2rem w-2rem"></img>
            </Button>
        </>
    );
    const panelPt: PanelPassThroughOptions = {
        content: {
            className: "min-h-screen",
        },
        toggleableContent: {
            className: "min-h-screen",
        }

    }
    const toolBarPt: ToolbarPassThroughOptions = {
        center: {
            className: "flex flex-column gap-3"
        }
    }
    const AsyncImage = ({ image, loader }: { image: string, loader: () => Promise<string> }) => {
        const [pendingimage, setPendingImage] = useState(image)
        useEffect(() => {
            loader().then((image: string) => {
                console.log(image)
                setPendingImage(image)
            }).catch((e: Error) => {
                console.trace(`error occurred in fetching ${image}`, e)
            })
        }, [])

        return (
            <div className="flex flex-row align-items-center h-full w-full justify-content-center" style={{ backgroundImage: `url("${pendingimage}")`, backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}>
                <Button icon="pi pi-eye" className="c-resume-edit-icon w-3rem h-3rem border-circle border-none "></Button>
            </div>
        )
    }

    const ItemTemplate = (resume: ResumeProps, index: number) => {
        const imageLoader = async () => {
            if (resume.profileImage === undefined || resume.profileImage === null) {
                return ""
            }
            const imageFile = await getFile(resume.profileImage)
            if (imageFile === undefined || imageFile === null) {
                return ""
            }
            const blob = URL.createObjectURL(await imageFile.getFile())
            console.log(blob)
            return blob
        }
        const image = resume.profileImage == undefined || resume.profileImage == null ? "" : resume.profileImage

        return (
            <div className="c-panel-item flex flex-row align-items-center justify-content-center col-4 border-primary border-1 max-w-12rem border-round-md" style={{ aspectRatio: "1/1" }}>
                <div className="c-resume-item flex flex-column w-full h-full align-items-center justify-content-between">
                    <AsyncImage image={image} loader={imageLoader}></AsyncImage>
                    <div className="flex flex-column gap-2 align-items-center w-full">
                        <div className="flex flex-row justify-content-center gap-2 align-items-center">
                            <span className="c-resume-info-name"> {resume.meta.name} </span>
                            <span className="c-resume-info-status pi pi-verified "></span>
                        </div>
                        <span className="c-resume-info-time flex flex-row justify-content-end block w-full">
                            <span className="c-resume-info-uploaded-time text-xs pr-3 pb-2">{resume.meta.updatedTime}</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    };
    const ListTemplate = (items: ResumeProps[]) => {
        const [toggle, setToggle] = useState(false)
        let list = items.map((resume, index) => {
            return ItemTemplate(resume, index);
        });
        return (
            <div className="grid grid-nogutter gap-4 justify-content-start" style={{ margin: "0 auto", overflow: "scroll" }}>
                {list}
                <div className="c-panel-item flex flex-row align-items-center justify-content-center col-4 border-primary border-1 border-round-md max-w-12rem" style={{ aspectRatio: "1/1" }}>
                    <div className="c-add-resume">
                        <Button icon="pi pi-plus-circle" className="w-3rem h-3rem border-circle border-none " onClick={() => {
                            console.log("try to add resume")
                            setToggle(true)
                            console.log("try to add resume", toggle)
                        }
                        } />
                    </div>
                    <AddResume toggle={toggle} onClose={ () => { setToggle(false) }}/>
                </div>
            </div>

        );
    };
    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        <>
            <Panel className="min-h-screen" pt={panelPt}>
                <div className="flex flex-row gap-2 h-screen">
                    <div className="card h-screen">
                        <Toolbar center={centerContent} className="h-full" pt={toolBarPt} />
                    </div>
                    <Fieldset legend="Resume" className="min-h-full min-w-full">
                        <DataView value={resumeList} listTemplate={ListTemplate} className="min-h-screen" style={{ overflow: "scroll" }} rows={11} paginator>
                        </DataView>
                    </Fieldset>
                </div>

            </Panel>
        </>)
}

export function ViewResume({ resume, toggle }: { resume: ResumeProps, toggle: boolean }) {
    const dispatch = useDispatch<AppDispatch>()
    let setToggle
    [toggle, setToggle] = useState(toggle)

    const footer = (
        <div className="actions">
            <Button label="Save" icon="pi pi-check-circle" onClick={() => {
                // dispatch(editCoverLetterAction([{ ...editCoverLetter }, coverLetterId]))
                if (toggle) {
                    setToggle(false)
                }
            }} />
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => {
                if (toggle) {
                    setToggle(false)
                }
            }} autoFocus className="p-button-text" />
        </div>
    );
    return (
        <Dialog header="View Resume" visible={toggle} draggable={false} resizable={false} maximizable={true} style={{ width: '50vw' }} onHide={() => { if (!toggle) return; setToggle(false); }} footer={footer}>
            <Resume />
        </Dialog>
    )
}

export function AddResume({ toggle, onClose }: { toggle: boolean, onClose: ()=>void }) {
    console.log("inside AddResume 1", toggle);
    const dispatch = useDispatch<AppDispatch>();

    const footer = (
        <div className="actions">
            <Button label="Save" icon="pi pi-check-circle" onClick={() => {
                onClose()
            }} />
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => {
                console.log("cancel")
                onClose()
            }} autoFocus className="p-button-text" />
        </div>
    );
    return (
        <Dialog header="Add Resume" visible={toggle} draggable={false} resizable={false} maximizable={true} style={{ width: '50vw' }} onHide={() => { 
              onClose()
            }} footer={footer}>
            <Resume />
        </Dialog>
    )
}