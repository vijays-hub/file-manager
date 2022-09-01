import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const ROOT_ELEMENT = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(ROOT_ELEMENT).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
