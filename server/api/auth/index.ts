import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { signIn } from "./signIn";

const router = express.Router();

router.post("/login", authGateway, (request: Request, response: Response) =>
  signIn({ request, response })
);

export default router;
