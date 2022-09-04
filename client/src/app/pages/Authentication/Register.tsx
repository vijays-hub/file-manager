import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "services/api/auth";
import { APIResponse } from "types";
import { extractErrorInfo } from "utils";
import { notifyError, notifySuccess } from "utils/notifications";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const {
        data: { message },
      }: { data: APIResponse } = await register({
        username,
        email,
        password,
      });

      notifySuccess(message);
      navigate("/login");
    } catch (error) {
      notifyError(extractErrorInfo(error as AxiosError));
    }
  };

  return (
    <div className="App">
      <h1>Sign Up (Add more fields as needed)</h1>
      <br />
      <p>Add Validation for this</p>
      <input
        type="text"
        placeholder="Enter your username..."
        onChange={({ target: { value } }) => setUserName(value)}
      />
      <br />
      <p>Add Validation for this</p>
      <input
        type="text"
        placeholder="Enter your email.."
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <br />
      <p>Add Validation for this</p>
      <input
        type="text" //TODO: Convert this to password.
        placeholder="Enter your password"
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <br />
      <br />

      <button onClick={() => registerUser()}>Sign Up!</button>
      <br />
      <br />
    </div>
  );
};

export default Register;
