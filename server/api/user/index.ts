import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { fetchUserByEmail } from "./fetchUserByEmail";

const router = express.Router();

router.get(
  "/user-by-email",
  authGateway,
  (request: Request, response: Response) =>
    fetchUserByEmail({ request, response })
);

export default router;
