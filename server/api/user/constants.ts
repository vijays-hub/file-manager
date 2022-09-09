import { APIResponse } from "../../types";

export const getAuthUserResponse = (token: string) =>
  ({
    status: "success",
    data: {
      isAuthenticated: true,
      email: JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
        .payload.email,
      accessToken: token,
    },
    message: "User is authenticated.",
  } as APIResponse);
