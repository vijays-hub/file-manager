import React, { useEffect } from "react";
import { selectAuthUser, selectUserProfile } from "store/auth/selectors";
import { fetchUserProfileAction } from "store/auth/slice";
import { useAppSelector, useTypedDispatch } from "store/hooks";
import Logout from "../Authentication/Logout";

const Dashboard = () => {
  const dispatch = useTypedDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const userProfile = useAppSelector(selectUserProfile);

  useEffect(() => {
    if (!userProfile && authUser)
      dispatch(fetchUserProfileAction({ email: authUser?.email as string }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <div>
      <h1>Dashboard</h1>
      <br />
      <br />
      {<h3>Welcome back, {userProfile?.username}</h3>}
      <br />
      <br />
      <ul>
        <li>Setup Redux / react-query </li>
        <li>
          Get user info by email (should be available with the AuthInfo. Store
          it in state after login)
        </li>
        <li>Rest of the stuff</li>
      </ul>
      <br />
      <br />
      <br />
      <button>
        <Logout />
      </button>
    </div>
  );
};

export default Dashboard;
