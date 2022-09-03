import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { fetchUserUploads } from "./fetchUserUploads";

const router = express.Router();

router.get("/", authGateway, (request: Request, response: Response) =>
  fetchUserUploads({ request, response })
);

export default router;
