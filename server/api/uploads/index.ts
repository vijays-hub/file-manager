import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import createFolder from "./createFolder";
import { fetchUserUploads } from "./fetchUserUploads";
import uploadFiles from "./uploadFiles";

const router = express.Router();

router.get(
  "/uploads-by-id",
  authGateway,
  (request: Request, response: Response) =>
    fetchUserUploads({ request, response })
);

router.post("/", authGateway, (request: Request, response: Response) =>
  uploadFiles({ request, response })
);

router.post(
  "/create-folder",
  authGateway,
  (request: Request, response: Response) => createFolder({ request, response })
);

export default router;
