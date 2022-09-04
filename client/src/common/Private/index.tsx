import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAccessToken } from "utils";

export const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAccessToken()) {
      console.log({ tokn: getAccessToken() });
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
};
