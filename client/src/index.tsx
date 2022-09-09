import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Provider } from "react-redux";
import store from "store";

const MOUNT_NODE = document.getElementById("root") as HTMLElement;

const ROOT_APP = (
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);
ReactDOM.createRoot(MOUNT_NODE).render(ROOT_APP);
