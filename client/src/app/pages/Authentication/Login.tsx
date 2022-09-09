import React, { useEffect } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "services/api/auth";
import { APIResponse } from "types";
import { extractErrorInfo, getAccessToken, setAccessToken } from "utils";
import { notifyError, notifySuccess } from "utils/notifications";
import { AuthInfo, LoginInput } from "./types";
import { SubmitHandler, useForm } from "react-hook-form";
import { emailRegEx } from "utils/regex";
import { useAppSelector, useTypedDispatch } from "store/hooks";
import { setAuthInfo } from "store/auth/slice";
import { selectAuthUser } from "store/auth/selectors";

const Login = () => {
  const dispatch = useTypedDispatch();
  const authUser = useAppSelector(selectAuthUser);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onLoginFormSubmit: SubmitHandler<LoginInput> = async (data) => {
    const { email, password } = data;
    try {
      const {
        data: { message, data: responseData },
      }: { data: APIResponse } = await login({ email, password });

      const { accessToken } = responseData as AuthInfo;
      setAccessToken(accessToken); // Store it in local storage.
      dispatch(
        setAuthInfo({
          accessToken,
          email,
        })
      );

      notifySuccess(message);
      navigate("/dashboard");
    } catch (error) {
      notifyError(extractErrorInfo(error as AxiosError));
    }
  };

  useEffect(() => {
    if (getAccessToken() !== "") navigate("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <div className="App">
      <h1>Login</h1>
      <br />
      <br />

      <form onSubmit={handleSubmit(onLoginFormSubmit)}>
        <input
          type="text"
          placeholder="Enter your email.."
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
          {...register("password")}
        />

        <br />
        <br />
        <button type="submit">Let in</button>
      </form>
      <br />
      <br />
      <p>
        Dropped in for the first time? <Link to={"/register"}>Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
