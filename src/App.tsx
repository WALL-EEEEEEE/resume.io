import Resume from "./features/resume/resume";
import CoverLetter from "./features/cover-letter/cover-letter";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouterProvider,
} from "react-router-dom";
import Index from "./features/index";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeflex/primeflex.css";
import { Provider, useDispatch } from "react-redux";
import "./styles/app.css"
import { persistor, RootState, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { JobPanel } from "./features/panel/job";
import { ResumePanel, loader as ResumePanelLoader } from "./features/panel/resume";
import { User as UserProps } from "./types/user"
import { addUser as createUserAction } from "./features/user/user-list-slice"
import { v7 as uuidv7 } from "uuid"
import Login from "./features/login";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index/>,
      children: [
        {
          path: "login",
          element: <Login/>,
         
        },
        {
          path: "job",
          element: <JobPanel />,
         
        },
        {
          path: "resume",
          element: <ResumePanel/>,
          loader: (args) => {
              const rootState = store.getState()
              args.context = rootState.auth.auth
              return ResumePanelLoader(args)
          },
        }
      ]
    }
  ])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
          <RouterProvider router={ router }></RouterProvider>
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
