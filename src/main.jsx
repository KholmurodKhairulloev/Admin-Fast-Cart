import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StyledEngineProvider } from "@mui/material";
import { Provider } from 'react-redux'
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <StyledEngineProvider>
      <App />
    </StyledEngineProvider>
    </Provider>
  </StrictMode>
);
