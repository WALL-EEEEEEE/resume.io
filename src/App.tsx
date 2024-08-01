import Resume from "./features/resume/resume";
import CoverLetter from "./features/cover-letter/cover-letter";
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


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
      children: [
        {
          path: "cover_letter",
          element: <CoverLetter />,
        },
        {
          path: "resume",
          element: <Resume />,
        }
      ]
    }
  ])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
          <RouterProvider router={router}></RouterProvider>
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
