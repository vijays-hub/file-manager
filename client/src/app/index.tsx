import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "styles/GlobalStyles";
import theme from "styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Authentication/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Authentication/Register";
import ProtectedRoute from "common/Private";
import { useTypedDispatch } from "store/hooks";
import { initAuthAction } from "store/auth/slice";

function App() {
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(initAuthAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer />

      <Routes>
        <Route
          path="/dashboard"
          element={<ProtectedRoute outlet={<Dashboard />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
