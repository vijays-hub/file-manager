import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { getUserByEmail } from "services/api/user";
import { APIResponse } from "types";
import { extractErrorInfo } from "utils";
import { notifyError } from "utils/notifications";
import Logout from "../Authentication/Logout";
import { User } from "../Authentication/types";

const Dashboard = () => {
  // TODO: Move this to redux (saga preferrably and then store it in REDUX).
  const [user, setUser] = useState<User | null>(null);
  const fetchUserInfo = async () => {
    try {
      const {
        data: { data: userInfo },
      }: { data: APIResponse } = await getUserByEmail("vijay@gmail.com");

      setUser(userInfo);
    } catch (error) {
      notifyError(extractErrorInfo(error as AxiosError));
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <br />
      <br />
      {user && <h3>Welcome back, {user.username}</h3>}
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
