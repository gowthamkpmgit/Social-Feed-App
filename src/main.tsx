import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StyledEngineProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

import { store } from "./auth/redux/store.tsx";
import { Provider } from "react-redux";
createRoot(document.getElementById("root")!).render(
  <StyledEngineProvider injectFirst>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      toastStyle={{
        fontSize: "14px",
        color: "#000",
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </StyledEngineProvider>,
);
