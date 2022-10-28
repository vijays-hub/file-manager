import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectAuthUser, selectUserProfile } from "store/auth/selectors";
import { fetchUserProfileAction } from "store/auth/slice";
import { useAppSelector, useTypedDispatch } from "store/hooks";
import Logout from "../Authentication/Logout";

const Dashboard = () => {
  const navigate = useNavigate();
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

      <p>List all uploads</p>
      <br />
      <br />

      <p>
        Download snippet is being screenshot'ed in Desktop. Look for other ways
        to download a buffer
      </p>

      <p>Disable edit of extention for renaming file.</p>

      <p>
        Move is supported only for folders. Use get all folders API to display
        the folders. The id used for that API is the id of the folder you want
        to move.
      </p>

      <button onClick={() => navigate("/upload-files")}>
        Upload More files
      </button>

      <br />
      <br />

      <button>
        <Logout />
      </button>
    </div>
  );
};

export default Dashboard;
