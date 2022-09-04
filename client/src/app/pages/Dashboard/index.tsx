import React from "react";
import Logout from "../Authentication/Logout";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        <li>Setup Redux / react-query </li>
        <li>
          Get user info by email (should be available with the AuthInfo. Store
          it in state after login)
        </li>
        <li>Rest of the stuff</li>
      </ul>
      <button>
        <Logout />
      </button>
    </div>
  );
};

export default Dashboard;
