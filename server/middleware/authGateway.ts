import { Request, Response, NextFunction } from "express";

const authGateway = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("Invoked Middleware!");
  return next();
};

export { authGateway };
