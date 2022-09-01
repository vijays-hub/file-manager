import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./app";

const MOUNT_NODE = document.getElementById("root") as HTMLElement;

const ROOT_APP = (
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
ReactDOM.createRoot(MOUNT_NODE).render(ROOT_APP);
