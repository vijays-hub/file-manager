import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { getAccessTokenFromHeaders } from "../../utils/config/jwt";
import { getAuthUserResponse } from "./constants";
import { fetchUserByEmail } from "./fetchUserByEmail";

const router = express.Router();

router.get("/auth", authGateway, (request: Request, response: Response) => {
  const token = getAccessTokenFromHeaders(request);
  response.status(200).send(getAuthUserResponse(token));
});

router.get(
  "/user-by-email",
  authGateway,
  (request: Request, response: Response) =>
    fetchUserByEmail({ request, response })
);

export default router;
