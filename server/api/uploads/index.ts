import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import createFolder from "./createFolder";
import deleteUploadsById from "./deleteUploadsById";
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

router.delete(
  "/delete-file",
  authGateway,
  (request: Request, response: Response) =>
    deleteUploadsById({ request, response })
);

router.delete(
  "/delete-directory",
  authGateway,
  (request: Request, response: Response) =>
    deleteUploadsById({ request, response, deleteDirectories: true })
);

export default router;
