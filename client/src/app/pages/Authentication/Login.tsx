import React, { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "services/api/auth";
import { APIResponse } from "types";
import { extractErrorInfo, setAccessToken } from "utils";
import { notifyError, notifySuccess } from "utils/notifications";
import { AuthInfo } from "./types";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const {
        data: { message, data: responseData },
      }: { data: APIResponse } = await login({ email, password });

      const { accessToken } = responseData as AuthInfo;
      setAccessToken(accessToken);
      notifySuccess(message);
      navigate("/dashboard");
    } catch (error) {
      notifyError(extractErrorInfo(error as AxiosError));
    }
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <br />
      <p>Add React Hook form and add validations for each field.</p>
      <input
        type="text"
        placeholder="Enter your email.."
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <br />
      <p>Add React Hook form and add validations for each field.</p>
      <input
        type="text" //TODO: Convert this to password.
        placeholder="Enter your password"
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <br />
      <br />

      <button onClick={() => loginUser()}>Let in</button>
      <br />
      <br />

      <p>
        Dropped in for the first time? <Link to={"/register"}>Sign Up</Link>{" "}
      </p>
    </div>
  );
};

export default Login;
