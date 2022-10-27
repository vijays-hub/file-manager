import { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERROR_MESSAGE } from "../constants";
import { APIResponse } from "types";

const extractErrorInfo = (error: AxiosError) => {
  const { response } = error;
  const { data }: { data: APIResponse } = response as AxiosResponse;
  return data?.message || GENERIC_ERROR_MESSAGE;
};

const ACCESS_TOKEN_IDENTIFIER = "access_token";
const setAccessToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN_IDENTIFIER, token);

const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_IDENTIFIER) ?? "";

const removeAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);

export { extractErrorInfo, setAccessToken, getAccessToken, removeAccessToken };
