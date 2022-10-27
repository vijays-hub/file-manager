import { Request } from "express";
import { APIResponse } from "../../types";
import { getAccessTokenFromHeaders } from "../../utils/config/jwt";
import { UserSession } from "./types";

export const getAuthUserResponse = (token: string) =>
  ({
    status: "success",
    data: {
      isAuthenticated: true,
      email: JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
        .payload.email,
      accessToken: token,
    } as UserSession,
    message: "User is authenticated.",
  } as APIResponse);

export const getUserSessionFromRequest = (request: Request): UserSession => {
  const token = getAccessTokenFromHeaders(request);
  const { data }: { data: UserSession } = getAuthUserResponse(token);
  return data;
};
