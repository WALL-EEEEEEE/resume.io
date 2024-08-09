import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./features/index";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeflex/primeflex.css";
import { Provider } from "react-redux";
import "./styles/app.css"
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { JobPanel } from "./features/panel/job";
import { ResumePanel, loader as ResumePanelLoader } from "./features/panel/resume";
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
