import React from "react";
import { useNavigate } from "react-router-dom";
import { removeAccessToken } from "utils";

const LogoutButton = () => {
  const navigate = useNavigate();
  return (
    <span
      onClick={() => {
        removeAccessToken();
        navigate("/login");
      }}
    >
      Logout
    </span>
  );
};

export default LogoutButton;
