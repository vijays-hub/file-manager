import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const PrivateRoute = () => {
  const navigate = useNavigate();
  //   const authUser = { id: "some", token: "some" };
  const authUser = null;
  console.log("Auth User ", authUser);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
};
