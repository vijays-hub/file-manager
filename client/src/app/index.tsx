import React from "react";
import { PrivateRoute } from "common/Private";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "styles/GlobalStyles";
import theme from "styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Authentication/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer />

      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
