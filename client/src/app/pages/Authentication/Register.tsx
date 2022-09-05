import { AxiosError } from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "services/api/auth";
import { APIResponse } from "types";
import { extractErrorInfo } from "utils";
import { notifyError, notifySuccess } from "utils/notifications";
import { emailRegEx, passwordRegex } from "utils/regex";
import { RegisterInput } from "./types";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>();

  const onRegisterFormSubmit: SubmitHandler<RegisterInput> = async (
    registerFormData
  ) => {
    const { email, password, username } = registerFormData;
    try {
      const {
        data: { message },
      }: { data: APIResponse } = await registerUser({
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
      <form onSubmit={handleSubmit(onRegisterFormSubmit)}>
        <input
          type="text"
          placeholder="Enter your username"
          {...register("username")}
        />
        <br />
        <br />

        <input
          type="text"
          placeholder="Enter your email"
          {...register("email", {
            pattern: emailRegEx,
          })}
        />
        <br />
        {errors.email && <p style={{ color: "red" }}>Invalid Email</p>}
        <br />

        <input
          type="text" //TODO: Convert this to password.
          placeholder="Enter your password"
          {...register("password", {
            pattern: passwordRegex,
          })}
        />
        {errors.password && (
          <p style={{ color: "red" }}>
            Password should be eight characters, at least one uppercase letter,
            one lowercase letter, one number and one special character
          </p>
        )}

        <br />
        <br />
        <button type="submit">Join Us</button>
      </form>
      <br />
      <br />
      <p>
        Been here before?
        <Link to={"/login"}> Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
