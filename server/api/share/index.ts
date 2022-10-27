import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { fetchSharedResources } from "./fetchSharedResources";
import { getRecipientsOfAssets } from "./getRecipientsOfAssets";
import { revokeAccessToFile } from "./removeAccessToFile";
import { removeSharedFolder } from "./removeSharedFolder";
import { shareViaEmail } from "./shareViaEmail";

const router = express.Router();

router.post("/", authGateway, (request: Request, response: Response) =>
  shareViaEmail({ request, response })
);

// This resource fetches all the files shared by other users.
router.get(
  "/shared-with-me",
  authGateway,
  (request: Request, response: Response) =>
    fetchSharedResources({ request, response })
);

// This resource fetches all the recipients of a particular file/folder shared by the user to manage the share access.
router.get("/recipients", authGateway, (request: Request, response: Response) =>
  getRecipientsOfAssets({ request, response })
);

// This resource removes the access for a particular file
router.delete(
  "/revoke-access",
  authGateway,
  (request: Request, response: Response) =>
    revokeAccessToFile({ request, response })
);

// This resource deletes the shared folder shared by other users.
router.delete(
  "/truncate-shared-folder",
  authGateway,
  (request: Request, response: Response) =>
    removeSharedFolder({ request, response })
);

export default router;
