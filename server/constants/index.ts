import { APIResponse } from "../types";

const GENERIC_ERROR = {
  status: "error",
  data: null,
  message: "Something's not right. That's on us! Please try again later.",
} as APIResponse;

export { GENERIC_ERROR };
