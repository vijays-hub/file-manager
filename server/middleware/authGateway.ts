import { Request, Response, NextFunction } from "express";
import { getErrorResponse } from "../utils";
import { verifyAccessToken } from "../utils/config/jwt";

const authGateway = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader)
    return response
      .status(401)
      .send(
        getErrorResponse("You are not authorized to access this resource.")
      );
  const token = authHeader.split(" ")[1];
  const statusCode: number = await verifyAccessToken(token);

  // TODO: Use Refresh tokens to generate new access token and don't ask user to sign in again.
  if (statusCode === 403 || statusCode === 401)
    return response
      .status(403)
      .send(getErrorResponse("Token expired or Invalid. Please login again"));

  next();
};

export { authGateway };
