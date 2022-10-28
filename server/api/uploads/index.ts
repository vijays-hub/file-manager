import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import createFolder from "./createFolder";
import deleteUploadsById from "./deleteUploadsById";
import { RENAME_ACTIONS } from "./enum";
import { fetchUserUploads } from "./fetchUserUploads";
import { moveFolder } from "./moveResources";
import { renameResources } from "./renameFileAndFolders";
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

router.post(
  "/move-folder",
  authGateway,
  (request: Request, response: Response) => moveFolder({ request, response })
);

router.post(
  "/rename-file",
  authGateway,
  (request: Request, response: Response) =>
    renameResources({ request, response, action: RENAME_ACTIONS.FILE })
);

router.post(
  "/rename-folder",
  authGateway,
  (request: Request, response: Response) =>
    renameResources({ request, response, action: RENAME_ACTIONS.FOLDER })
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
