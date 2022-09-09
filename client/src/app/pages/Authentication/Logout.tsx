import React from "react";
import { useNavigate } from "react-router-dom";
import { useTypedDispatch } from "store/hooks";
import { removeAccessToken } from "utils";

const LogoutButton = () => {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAccessToken();
    dispatch({
      type: "LOGOUT_ATTEMPT",
    });
    navigate("/login");
  };

  return <span onClick={() => handleLogout()}>Logout</span>;
};

export default LogoutButton;
