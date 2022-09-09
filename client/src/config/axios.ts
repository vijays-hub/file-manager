import axios from "axios";
import { getAccessToken } from "utils";

type AxiosConfigOptions = {
  contentType?: string;
};

export const apiInstance = (configOptions?: AxiosConfigOptions) => {
  const CORE_API_INSTANCE = axios.create({
    baseURL: process.env.REACT_APP_CORE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      ...configOptions,
    },
  });

  return CORE_API_INSTANCE;
};
