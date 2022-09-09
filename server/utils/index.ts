import { APIResponse } from "../types";

const getErrorResponse = (message: string) =>
  ({
    status: "error",
    data: null,
    message,
  } as APIResponse);

const getSuccessResponse = ({ data, message }: Partial<APIResponse>) =>
  ({
    status: "success",
    data,
    message,
  } as APIResponse);

export { getErrorResponse, getSuccessResponse };
