import { TabMenu } from "primereact/tabmenu";
import { MenuItem } from "primereact/menuitem";
import { Outlet, useNavigate } from "react-router-dom";

const Index = () => {
   const navigate = useNavigate()
  const tab_menus: MenuItem[] = [
    { label: "Resume", icon:"pi pi-book", command: (e) => {
        navigate("resume")
    } },
    { label: "Cover Letter", icon:"pi pi-envelope", command: (e) => {
        navigate("cover_letter")
    } },
    { label: "Job Panel", icon:"pi pi-briefcase", disabled: true, command: (e) => {
        navigate("jobs")
    } },

  ]

  return (
    <div className="c-app flex flex-column align-items-center">
      <div className="c-header w-full h-3rem flex flex-row justify-content-between align-items-center">
        <div className="">
          <div className="c-logo ml-5 text-3xl font-semibold">
            <span>Resume</span>
          </div>
        </div>
        <div className="flex flex-row flex-no-wrap w-6 justify-content-between">
          <div className="c-nav flex flex-row justify-content-evenly gap-4 align-items-center">
            <TabMenu model={tab_menus}></TabMenu>
          </div>
          <div className="c-account flex flex-row mr-5 align-items-center">
            <div
              className="c-avatar min-w-min bg-cover border-circle"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #22c1c3 0%, #fdbb2d 100%)",
              }}
            >
              <div
                className="c-avatar-img bg-contain bg-center"
                style={{
                  backgroundImage: "url(images/avatar.webp)",
                  width: "30px",
                  height: "30px",
                }}
              ></div>
            </div>
            <div className="c-more-options">
              <span className="pi pi-ellipsis-v"></span>
            </div>
            <div className="c-name">
              <span>Wall'eeeeee</span>
            </div>
          </div>
        </div>
      </div>

      <div className="c-main w-9 mt-5">
        <Outlet />
      </div>
      <div className="c-footer">Copyright@walle</div>
    </div>
  );
};

export default Index;
