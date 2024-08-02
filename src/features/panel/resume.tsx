import ResumeList from "../resume/resume"
import CoverLetterList from "../cover-letter/cover-letter"
import { Resume, Resume as ResumeProps } from "../../types/resume"
import { Panel, PanelPassThroughOptions } from "primereact/panel"
import { Fieldset } from "primereact/fieldset"
import { Toolbar, ToolbarPassThroughOptions } from "primereact/toolbar"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from "primereact/button"
import { Rating } from "primereact/rating"
import { Tag } from "primereact/tag"
import { classNames } from "primereact/utils"
import { useState } from "react"

export function ResumePanel() {
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
    const itemTemplate = (resume: ResumeProps, index: number) => {
        return (
            <div className="col-12" key={resume.meta.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{resume.meta.name}</div>
                            <Rating value={10} readOnly cancel={false}></Rating>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{resume.meta.category}</span>
                                </span>
                                <Tag value={resume.meta.status}></Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const listTemplate = (items: ResumeProps[]) => {
        if (!items || items.length === 0) return null;

        let list = items.map((resume, index) => {
            return itemTemplate(resume, index);
        });
        console.log("list Template")

        return (
            <div className="grid grid-nogutter">
                {list}
                <div className="c-add-resume">
                    add
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
    console.log("??????")
    const resumes: ResumeProps[] = []

    return (
        <>
            <Panel className="min-h-screen" pt={panelPt}>
                <div className="flex flex-row gap-2 h-screen">
                    <div className="card h-screen">
                        <Toolbar center={centerContent} className="h-full" pt={toolBarPt} />
                    </div>
                    <Fieldset legend="Resume" className="min-h-full min-w-full">
                        <DataView value={resumes} listTemplate={listTemplate} className="min-h-screen" emptyMessage="??????">
                            <span>?????</span>
                        </DataView>
                    </Fieldset>
                </div>

            </Panel>
        </>)
}